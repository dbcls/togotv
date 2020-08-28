<template>
  <div class="ajacs_wrapper">
    <AsideParts />
    <div class="ajacs_section">
      <div class="ajacs_section_header">
        <h2 class="page_title tsukushi bold">{{ ajacs_data.name }}</h2>
      </div>
      <div class="ajacs_content">
        <h3 class="tsukushi bold calender">講習会</h3>
        <a :href="ajacs_data.event_url" target="_blank">{{ ajacs_data.AJACS_jp }}</a>
        <h3 class="tsukushi bold lecture">講師</h3>
        <p>{{ ajacs_data.author }}</p>
        <h3 class="tsukushi bold pin">会場</h3>
        <p>{{ ajacs_data.venue }}</p>
        <h3 class="tsukushi bold tag">タグ</h3>
        <ul class="tags_wrapper">
          <li v-for="(tag, index) in ajacs_data.keywords" :key="index">
            <nuxt-link :to="{name: 'ajacs_text', query: {keywords: tag, page: 1}}">{{ tag }}</nuxt-link>
          </li>
        </ul>
        <h3 class="tsukushi bold download">講習資料</h3>
        <a :href="ajacs_data.contentUrl" target="_blank">{{ ajacs_data.contentUrl }}</a>
        <h3 class="tsukushi bold pdf">講習資料PDF<span>（リンク先のページ中央のDownloadボタンを押すとダウンロードできます。）</span></h3>
        <a :href="ajacs_data.github_PDF" target="_blank">{{ ajacs_data.github_PDF }}</a>
        <h3 class="tsukushi bold circlevideo">講習会動画</h3>
        <div class="iframe_wrapper">
          <iframe :src="`https://www.youtube.com/embed/${ajacs_data.embedUrl}`" frameborder="0" allowfullscreen=""></iframe>
        </div>
        <p class="description">{{ ajacs_data.description }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import AsideParts from '~/components/AsideParts.vue'

export default Vue.extend({
  key: route => route.fullPath,
  async asyncData ( { params, error } ) {
    let id = params.ajacs.replace('ajacs', 'ajacs.')
    id = `${id.slice(0,10)}.${id.slice(10)}`
    let data = await axios.get(`http://togotv-api.bhx.jp/api/search?target=ajacs-training&id=https://doi.org/10.7875/${id}`)
    console.log(data)
    return {
      ajacs_data: data.data.data[0],
    }
  },
  head() {
    return {
      title: this.ajacs_data.name
    }
  },
  components: {
    AsideParts
  },
  data () {
    return {
    }
  },
  methods: {
  }
})
</script>

<style lang="sass" scoped>
.ajacs_wrapper
  padding: 0 $VIEW_PADDING
  display: flex
  align-items: flex-start
  justify-content: flex-start
  > .ajacs_section
    > .ajacs_section_header
      display: flex
      justify-content: space-between
      > .page_title
        @include page_title('file')
    > .ajacs_content
      > h3
        font-size: 18px
        display: flex
        align-items: center
        margin: 30px 0 4px 0px
        flex-wrap: wrap
        &:first-of-type
          margin-top: 0
        &:before
          width: 28px
          height: 28px
        &.calender
          &::before
            @include icon('calender')
        &.lecture
          &::before
            @include icon('lecture')
        &.pin
          &::before
            @include icon('pin')
        &.tag
          &::before
            @include icon('tag')
        &.download
          &::before
            @include icon('download')
        &.pdf
          &::before
            @include icon('pdf')
        &.circlevideo
          &::before
            @include icon('circlevideo')
        > span
          font-size: 16px
          font-weight: normal
      > a, p
        font-size: 16px
        margin: 0
        &.description
          line-height: 25px
          margin-top: 10px
      > ul.tags_wrapper
        > li
          display: inline-block
          > a
            @include tag
            line-height: 26px
            margin-right: 6px
      > .iframe_wrapper
        position: relative
        padding-bottom: 56%
        > iframe
          position: absolute
          top: 0
          left: 0
          width: 100%
          height: 100%
          border-radius: 5px
</style>
