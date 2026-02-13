<template>
  <div class="heritage_trees_wrapper">
    <section class="intro_section">
      <h2 class="tsukushi bold">京都府立植物園 Heritage Trees Project x Togo Picture Gallery 特設サイト</h2>
      <div class="intro_content_wrapper">
        <div class="intro_image_wrapper">
          <img src="~/assets/img/welcome_main.png" alt="Heritage Trees" />
        </div>
        <div class="intro_text">
          <p>
            ヘリテージツリーズ（Heritage Trees, 歴史遺産樹木)は、日本最古の公立植物園である京都府立植物園が開園１００年を記念して園内の貴重なお宝樹木を紹介するプロジェクトです。統合TVでは、京都府立植物園とのコラボレーションのもと、日本の植物史を体現する38本の樹木を体系的にイラスト化することにより、教育・研究・保全の基盤資料として公開しています。中には街路樹のような馴染み深い樹木も多く、環境科学的にも重要な資料になっています。また、長寿個体の形態・生態情報を後世に伝えるだけでなく、植物導入史・景観史・都市環境下での樹木の変化に着目する資料として利用していただけるように、季節ごとの特徴をとらえたイラストを公開しています。

          </p>
          <p>
            樹齢数百年を超える巨木や、地域に根ざした伝統的な樹木など、日本の自然遺産を美しいイラストとともにご覧いただけます。四季折々の表情を見せる樹木たちをお楽しみください。
          </p>
          <p class="heritage_link">
            ヘリテージツリーズプロジェクトについて詳しくは、<a href="https://www.pref.kyoto.jp/plant/heritagetrees/" target="_blank" rel="noopener noreferrer">京都府立植物園公式サイト</a> をご覧ください。
          </p>
        </div>
      </div>
    </section>

    <section class="image_section">
      <ul>
        <li v-for="category in categories" :key="category.id">
          <h3 class="category_name">
            <span class="tsukushi bold">{{ category.title }}</span>
            <span class="total_count mont bold">
              <span class="count">{{ category.images.length }}</span>
              <span class="unit">枚</span>
            </span>
          </h3>
          <div v-if="category.images.length > 0" class="horizontal_scroll_wrapper">
            <div class="image_scroll_container">
              <ul class="image_list">
                <li v-for="image in category.images" :key="image.id" class="image_item">
                  <a :href="localePath(`/${image.id.split('/').pop()}.html`)" @click="handleNavigation($event, `/${image.id.split('/').pop()}.html`)">
                    <img
                      :src="`https://dbarchive.biosciencedbc.jp/data/togo-pic/image/${image.png}`"
                      :alt="image.name"
                      loading="lazy"
                    />
                  </a>
                  <div :class="['image_description', $i18n.locale]">
                    <p v-if="$i18n.locale === 'ja'" class="name tsukushi bold">{{ image.name }}</p>
                    <p v-if="$i18n.locale === 'en'" class="name_en mont">{{ image.name_en }}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <p v-else class="no_images">画像がありません</p>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";

