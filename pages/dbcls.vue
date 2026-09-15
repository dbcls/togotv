<template>
  <div class="dbcls_wrapper">
    <section class="intro_section">
      <h2 class="tsukushi bold">{{ $t('dbcls_title') }}</h2>
      <div class="intro_content_wrapper">
        <div class="intro_image_wrapper">
          <img src="~/assets/img/welcome_main.png" alt="DBCLS" />
        </div>
        <div class="intro_text">
          <p>{{ $t('dbcls_intro_1') }}</p>
          <p>{{ $t('dbcls_intro_2') }}</p>
          <p class="dbcls_link">
            <i18n path="dbcls_contact" tag="span">
              <template v-slot:site>
                <a href="https://dbcls.rois.ac.jp/" target="_blank" rel="noopener noreferrer">{{ $t('official_website') }}</a>
              </template>
            </i18n>
          </p>
        </div>
      </div>
    </section>

    <section class="video_section">
      <ul>
        <li v-for="category in categories" :key="category.id">
          <h3 class="category_name">
            <span class="tsukushi bold">{{ $t(category.title) }}</span>
            <span class="total_count mont bold">
              <span class="count">{{ category.videos.length }}</span>
              <span class="unit">{{ $t('videos_unit') }}</span>
            </span>
          </h3>
          <VideoListHorizontalScroll
            v-if="category.videos.length > 0"
            :props="{
              id: `video_${category.id}`,
              playList: category.videos,
              bg: 'white'
            }"
          />
          <p v-else class="no_videos">{{ $t('no_videos') }}</p>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import Vue from "vue";
import VideoListHorizontalScroll from "~/components/VideoListHorizontalScroll.vue";
import axios from "axios";

export default Vue.extend({
  components: {
    VideoListHorizontalScroll
  },
  data() {
    return {
      categories: [
        {
          id: "new",
          title: "new_videos",
          videos: []
        },
        {
          id: "lecture",
          title: "dbcls_lecture_videos",
          videos: []
        },
        {
          id: "database",
          title: "dbcls_howto_videos",
          videos: []
        }
      ],
      allDbclsVideos: []
    };
  },
  created() {
    this.fetchDbclsVideos();
  },
  head() {
    return {
      title: this.$t("dbcls_page_title"),
      meta: [
        { hid: "og:title", property: "og:title", content: this.$t("dbcls_page_title") },
        {
          hid: "og:description",
          property: "og:description",
          content: this.$t("dbcls_page_description")
        },
        {
          hid: "og:url",
          property: "og:url",
          content: process.client ? location.href : ""
        }
      ]
    };
  },
  methods: {
    async fetchDbclsVideos() {
      try {
        // DBCLSタグを持つ動画を検索
        const response = await axios.get(
          `https://togotv-api.dbcls.jp/api/search?keywords=DBCLS&rows=1000`
        );

        this.allDbclsVideos = response.data.data || [];

        // カテゴリーごとに動画を分類
        this.categorizeVideos();
      } catch (error) {
        console.error("DBCLSの動画取得に失敗しました:", error);
      }
    },
    categorizeVideos() {
      if (this.allDbclsVideos.length === 0) return;

      // 新着動画: 最新の10件
      const sortedByDate = [...this.allDbclsVideos].sort((a, b) => {
        const dateA = new Date(a.uploadDate || a.date || 0);
        const dateB = new Date(b.uploadDate || b.date || 0);
        return dateB - dateA;
      });
      this.categories[0].videos = sortedByDate.slice(0, 10);

      // 講演動画: キーワードに「講演」「AJACS」「セミナー」を含むもの
      this.categories[1].videos = this.allDbclsVideos.filter(video => {
        const keywords = (video.keywords || []).join(" ");
        const name = video.name || "";
        const description = video.description || "";
        const searchText = `${keywords} ${name} ${description}`.toLowerCase();
        return (
          searchText.includes("講演") ||
          searchText.includes("ajacs") ||
          searchText.includes("セミナー") ||
          searchText.includes("lecture")
        );
      });

      // データベースの使い方: 「講演」以外の動画
      this.categories[2].videos = this.allDbclsVideos.filter(video => {
        const keywords = (video.keywords || []).join(" ");
        const name = video.name || "";
        const description = video.description || "";
        const searchText = `${keywords} ${name} ${description}`.toLowerCase();
        return !(
          searchText.includes("講演") ||
          searchText.includes("ajacs") ||
          searchText.includes("セミナー") ||
          searchText.includes("lecture")
        );
      });
    }
  }
});
</script>

<style lang="sass" scoped>
.dbcls_wrapper
  > .intro_section
    margin-top: 40px
    padding: 0 $VIEW_PADDING
    > h2
      font-size: 27px
      text-align: center
      margin-bottom: 30px
      position: relative
      display: inline-block
      width: 100%
      &:before,
      &:after
        content: ''
        width: 34px
        height: 2px
        background-color: $MAIN_COLOR
        position: absolute
        bottom: -8px
      &:before
        transform: rotate(45deg)
        left: calc(50% - 60px)
      &:after
        transform: rotate(-45deg)
        right: calc(50% - 60px)
    > .intro_content_wrapper
      max-width: 890px
      margin: 0 auto
      > .intro_image_wrapper
        text-align: center
        margin-bottom: 30px
        > img
          max-width: 100%
          height: auto
      > .intro_text
        font-size: 16px
        line-height: 27px
        text-align: left
        > p
          margin: 0 0 15px 0
          &.dbcls_link
            margin-top: 20px
            font-weight: 600
            > a
              color: $MAIN_COLOR
              text-decoration: none
              &:hover
                text-decoration: underline
  > .video_section
    margin-top: 50px
    > ul
      > li
        margin-top: 32px
        &:first-of-type
          margin-top: 0
        > h3.category_name
          padding-left: $VIEW_PADDING
          position: relative
          z-index: $LAYER_2
          display: flex
          align-items: center
          margin-bottom: 8px
          > span
            font-size: 18px
            display: flex
            align-items: center
            &:before
              min-width: 26px
              width: 26px
              height: 26px
              margin-right: 2px
              margin-top: -1px
              @include icon('video')
          > .total_count
            margin-left: auto
            padding-right: $VIEW_PADDING
            font-size: 16px
            color: $MAIN_COLOR
            > .count
              font-size: 20px
              margin-right: 2px
            > .unit
              font-size: 12px
        > .no_videos
          padding-left: $VIEW_PADDING
          color: #999
          font-size: 14px

@media screen and (max-width: 896px)
  .dbcls_wrapper
    > .intro_section
      padding: 0 $VIEW_PADDING_SP
      margin-top: 20px
      > h2
        font-size: 22px
        &:before,
        &:after
          display: none
      > .intro_content_wrapper
        > .intro_text
          font-size: 14px
          line-height: 24px
    > .video_section
      margin-top: 30px
      > ul
        > li
          > h3.category_name
            padding-left: $VIEW_PADDING_SP
            flex-direction: column
            align-items: flex-start
            > .total_count
              margin: 0
              padding-right: 0
              padding-left: $VIEW_PADDING_SP
          > .no_videos
            padding-left: $VIEW_PADDING_SP
</style>
