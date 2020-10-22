<template>
  <div class="faq_wrapper">
    <h2 class="page_title tsukushi bold">{{ $t('faq') }}</h2>
    <ul class="faq_list">
      <li class="faq" v-for="faq in $i18n.locale === 'ja' ? faq_list : faq_list_en" :id="faq.id" :key="faq.id">
        <h3 class="question tsukushi bold"><span>{{ faq.question }}</span></h3>
        <p class="answer"><span v-html="convertLinksToHTML(faq.answer)"></span></p>
      </li>
    </ul>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from "axios"

export default Vue.extend({
  head() {
    return {
      title: 'FAQ',
      meta: [
        { hid: 'og:title', property: 'og:title', content: 'FAQ' },
        { hid: 'og:url', property: 'og:url', content: location.href },
        { hid: 'og:image', property: 'og:image', content: 'https://raw.githubusercontent.com/dbcls/togotv/master/assets/img/icon/icon_question.svg'},
      ]
    }
  },
  data () {
    return {
      faq_list: [],
      faq_list_en: []
    }
  },
  mounted() {
    this.fetchFAQ()
  },
  methods: {
    fetchFAQ() {
      axios.get(`${location.origin}${this.$router.history.base}/json/FAQ.json`).then(data => {
        this.faq_list = data.data.faq_list
      }).then(() => {
        let hash = this.$route.hash
        if (hash) {
          let offset = document.getElementById(hash.slice(1)).offsetTop
          window.scrollTo({
              top: offset - 100,
              behavior: "smooth"
          });
        }
      })

      axios.get(`${location.origin}${this.$router.history.base}/json/FAQ_en.json`).then(data => {
        this.faq_list_en = data.data.faq_list
      }).then(() => {
        let hash = this.$route.hash
        if (hash) {
          let offset = document.getElementById(hash.slice(1)).offsetTop
          window.scrollTo({
              top: offset - 100,
              behavior: "smooth"
          });
        }
      })
    },
    convertLinksToHTML(text) {
      const convertedHTML = text.replace(/\[([^\[]+)\]\((((https?|ftp)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)))\)/g, '<a href="$2" target="_blank">$1</a>')
      return convertedHTML
    }
  }
})
</script>

<style lang="sass" scoped>
.faq_wrapper
  padding: 0 $VIEW_PADDING
  > .page_title
    @include page_title('question')
    margin-bottom: 5px
  > .faq_list
    > .faq
      position: relative
      padding: 13px  13px 19px
      &::after
        @include dot_border_bottom
      > .question,
      > .answer
        margin: 0
        display: flex
        align-items: flex-start
        justify-content: flex-start
        > span
          padding-top: 20px
        &:before
          width: 46px
          min-width: 46px
          height: 46px
          margin-right: 11px
      > h3.question
        > span
          font-size: 22px
          padding-top: 12px
        &:before
          @include icon('question')
      > .answer
        &:before
          @include icon('answer')
        > span
          font-size: 16px
          line-height: 24px
          padding-top: 8px

@media screen and (max-width: 896px)
  .faq_wrapper
    padding: 0 $VIEW_PADDING_SP
    > .faq_list
      > .faq
        padding: 13px  0px 19px
        > h3.question
          > span
            font-size: 20px
        > .answer
          > span
            font-size: 14px
            line-height: 24px
</style>
