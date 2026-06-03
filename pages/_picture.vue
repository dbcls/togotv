<template>
  <div class="picture_wrapper">
    <div v-if="hasSearchState" class="back_to_search_wrapper">
      <button @click="backToSearchResults" class="back_to_search_btn tsukushi">
        ← {{ $t('back_to_search_results') }}
      </button>
    </div>
    <div class="pic_section">
      <div class="img_wrapper">
        <div v-if="picture.detail_image1 && picture.detail_image1 !== '-'" class="image_toggle_btns">
          <button
            :class="['toggle_btn', 'tsukushi', { active: currentImageType === 'main' }]"
            @click="currentImageType = 'main'"
          >
            画像のみ
          </button>
          <button
            :class="['toggle_btn', 'tsukushi', { active: currentImageType === 'detail' }]"
            @click="currentImageType = 'detail'"
          >
            説明付き
          </button>
        </div>
        <img :src="currentImageUrl" :alt="picture.name">
      </div>
      <div class="pic_detail" :style="{ backgroundColor: seasonColor }">
        <div class="triangle_decoration" :style="{ backgroundColor: seasonColor }"></div>
        <p v-if="$i18n.locale === 'ja'" class="name tsukushi bold">{{ picture.name }}</p>
        <p :class="['name_en', 'mont', $i18n.locale === 'en' ? 'name' : '']">{{ picture.name_en }}</p>
        <p :class="['scientific_name', 'mont', $i18n.locale === 'en' ? 'name' : '']">{{ picture.scientific_name }}</p>
        <p class="author mont" v-html="`Designed by&nbsp;${picture.author}`"></p>
        <p class="editor mont" v-html="`Edited by&nbsp;${picture.editor}`"></p>
        <a :href="`http://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=${picture.tax_id}`" target="_blank" class="taxonomy mont">{{ `Taxonomy ID: ${picture.tax_id}` }}</a>
        <a :href="picture.id" class="doi mont">{{picture.id}}</a>
        <a :href="`https://commons.wikimedia.org/wiki/File:${picture.svg}`" target="_blank" class="wiki mont">Wikimedia Commons</a>
        <div class="download_btns">
          <a @click="setDonwnloadLink(picture)" v-if="picture.png !== undefined && picture.png !== '-'" class="mont bold" download>png</a>
          <a @click="setDonwnloadLink(picture)" v-if="picture.svg !== undefined && picture.svg !== '-'" class="mont bold" download>svg</a>
          <a @click="setDonwnloadLink(picture)" v-if="picture.ai !== undefined && picture.ai !== '-'" class="mont bold" download>AI <span class="mont">(Adobe Illustrator)</span></a>
          <a @click="setDonwnloadLink(picture)" v-if="picture.obj_mtl_zip !== undefined && picture.obj_mtl_zip !== '-'" class="mont bold" download>obj_mtl_zip</a>
          <a @click="setDonwnloadLink(picture)" v-if="picture.apng !== undefined && picture.apng !== '-'" class="mont bold" download>apng</a>
          <a @click="setDonwnloadLink(picture)" v-if="picture.rotation !== undefined && picture.rotation !== '-'" class="mont bold" download>rotation</a>
          <a @click="setDonwnloadLink(picture)" v-if="picture.detail_image1 !== undefined && picture.detail_image1 !== '-'" class="mont bold" download>image with detail</a>
          <a @click="setDonwnloadLink(picture)" v-if="picture.monotone_png !== undefined && picture.monotone_png !== '-'" class="mont bold" download>monotone png</a>
          <a @click="setDonwnloadLink(picture)" v-if="picture.monotone_svg !== undefined && picture.monotone_svg !== '-'" class="mont bold" download>monotone svg</a>
        </div>
        <p v-if="picture.Description_small" class="description mont">{{ picture.Description_small }}</p>
      </div>
    </div>
    <div v-if="picture.Description_large" class="description_large_wrapper">
      <div class="description_large_content" v-html="picture.Description_large"></div>
    </div>
    <div :class="['related_images_wrapper', { is_heritage: isHeritageTrees || isFromHT }]">
      <p class="related_title tsukushi bold">{{ relatedSectionTitle }}</p>
      <ul class="related_images">
        <li v-for="data in tag_data" :key="data.TogoTV_Image_ID">
          <div class="related_img_wrap">
            <nuxt-link :to="localePath(`/${data.id.split('/').pop()}.html`)">
              <img :src="`https://dbarchive.biosciencedbc.jp/data/togo-pic/image/${data.png}`" :alt="data.name">
            </nuxt-link>
            <span v-if="data._matchedTags && data._matchedTags.length" class="related_tag">
              {{ data._matchedTags.join('・') }}
            </span>
          </div>
        </li>
      </ul>
    </div>
    <DownloadModal
      v-if="is_modal_on"
      :props="{selected_pic: selected_pic, is_single_download: true}"
      @closeModal="is_modal_on = false"
    />
    <div v-if="is_modal_on" @click="is_modal_on = false" class="modal_back"></div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import DownloadModal from "~/components/DownloadModal.vue";

