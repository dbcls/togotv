<template>
  <div class="picture_wrapper">
    <div class="pic_section">
      <div class="img_wrapper">
        <img :src="`https://dbarchive.biosciencedbc.jp/data/togo-pic/image/${picture.png}`" :alt="picture.name">
      </div>
      <div class="pic_detail">
        <p v-if="$i18n.locale === 'ja'" class="name tsukushi bold">{{ picture.name }}</p>
        <p :class="['name_en', 'mont', $i18n.locale === 'en' ? 'name' : '']">{{ picture.name_en }}</p>
        <p class="author mont" v-html="`Designed by&nbsp;${picture.author}`"></p>
        <a :href="`http://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=${picture.tax_id}`" target="_blank" class="taxonomy mont">{{ `Taxonomy ID: ${picture.tax_id}` }}</a>
        <a :href="`https://commons.wikimedia.org/wiki/File:${picture.svg}`" target="_blank" class="wiki mont">Wikimedia Commons</a>
        <div class="download_btns">
          <a @click="setDonwnloadLink(picture)" v-if="picture.png !== undefined && picture.png !== '-'" class="mont bold" download>png</a>
          <a @click="setDonwnloadLink(picture)" v-if="picture.svg !== undefined && picture.svg !== '-'" class="mont bold" download>svg</a>
          <a @click="setDonwnloadLink(picture)" v-if="picture.ai !== undefined && picture.ai !== '-'" class="mont bold" download>AI <span class="mont">(Adobe Illustrator)</span></a>
          <a @click="setDonwnloadLink(picture)" v-if="picture.obj_mtl_zip !== undefined && picture.obj_mtl_zip !== '-'" class="mont bold" download>obj_mtl_zip</a>
          <a @click="setDonwnloadLink(picture)" v-if="picture.apng !== undefined && picture.apng !== '-'" class="mont bold" download>apng</a>
          <a @click="setDonwnloadLink(picture)" v-if="picture.rotation !== undefined && picture.rotation !== '-'" class="mont bold" download>rotation</a>
        </div>
      </div>
    </div>
    <div class="related_images_wrapper">
      <p class="related_title tsukushi bold">{{ $t('related_pictures') }}</p>
      <ul class="related_images">
        <li v-for="data in tag_data" :key="data.TogoTV_Image_ID">
          <nuxt-link :to="localePath({name: 'picture', params: {picture: data.id.split('/').pop()}})">
            <img :src="`https://dbarchive.biosciencedbc.jp/data/togo-pic/image/${data.png}`" :alt="data.name">
          </nuxt-link>
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
  async asyncData ( { params, error, payload } ) {
    console.log(payload)
    if(payload) return { picture: payload }
    let data = await axios.get(`https://togotv-api.dbcls.jp/api/search?target=pictures&id=${params.picture}`)
    let tag_data = await axios.get(`https://togotv-api.dbcls.jp/api/search?target=pictures&other_tags=${data.data.data[0].other_tag1}`)
    return {
      picture: data.data.data[0],
      tag_data: tag_data.data.data
    }
  },
  head() {
    return {
      title: this.picture.name,
      script: [{
        type: 'application/ld+json',
        innerHTML: JSON.stringify(this.jsonld, null, 2)
      }],
      meta: [
        { hid: 'og:title', property: 'og:title', content: this.picture.name},
        { hid: 'og:url', property: 'og:url', content: location.href },
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
        "url": location.href,
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
    }
  },
  components: {
    DownloadModal
  },
  data () {
    return {
      is_modal_on: false,
      selected_pic: {}
    }
  },
  methods: {
    setDonwnloadLink(pic) {
      this.selected_pic = pic;
      this.is_modal_on = true;
    }
  }
})
</script>

<style lang="sass">
.picture_wrapper
  // min-width: 1130px
  padding: 106px 0
  > .pic_section
    width: 100%
    display: flex
    > .img_wrapper
      width: 70%
      height: 310px
      background-color: #EDFCFC
      display: flex
      align-items: center
      justify-content: center
      > img
        min-width: 490px
        max-width: 650px
        width: 60%
        max-height: 530px
        object-fit: contain
    > .pic_detail
      width: 30%
      min-width: 380px
      padding: 39px 0 0 30px
      box-sizing: border-box
      height: 310px
      color: #fff
      background-color: $MAIN_COLOR
      position: relative
      &:before
        content: ""
        position: absolute
        top: 0
        left: -100px
        border-left: 50px solid transparent
        border-top: 155px solid transparent
        border-right: 50px solid $MAIN_COLOR
        border-bottom: 155px solid $MAIN_COLOR
      > p
        margin: 0
      > p.name_en
        font-size: 18px
        margin-top: 1px
      > p.name
        font-size: 30px
      > p.author
        margin: 26px 0 7px
        font-size: 12px
        display: flex
        align-items: center
        &:before
          width: 18px
          height: 18px
          margin-right: 3px
          @include icon('brush')
        > a
          color: #fff
      > a.taxonomy,
      > a.wiki
        color: #fff
        font-size: 12px
        display: block
        line-height: 26px
        display: flex
        align-items: center
        &:before
          width: 18px
          height: 18px
          margin-right: 3px
          @include icon('externallink')
      > div.download_btns
        margin-top: 15px
        margin-left: -3px
        > a
          @include download_btn
          margin-left: 5px
          line-height: 38px
          &:first-of-type
            margin-left: 0
  > .related_images_wrapper
    padding: 0 $VIEW_PADDING
    margin-top: 102px
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
        > a
          display: inline-block
          margin-right: 20px
          margin-bottom: 20px
          > img
            width: 146px
            height: 146px
            object-fit: contain
            &:hover
              cursor: pointer
  > .modal_back
    @include modal_back

@media screen and (max-width: 896px)
  .picture_wrapper
    padding: 0
    > .related_images_wrapper
      padding: 0 $VIEW_PADDING_SP
    > .pic_section
      flex-direction: column
      > .img_wrapper
        width: 100%
        height: auto
        background: none
        padding: 40px 0px
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
        &:before
          display: none
        > a.taxonomy,
        > a.wiki
          color: $BLACK
        > div.download_btns
          > a
            color: $MAIN_COLOR
            border: 1px solid $MAIN_COLOR
</style>
