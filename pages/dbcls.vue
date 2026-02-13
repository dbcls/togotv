<template>
  <div class="dbcls_wrapper">
    <section class="intro_section">
      <h2 class="tsukushi bold">DBCLS解説動画集</h2>
      <div class="intro_content_wrapper">
        <div class="intro_image_wrapper">
          <img src="~/assets/img/welcome_main.png" alt="DBCLS" />
        </div>
        <div class="intro_text">
          <p>
            DBCLSでは、国内外のデータベースの統合化をはじめ、データベース利用者の利便性向上を目的としたアプリケーションや基盤技術の研究開発を行っています。また、各種データや既存のデータベースの統合化支援や、そのためのデータ標準化の整備を進めています。これらの研究開発および諸活動は、国内外の多くの関連する研究機関と連携して進めています。
          </p>
          <p>
            こちらの特設ページでは、DBCLSが提供するデータベースやツールの使い方を解説した動画をご覧いただけます。研究に役立つ様々なリソースの活用方法から開発のコンセプトまで、動画でわかりやすく学ぶことができます。
          </p>
          <p class="dbcls_link">
            DBCLSの研究開発活動へのお問い合わせは、 <a href="https://dbcls.rois.ac.jp/" target="_blank" rel="noopener noreferrer">公式ウェブサイト</a> をご覧ください。
          </p>
        </div>
      </div>
    </section>

    <section class="video_section">
      <ul>
        <li v-for="category in categories" :key="category.id">
          <h3 class="category_name">
            <span class="tsukushi bold">{{ category.title }}</span>
            <span class="total_count mont bold">
              <span class="count">{{ category.videos.length }}</span>
              <span class="unit">本</span>
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
          <p v-else class="no_videos">動画がありません</p>
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
          title: "新着動画",
          videos: []
        },
        {
          id: "lecture",
          title: "講演動画",
          videos: []
        },
        {
          id: "database",
          title: "データベースの使い方",
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
      title: "DBCLS動画",
      meta: [
        { hid: "og:title", property: "og:title", content: "DBCLS動画" },
        {
          hid: "og:description",
          property: "og:description",
          content: "DBCLSが提供するデータベースやツールの使い方を解説した動画"
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