export default Vue.extend({
  key: route => route.fullPath,
  async asyncData ({ params, error, payload }) {
    if (payload) {
      return { picture: payload }
    } else {
      let data = await axios.get(`https://togotv-api.dbcls.jp/api/search?target=pictures&id=${params.picture}`)
      return {
        picture: data.data.data[0]
      }
    }
  },
  created() {
    this.fetchRelatedPics()
  },
  head() {
    return {
      title: this.$i18n && this.$i18n.locale === 'ja' ? this.picture.name : this.picture.name_en,
      script: [{
        type: 'application/ld+json',
        innerHTML: JSON.stringify(this.jsonld, null, 2)
      }],
      meta: [
        { hid: 'og:title', property: 'og:title', content: this.picture.name},
        { hid: 'og:url', property: 'og:url', content: process.client ? location.href : '' },
        { hid: 'og:image', property: 'og:image', content: `https://dbarchive.biosciencedbc.jp/data/togo-pic/image/${this.picture.png}` },
      ]
    }
  },
  computed: {
    jsonld() {
      return  {
        "@context": "http://schema.org",
        "@type": "Dataset",
        "name": this.picture.name,
        "description": `${this.picture.name} ${this.picture.name_en} ${this.picture.other_tags}`,
        "url": process.client ? location.href : '',
        "identifier": this.picture.id,
        "keywords": this.picture.other_tags,
        "license": "https://creativecommons.org/licenses/by/4.0/",
        "creator":[
          {
            "@type":"Organization",
            "url": "http://dbcls.rois.ac.jp/",
            "name":"Database Center for Life Science",
            "contactPoint":{
                "@type":"ContactPoint",
                "contactType": "customer service",
                "telephone":"81-4-7135-5508"
            }
          },
          {
            "@type": "Person",
            "name": this.picture.author_str
          }
        ]
      };
    },
    hasSearchState() {
      return this.$route.query.from_search === 'true';
    },
    isFromHT() {
      return this.$route.query.from_ht === 'true';
    },
    isHeritageTrees() {
      const tags = (this.picture.other_tags_comma || '').split(',').map(t => t.trim());
      return tags.includes('KBG') || tags.some(t => t.includes('Heritage'));
    },
    relatedSectionTitle() {
      return (this.isHeritageTrees || this.isFromHT) ? '四季のイラスト' : this.$t('related_pictures');
    },
    heritageTreeSeason() {
      // Heritage Treesの画像かどうかを判定し、季節を返す
      const getSearchText = () => {
        const tags = Array.isArray(this.picture.other_tags)
          ? this.picture.other_tags.join(" ")
          : (this.picture.other_tags || "");
        const tagsComma = this.picture.other_tags_comma || "";
        const keywords = Array.isArray(this.picture.keywords)
          ? this.picture.keywords.join(" ")
          : (this.picture.keywords || "");
        return `${tags} ${tagsComma} ${keywords} ${this.picture.name || ""} ${this.picture.name_en || ""}`.toLowerCase();
      };

      const searchText = getSearchText();

      // 季節判定
      if (searchText.includes("春") || searchText.includes("spring")) {
        return "spring";
      } else if (searchText.includes("夏") || searchText.includes("summer")) {
        return "summer";
      } else if (searchText.includes("秋") || searchText.includes("autumn") || searchText.includes("fall")) {
        return "autumn";
      } else if (searchText.includes("冬") || searchText.includes("winter")) {
        return "winter";
      }

      return null; // Heritage Treesではない、または季節が不明
    },
    seasonColor() {
      // 季節に応じた背景色を返す
      const colors = {
        spring: "#FFB7C5",  // 春：ピンク
        summer: "#90EE90",  // 夏：緑
        autumn: "#FFD700",  // 秋：金
        winter: "#B0E0E6"   // 冬：水色
      };
      return colors[this.heritageTreeSeason] || "#009999"; // デフォルトは元の色
    },
    currentImageUrl() {
      // 現在表示する画像のURLを返す
      const baseUrl = 'https://dbarchive.biosciencedbc.jp/data/togo-pic/image/';
      if (this.currentImageType === 'detail' && this.picture.detail_image1 && this.picture.detail_image1 !== '-') {
        return `${baseUrl}${this.picture.detail_image1}`;
      }
      return `${baseUrl}${this.picture.png}`;
    }
  },
  components: {
    DownloadModal
  },
  data () {
    return {
      is_modal_on: false,
      selected_pic: {},
      picture: {},
      tag_data: [],
      currentImageType: 'main'
    }
  },
  methods: {
    setDonwnloadLink(pic) {
      this.selected_pic = pic;
      this.is_modal_on = true;
    },
    async fetchRelatedPics() {
      const tagsComma = this.picture.other_tags_comma || '';
      const tags = tagsComma.split(',').map(t => t.trim()).filter(Boolean);

      // ── Heritage Tree画像の場合 ──────────────────────────
      if (this.isHeritageTrees) {
        const SEASON_TAGS = ['春', '夏', '秋', '冬', 'Spring', 'Summer', 'Autumn', 'Fall', 'Winter'];
        const seasonTag = tags.find(t => SEASON_TAGS.includes(t));
        try {
          const res = await axios.get('https://togotv-api.dbcls.jp/api/bool_search', {
            params: { target: 'pictures', other_tags: 'KBG', rows: 1000 }
          });
          const all = res.data.data || [];
          this.tag_data = all
            .filter(img => img.id !== this.picture.id)
            .filter(img => {
              if (!seasonTag) return true;
              return (img.other_tags_comma || '').split(',').map(t => t.trim()).includes(seasonTag);
            })
            .map(img => ({ ...img, _matchedTags: seasonTag ? [seasonTag] : ['KBG'] }));
        } catch (e) {
          console.error('HT related fetch error:', e);
        }
        return;
      }

      // ── 通常イラストの場合: bool_searchで各タグ検索 ──────
      if (!tags.length) return;
      const results = await Promise.all(
        tags.slice(0, 6).map(tag =>
          axios.get('https://togotv-api.dbcls.jp/api/bool_search', {
            params: { target: 'pictures', other_tags: tag, rows: 100 }
          })
          .then(res => ({ tag, data: res.data.data || [] }))
          .catch(() => ({ tag, data: [] }))
        )
      );

      const imageMap = {};
      results.forEach(({ tag, data }) => {
        data.forEach(img => {
          if (img.id === this.picture.id) return;
          if (!imageMap[img.id]) imageMap[img.id] = { img, matchedTags: [] };
          imageMap[img.id].matchedTags.push(tag);
        });
      });

      this.tag_data = Object.values(imageMap)
        .sort((a, b) => b.matchedTags.length - a.matchedTags.length)
        .slice(0, 30)
        .map(({ img, matchedTags }) => ({ ...img, _matchedTags: matchedTags }));
    },
    backToSearchResults() {
      // クエリパラメータから検索状態を取得
      const query = Object.assign({}, this.$route.query);

      // from_searchフラグを削除（picsページでは不要）
      delete query.from_search;

      // picsページに戻る
      this.$router.push({
        path: this.localePath('/pics'),
        query: query
      });
    }
  }
})
</script>

