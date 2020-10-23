<template>
  <div class="single_video_wrapper">
    <nuxt-link
      class="thumbnail_wrapper"
      :to="localePath({name: 'video', params: {video: `${props.uploadDate.replace(/-/g, '')}`}})">
      <Thumbnail :props="{size: props.size, thumbnail: props.thumbnail, title: props.title, duration: props.duration, uploadDate: props.uploadDate}" />
    </nuxt-link>
    <div class="description_wrapper">
      <!-- <span class="upload_date" v-html="props.uploadDate"></span> -->
      <p :class="['description', props.size]"><span class="upload_date mont bold">{{ props.uploadDate.replace(/-/g, '.') }}</span><span v-html="props.description"></span></p>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Thumbnail from '~/components/Thumbnail.vue'

export default Vue.extend({
  props: {
    props: {
      required: true
    }
  },
  components: {
    Thumbnail
  }
})
</script>

<style lang="sass" scoped>
.single_video_wrapper
  a
    text-decoration: none
    color: $BLACK
    display: block
    > .title
      font-size: 14px
      margin: 3px 0 2px
  > .description_wrapper
    overflow: hidden
    width: 247px
    height: 30px
    > .description
      font-size: 12px
      font-weight: 500
      line-height: 15px
      margin: 0
      display: -webkit-box
      -webkit-box-orient: vertical
      -webkit-line-clamp: 2
      &.small
        width: 166px
      > .upload_date
        margin-right: 5px
        &:before
          width: 18px
          height: 16px
          margin-bottom: -3px
          margin-right: 2px
          @include icon('calender')

@media screen and (max-width: 896px)
  .single_video_wrapper
    > .description_wrapper
      width: calc((100vw - #{$VIEW_PADDING_SP} * 2 - 18px) / 2)
</style>
