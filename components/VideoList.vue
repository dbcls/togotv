<template>
  <div class="video_list_wrapper">
    <ul>
      <li v-for="video in video_info_array" :key="video.embedUrl">
        <!-- <img :src="video.thumbnailUrl" :alt="video.name"> -->
        <div class="thumbnail_wrapper">
          <Thumbnail :props="{size: 'list', thumbnail: video.thumbnailUrl, title: video.name, duration: video.duration}" />
        </div>
        <nuxt-link :to="localePath(`/${video.uploadDate.replace(/-/g, '')}.html`)" class="title tsukushi bold">{{ video.name }}</nuxt-link>
        <span class="upload_date mont bold">{{ video.uploadDate.replace(/-/g, '.') }}</span>
        <p class="description" v-html="video.description"></p>
        <ul>
          <li v-for="(tag, index) in video.keywords" :key="index">
            <nuxt-link :to="localePath(`/tag.html?name=${tag}`)">{{ tag }}</nuxt-link>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Thumbnail from '~/components/Thumbnail.vue'

export default Vue.extend({
  props: {
    video_info_array: {
      required: true
    }
  },
  components: {
    Thumbnail
  }
})
</script>

<style lang="sass" scoped>
.video_list_wrapper
  width: 100%
  min-width: 636px
  > ul
    > li
      // display: flex
      // justify-content: space-between
      // align-items: flex-start
      margin-bottom: 30px
      clear: both
      &:last-of-type
        margin-bottom: 0
      > a.title
        font-size: 22px
        line-height: 28px
        margin: 2px 0 0
        text-decoration: none
        color: $BLACK
        &:hover
          color: $MAIN_COLOR
      > .upload_date
        font-size: 12px
        margin-top: 4px
        // letter-spacing: 0.8px
        display: flex
        align-items: center
        &:before
          width: 18px
          height: 16px
          margin-right: 2px
          margin-top: -2px
          @include icon('calender')
      > p.description
        font-size: 14px
        margin-top: 8px
        margin-bottom: 8px
        line-height: 20px
        font-weight: 500
      > ul
        display: flex
        flex-wrap: wrap
        line-height: 30px
        margin-left: -2px
        margin-top: -3px
        > li
          > a
            @include tag
            margin-right: 9px
      > .thumbnail_wrapper
        width: 176px
        margin-left: 12px
        float: right
        border-radius: 4px

@media screen and (max-width: 480px)
  .video_list_wrapper
    min-width: 100%
    > ul
      > li
        // > a.title
        // > p.description
        // > ul
        //   > li
        //     > a
        > img
          float: none
          width: 100%
          margin: 0

</style>