<style lang="sass">
.picture_wrapper
  padding: 60px 0
  > .back_to_search_wrapper
    margin-bottom: 20px
    padding: 0 $VIEW_PADDING
    > .back_to_search_btn
      background-color: $MAIN_COLOR
      color: #fff
      border: none
      padding: 10px 20px
      font-size: 14px
      border-radius: 4px
      cursor: pointer
      transition: .3s
      &:hover
        background-color: darken($MAIN_COLOR, 10%)
      &:focus
        outline: none
  > .pic_section
    width: 100%
    display: flex
    align-items: stretch   // 両カラムを同じ高さに揃える
    > .img_wrapper
      width: 70%
      min-height: 400px
      background-color: #EDFCFC
      display: flex
      flex-direction: column
      align-items: center
      justify-content: center
      padding: 40px 20px
      box-sizing: border-box
      position: relative
      > .image_toggle_btns
        position: absolute
        top: 20px
        right: 20px
        display: flex
        gap: 10px
        z-index: 10
        > .toggle_btn
          padding: 8px 16px
          background-color: rgba(255, 255, 255, 0.9)
          border: 2px solid $MAIN_COLOR
          color: $MAIN_COLOR
          font-size: 14px
          font-weight: bold
          border-radius: 6px
          cursor: pointer
          transition: all 0.3s ease
          &:hover
            background-color: $MAIN_COLOR
            color: #fff
          &.active
            background-color: $MAIN_COLOR
            color: #fff
      > img
        max-width: 500px   // 1辺最大500px
        max-height: 500px
        width: 100%
        object-fit: contain
    > .pic_detail
      width: 30%
      min-width: 300px
      padding: 39px 0 0 30px
      box-sizing: border-box
      min-height: 400px
      color: #1a4a2e
      background-color: $MAIN_COLOR
      position: relative
      > .triangle_decoration
        position: absolute
        top: 0
        bottom: 0          // 高さに追従して伸びる
        left: -100px
        width: 100px
        clip-path: polygon(100% 0, 100% 100%, 0 50%)
        background-color: $MAIN_COLOR  // :styleで上書き
      > p
        margin: 0
        &.scientific_name
          margin-top: 2px
      > p.name_en
        font-size: 18px
        margin-top: 1px
      > p.name
        font-size: 30px
      > p.author,
      > p.editor,
      > a.taxonomy,
      > a.wiki,
      > a.doi
        color: #1a4a2e
        font-size: 12px
        line-height: 26px
        display: flex
        align-items: center
        &:before
          width: 22px
          height: 22px
          margin-right: 3px
          @include icon('externallink')
      > p.author
        &:before
          width: 18px
          height: 18px
          margin-right: 3px
          @include icon('brush')
        > a
          color: #1a4a2e
      > p.editor
        &:before
          @include icon('editor')
        > a
          color: #1a4a2e
      > a.doi
        &:before
          @include icon('doi')
      > div.download_btns
        margin-top: 15px
        margin-left: -3px
        > a
          @include download_btn
          margin-left: 5px
          line-height: 38px
          color: #1a4a2e
          border-color: #1a4a2e
          &:first-of-type
            margin-left: 0
      > p.description
        margin-top: 20px
        font-size: 16px
        line-height: 1.6
        padding-right: 10px
        max-height: 160px
        overflow-y: auto
  > .description_large_wrapper
    padding: 0 $VIEW_PADDING
    margin-top: 50px
    > .description_large_content
      font-size: 16.4px
      line-height: 1.8
      color: $BLACK
      max-width: 900px
      margin: 0 auto
      // Description_large 内のHTML要素スタイル
      img
        display: block        // 必ずブロック表示（テキストが下に来る）
        max-width: 100%
        height: auto
        margin: 1.5em auto    // 上下にスペース、中央寄せ
        clear: both
      p
        margin: 0 0 1em
      h2
        font-size: 1.5em
        font-weight: bold
        margin: 1.8em 0 0.6em
        padding-bottom: 0.3em
        border-bottom: 2px solid $MAIN_COLOR
      h3
        font-size: 1.2em
        font-weight: bold
        margin: 1.5em 0 0.5em
      h4
        font-size: 1.05em
        font-weight: bold
        margin: 1.2em 0 0.4em
      ul, ol
        margin: 0 0 1em 1.5em
        > li
          margin-bottom: 0.3em
      a
        color: $MAIN_COLOR
        text-decoration: underline
        &:hover
          text-decoration: none
      strong, b
        font-weight: bold
      em, i
        font-style: italic
      blockquote
        border-left: 4px solid $MAIN_COLOR
        margin: 1em 0
        padding: 0.5em 1em
        color: #555
        background: #f9f9f9
  > .related_images_wrapper
    padding: 0 $VIEW_PADDING
    margin-top: 60px
    > .related_title
      font-size: 18px
      display: flex
      align-items: center
      &:before
        width: 25px
        height: 25px
        @include icon('img')
    > .related_images
      display: flex
      flex-wrap: wrap
      > li
        > .related_img_wrap
          position: relative
          display: inline-block
          width: 146px
          height: 146px
          margin-right: 20px
          margin-bottom: 20px
          > a
            display: block
            width: 100%
            height: 100%
            > img
              width: 100%
              height: 100%
              object-fit: contain
              &:hover
                cursor: pointer
          > .related_tag
            position: absolute
            top: 6px
            left: 6px
            background: rgba(0, 0, 0, 0.45)
            color: #fff
            font-size: 11px
            font-weight: 600
            border-radius: 12px
            padding: 3px 9px
            line-height: 1.4
            pointer-events: none
            white-space: nowrap
            letter-spacing: 0.3px
    &.is_heritage
      > .related_images > li > .related_img_wrap
        width: 220px
        height: 220px
  > .modal_back
    @include modal_back

