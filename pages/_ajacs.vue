<template>
  <div class="ajacs_wrapper">
    <AsideParts />
    <div class="ajacs_section">
      <div class="ajacs_section_header">
        <h2 class="page_title tsukushi bold">{{ ajacs_data.name }}</h2>
      </div>
      <div class="ajacs_content">
        <h3 class="tsukushi bold calender">{{ $t('lecture') }}</h3>
        <a :href="ajacs_data.event_url" target="_blank">{{ ajacs_data.AJACS_jp }}</a>
        <h3 class="tsukushi bold lecture">{{ $t('lecturer') }}</h3>
        <p>{{ ajacs_data.author }}</p>
        <h3 class="tsukushi bold pin">{{ $t('venue') }}</h3>
        <p>{{ ajacs_data.venue }}</p>
        <h3 class="tsukushi bold tag">{{ $t('tags') }}</h3>
        <ul class="tags_wrapper">
          <li v-for="(tag, index) in ajacs_data.keywords" :key="index">
            <nuxt-link :to="localePath(`/ajacs_text.html?keywords=${tag}&page=1`)">{{ tag }}</nuxt-link>
          </li>
        </ul>
        <h3 class="tsukushi bold doi">DOI</h3>
        <a :href="ajacs_data.id">{{ ajacs_data.id }}</a>
        <h3 class="tsukushi bold download">{{ $t('ajacs_text') }}</h3>
        <a :href="ajacs_data.contentUrl" target="_blank">{{ ajacs_data.contentUrl }}</a>
        <h3 class="tsukushi bold pdf">{{ $t('ajacs_pdf') }}<span>（{{ $t('you_can_download_data_by_clicking_download_button') }}）</span></h3>
        <a v-if="ajacs_data && ajacs_data.github_PDF && ajacs_data.github_PDF.indexOf('pdf') !== -1" :href="ajacs_data.github_PDF" target="_blank">{{ ajacs_data.github_PDF }}</a>
        <p v-else>{{ $t('no_result') }}</p>
        <h3 class="tsukushi bold circlevideo">{{ $t('ajacs_video') }}</h3>
        <a :href="`${process !== undefined && process.client ? location.origin : ''}/${ajacs_data.embedUrl2 ? ajacs_data.embedUrl2.split('/').pop() : ''}`">{{ ajacs_data.name }}</a>
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
  async asyncData ({ params, error, payload }) {
    if (payload) {
      return { ajacs_data: payload }
    } else {
      let id = params.ajacs
      id = `${id.slice(0,5)}.${id.slice(5)}`
      id = `${id.slice(0,10)}.${id.slice(10)}`

      let data = await axios.get(`https://togotv-api.dbcls.jp/api/search?target=ajacs-training&id=https://doi.org/10.7875/${id}`)
      return {
        ajacs_data: data.data.data[0]
      }
    }
  },
  data () {
    return {
      ajacs_data: {},
    }
  },
  head() {
    return {
      title: this.ajacs_data.name,
      script: [{
        type: 'application/ld+json',
        innerHTML: JSON.stringify(this.jsonld, null, 2)
      }],
      meta: [
        { hid: 'og:title', property: 'og:title', content: this.ajacs_data.name},
        { hid: 'og:description', property: 'og:description', content: this.ajacs_data.description },
        { hid: 'og:url', property: 'og:url', content: process.client ? location.href : '' }
      ]
    }
  },
  computed: {
    jsonld() {
      return  {
        "@context": "http://schema.org",
        "@type": "Dataset",
        "name": this.ajacs_data.name,
        "description": this.ajacs_data.description,
        "url": process.client ? location.href : '',
        "identifier": this.ajacs_data.id,
        "keywords": this.ajacs_data.keywords,
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
            "name": this.ajacs_data.author
          }
        ]
      };
    }
  },
  components: {
    AsideParts
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
    width: calc(100% - 264px)
    > .ajacs_section_header
      display: flex
      justify-content: space-between
      > .page_title
        @include page_title('file')
        white-space: break-spaces
        &:before
          margin-right: 6px
    > .ajacs_content
      > h3
        font-size: 18px
        display: flex
        align-items: center
        margin: 30px 0 6px 0px
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
        &.doi
          &::before
            @include icon('doi')
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

@media screen and (max-width: 896px)
  .ajacs_wrapper
    padding: 0 $VIEW_PADDING_SP
    flex-direction: column-reverse
    > .ajacs_section
      width: 100%
      > .ajacs_content
        > a, p
          word-break: break-all
</style>