export default Vue.extend({
  data() {
    return {
      categories: [
        {
          id: "new",
          title: "新着画像",
          images: []
        },
        {
          id: "spring",
          title: "春",
          images: []
        },
        {
          id: "summer",
          title: "夏",
          images: []
        },
        {
          id: "autumn",
          title: "秋",
          images: []
        },
        {
          id: "winter",
          title: "冬",
          images: []
        }
      ],
      allHeritageImages: []
    };
  },
  created() {
    this.fetchHeritageImages();
  },
  head() {
    return {
      title: "Heritage Trees",
      meta: [
        { hid: "og:title", property: "og:title", content: "Heritage Trees" },
        {
          hid: "og:description",
          property: "og:description",
          content: "日本各地の歴史的・文化的に価値のある樹木をイラストで紹介"
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
    async fetchHeritageImages() {
      try {
        // Heritage Treesタグを持つ画像を検索
        const response = await axios.get(
          `https://togotv-api.dbcls.jp/api/search?target=pictures&other_tags=Heritage Trees&rows=1000`
        );

        this.allHeritageImages = response.data.data || [];

        // カテゴリーごとに画像を分類
        this.categorizeImages();
      } catch (error) {
        console.error("Heritage Treesの画像取得に失敗しました:", error);
      }
    },
    categorizeImages() {
      if (this.allHeritageImages.length === 0) return;

      // 新着画像: 最新の10件
      const sortedByDate = [...this.allHeritageImages].sort((a, b) => {
        const dateA = new Date(a.uploadDate || a.date || 0);
        const dateB = new Date(b.uploadDate || b.date || 0);
        return dateB - dateA;
      });
      this.categories[0].images = sortedByDate.slice(0, 10);

      // 春の画像: タグやキーワードに「春」「Spring」を含むもの
      this.categories[1].images = this.allHeritageImages.filter(image => {
        const tags = (image.other_tags || []).join(" ");
        const keywords = (image.keywords || []).join(" ");
        const searchText = `${tags} ${keywords}`.toLowerCase();
        return searchText.includes("春") || searchText.includes("spring");
      });

      // 夏の画像: タグやキーワードに「夏」「Summer」を含むもの
      this.categories[2].images = this.allHeritageImages.filter(image => {
        const tags = (image.other_tags || []).join(" ");
        const keywords = (image.keywords || []).join(" ");
        const searchText = `${tags} ${keywords}`.toLowerCase();
        return searchText.includes("夏") || searchText.includes("summer");
      });

      // 秋の画像: タグやキーワードに「秋」「Autumn」「Fall」を含むもの
      this.categories[3].images = this.allHeritageImages.filter(image => {
        const tags = (image.other_tags || []).join(" ");
        const keywords = (image.keywords || []).join(" ");
        const searchText = `${tags} ${keywords}`.toLowerCase();
        return searchText.includes("秋") || searchText.includes("autumn") || searchText.includes("fall");
      });

      // 冬の画像: タグやキーワードに「冬」「Winter」を含むもの
      this.categories[4].images = this.allHeritageImages.filter(image => {
        const tags = (image.other_tags || []).join(" ");
        const keywords = (image.keywords || []).join(" ");
        const searchText = `${tags} ${keywords}`.toLowerCase();
        return searchText.includes("冬") || searchText.includes("winter");
      });
    },
    handleNavigation(event, path) {
      event.preventDefault();
      this.$router.push(this.localePath(path));
    }
  }
});
</script>

<style lang="sass" scoped>
.heritage_trees_wrapper
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
          &.heritage_link
            margin-top: 20px
            font-weight: 600
  > .image_section
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
              @include icon('img')
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
        > .horizontal_scroll_wrapper
          width: 100%
          position: relative
          overflow: hidden
          > .image_scroll_container
            width: 100%
            overflow-x: auto
            scrollbar-width: none
            &::-webkit-scrollbar
              display: none
            > .image_list
              display: flex
              padding: 0 $VIEW_PADDING
              > .image_item
                flex-shrink: 0
                width: 200px
                margin-right: 20px
                position: relative
                &:last-child
                  margin-right: 0
                > a
                  display: block
                  > img
                    width: 100%
                    height: 150px
                    object-fit: contain
                    transition: .3s
                    &:hover
                      cursor: pointer
                      transform: translate(-5px, -2px)
                      filter: drop-shadow(10px 5px 0px rgba(253, 211, 101, .8))
                > .image_description
                  display: none
                  pointer-events: none
                  text-align: center
                  position: absolute
                  z-index: $LAYER_4
                  background-color: $MAIN_COLOR
                  border-radius: 9px
                  bottom: -40px
                  left: 50%
                  transform: translateX(-50%)
                  color: #fff
                  box-shadow: 0 3px 20px rgba(0, 0, 0, 0.4)
                  padding: 2px 11px
                  box-sizing: border-box
                  min-width: 140px
                  max-width: 200px
                  &:before
                    content: ""
                    position: absolute
                    top: -18px
                    left: 50%
                    transform: translateX(-50%)
                    border: 10px solid transparent
                    border-bottom: 10px solid $MAIN_COLOR
                  > p
                    font-size: 14px
                    margin: 5px 0
                  &.en
                    max-width: 300px
                &:hover
                  > .image_description
                    display: block
        > .no_images
          padding-left: $VIEW_PADDING
          color: #999
          font-size: 14px

@media screen and (max-width: 896px)
  .heritage_trees_wrapper
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
    > .image_section
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
          > .horizontal_scroll_wrapper
            > .image_scroll_container
              > .image_list
                padding: 0 $VIEW_PADDING_SP
                > .image_item
                  width: 150px
                  > a
                    > img
                      height: 120px
                      &:hover
                        transform: none
                        filter: none
                  &:hover
                    > .image_description
                      display: none
          > .no_images
            padding-left: $VIEW_PADDING_SP
</style>
