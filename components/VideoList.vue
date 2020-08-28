<template>
  <div class="video_list_wrapper">
    <ul>
      <li v-for="video in video_info_array" :key="video.embedUrl">
        <img :src="video.thumbnailUrl" :alt="video.name">
        <nuxt-link :to="{name: 'video', params: {video: video.uploadDate.replace(/-/g, '')}}" class="title tsukushi bold">{{ video.name }}</nuxt-link>
        <p class="description" v-html="video.description"></p>
        <ul>
          <li v-for="(tag, index) in video.keywords" :key="index">
            <nuxt-link :to="{name: 'tag', query: {name: tag}}">{{ tag }}</nuxt-link>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'


export default Vue.extend({
  props: {
    video_info_array: {
      required: true
    }
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
      > p.description
        font-size: 14px
        margin-top: 6px
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
      > img
        width: 176px
        margin-left: 12px
        float: right
        border-radius: 4px
</style>
