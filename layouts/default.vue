<template>
  <div>
    <Header @toggleMenu="toggleMenu" ref="header"/>
    <nuxt ref="content"/>
    <Footer />
  </div>
</template>

<script>
import Vue from 'vue'
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'

if (process.client) {
  require('~/assets/js/font.js')
}

export default Vue.extend({
  components: {
    Header,
    Footer
  },
  head() {
    // nuxt-i18n が locale に応じた <html lang> と og:locale を生成する
    // （nuxt-i18n v6 のヘルパーは $nuxtI18nSeo）
    const i18nSeo = this.$nuxtI18nSeo ? this.$nuxtI18nSeo() : {}
    // hreflang / canonical は自前で組み立てる。
    // このサイトは extendRoutes で .html エイリアスを足しているため
    // switchLocalePath() が解決できず、nuxt-i18n の生成するリンクが
    // 全ページ同じ URL になってしまう。JP と EN は /foo.html ↔ /en/foo.html で
    // 1 対 1 に対応するので、パスから直接求める。
    const BASE_URL = "https://togotv.dbcls.jp"
    const raw = (this.$route.path || "/").replace(/index\.html$/, "")
    const ja_path = raw.replace(/^\/en(\/|$)/, "/")
    const en_path = ja_path === "/" ? "/en/" : "/en" + ja_path
    const current_path = this.$i18n.locale === "en" ? en_path : ja_path
    return {
      htmlAttrs: {
        ...(i18nSeo.htmlAttrs || {}),
        prefix: "og: http://ogp.me/ns#",
      },
      link: [
        { hid: "canonical", rel: "canonical", href: BASE_URL + current_path },
        { hid: "alternate-ja", rel: "alternate", hreflang: "ja", href: BASE_URL + ja_path },
        { hid: "alternate-en", rel: "alternate", hreflang: "en", href: BASE_URL + en_path },
        { hid: "alternate-x-default", rel: "alternate", hreflang: "x-default", href: BASE_URL + ja_path },
      ],
      meta: [
        // ページ側で上書きされなければ locale 別の既定の description を入れる
        {
          hid: "description",
          name: "description",
          content: this.$t("site_description"),
        },
        ...(i18nSeo.meta || []),
      ],
      script: [
        // `hid` は一意の識別子として使用されます。 `vmid` は動作しないので使わないでください。
        {
          "type": "text/javascript",
          "src": "https://dbcls.rois.ac.jp/DBCLS-common-header-footer/v2/script/common-header-and-footer.js",
          "style": "display: block",
          "id": "common-header-and-footer__script",
          "data-header-menu-type": "deployed",
          "data-color": "mono",
          "data-width": "auto"
        }
      ]
    }
  },
  mounted() {
    if(process.client) {
      const language = (window.navigator.languages.length > 0 && window.navigator.languages[0]) ||
              window.navigator.language ||
              window.navigator.userLanguage ||
              window.navigator.browserLanguage;
      if(language === 'en-US') {
        this.$router.push(this.switchLocalePath('en'))
      }
    }
  },
  methods: {
    toggleMenu(menu_state) {
      if(menu_state) {
        document.getElementsByTagName('body')[0].style.overflow = "hidden";
      } else {
        document.getElementsByTagName('body')[0].style.overflow = "visible";
      }
    }
  }
})
</script>

<style lang="sass">
html
  font-family: "游ゴシック", "Yu Gothic", "游ゴシック体", YuGothic, sans-serif
  color: $BLACK
  box-sizing: border-box
  padding-top: 78.88px
  overflow-x: hidden

body
  overflow-x: hidden
  max-width: 100vw

ul,ol
  list-style: none
  margin: 0
  padding: 0

a
  color: $MAIN_COLOR

.tsukushi
  font-family: fot-tsukuardgothic-std, sans-serif
  font-weight: 400
  font-style: normal
  &.bold
    font-weight: 600

.mont
  font-family: montserrat, sans-serif
  font-weight: 500
  font-style: normal
  &.bold
    font-weight: 700
    letter-spacing: 1px

.bg_blue
  background-color: rgba(235, 247, 249, .67)

.scroll-horizontal
  overscroll-behavior-x: contain

.add_faq_icon
  &:after
    width: 20px
    height: 20px
    transform: translate(-5px, 4px)
    @include icon('question')
</style>