@media screen and (max-width: 896px)
  .picture_wrapper
    padding: 0
    > .description_large_wrapper
      padding: 0 $VIEW_PADDING_SP
      margin-top: 30px
      > .description_large_content
        font-size: 14px
        line-height: 1.7
        img
          margin: 1em auto
    > .related_images_wrapper
      padding: 0 $VIEW_PADDING_SP
    > .pic_section
      flex-direction: column
      > .img_wrapper
        width: 100%
        height: auto
        background: none
        padding: 40px 0px
        > .image_toggle_btns
          position: relative
          top: auto
          left: auto
          margin-bottom: 20px
          justify-content: center
          > .toggle_btn
            font-size: 13px
            padding: 6px 12px
        > img
          min-width: auto
          width: calc(100% - #{$VIEW_PADDING_SP} * 2)
          max-height: 360px
      > .pic_detail
        width: 100%
        padding: 30px $VIEW_PADDING_SP
        margin: 0 auto
        border-radius: 13px
        color: $BLACK
        background-color: transparent
        > .triangle_decoration
          display: none
        > p.author,
        > p.editor,
        > p.author a,
        > p.editor a,
        > a.taxonomy,
        > a.wiki,
        > a.doi
          color: $BLACK
        > div.download_btns
          > a
            color: $MAIN_COLOR
            border: 1px solid $MAIN_COLOR
        > p.description
          color: $BLACK
          max-height: none
</style>
