<template>
  <div class="faq_wrapper">
    <h2 class="page_title tsukushi bold">よくある質問</h2>
    <ul class="faq_list">
      <li class="faq" v-for="(faq, index) in faq_list" :key="index">
        <h3 class="question tsukushi bold"><span>{{ faq.question }}</span></h3>
        <p class="answer"><span v-html="convertLinksToHTML(faq.answer)"></span></p>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import faq_json from '~/static/json/FAQ.json'

export default Vue.extend({
  head() {
    return {
      title: 'FAQ'
    }
  },
  data () {
    return {
      faq_list: faq_json.faq_list
    }
  },
  methods: {
    convertLinksToHTML(text: string) {
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
        content: ''
        width: 100%
        height: 1px
        background-image: linear-gradient(to right, $MAIN_COLOR, $MAIN_COLOR 3px, transparent 3px, transparent 7px)
        background-size: 7px 1px
        background-repeat: repeat-x
        position: absolute
        left: 0
        bottom: 0
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
</style>
