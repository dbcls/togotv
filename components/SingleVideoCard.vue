<template>
  <div class="single_video_wrapper">
    <nuxt-link
      class="thumbnail_wrapper"
      :to="
        props.uploadDate
          ? localePath(`/${props.uploadDate.replace(/-/g, '')}.html`)
          : ''
      "
    >
      <Thumbnail
        :props="{
          size: props.size,
          thumbnail: props.thumbnail,
          title: props.title,
          duration: props.duration,
          uploadDate: props.uploadDate,
          has_aside: props.has_aside,
        }"
      />
    </nuxt-link>
    <div :class="['description_wrapper', { has_aside: props.has_aside }]">
      <p :class="['description', props.size]">
        <span class="upload_date mont bold">{{ props.uploadDate }}</span
        ><span v-html="props.description"></span>
      </p>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Thumbnail from "~/components/Thumbnail.vue";

export default Vue.extend({
  props: {
    props: {
      required: true,
    },
  },
  components: {
    Thumbnail,
  },
});
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
        white-space: nowrap
        &:before
          width: 18px
          height: 16px
          margin-bottom: -3px
          margin-right: 2px
          @include icon('calender')
@media screen and (min-width: 1800px)
  .single_video_wrapper
    > .description_wrapper
      width: calc((100vw - #{$VIEW_PADDING} * 2 - 50px) / 6)
      &.has_aside
        width: calc((100vw - #{$VIEW_PADDING} * 2 - 320px) / 5)
@media screen and (min-width: 1500px) and (max-width: 1800px)
  .single_video_wrapper
    > .description_wrapper
      width: calc((100vw - #{$VIEW_PADDING} * 2 - 40px) / 5)
      &.has_aside
        width: calc((100vw - #{$VIEW_PADDING} * 2 - 310px) / 4)
@media screen and (min-width: 1200px) and (max-width: 1500px)
  .single_video_wrapper
    > .description_wrapper
      width: calc((100vw - #{$VIEW_PADDING} * 2 - 30px) / 4)
      &.has_aside
        width: calc((100vw - #{$VIEW_PADDING} * 2 - 300px) / 3)
@media screen and (min-width: 896px) and (max-width: 1200px)
  .single_video_wrapper
    > .description_wrapper
      width: calc((100vw - #{$VIEW_PADDING} * 2 - 20px) / 3)
      &.has_aside
        width: calc((100vw - #{$VIEW_PADDING} * 2 - 290px) / 2)
@media screen and (max-width: 896px)
  .single_video_wrapper
    > .description_wrapper
      width: calc((100vw - #{$VIEW_PADDING_SP} * 2 - 10px) / 2)
      &.has_aside
        width: calc((100vw - #{$VIEW_PADDING_SP} * 2 - 10px) / 2)
</style>
