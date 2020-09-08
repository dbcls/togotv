<template>
  <div :class="['video_list_wrapper', props.bg, props.id, btn_state.left ? '' : 'left_hide', btn_state.right ? '' : 'right_hide']">
    <ScrollBtn @toggleBtn="toggleBtn" :props="{id: `${props.id}-right`, direction: 'left'}"/>
    <ul class="video_list scroll-horizontal">
      <li class="video_list_box" v-for="video in props.playList" :key="video.id">
        <SingleVideoCard :props="{id: getVideoId(video), thumbnail: getVideoThumbnail(video), title: video.name, description: video.description, duration: video.duration, courseId: props.courseId, uploadDate: video.uploadDate !== undefined ? video.uploadDate : video.date}"/>
      </li>
    </ul>
    <ScrollBtn @toggleBtn="toggleBtn" :props="{id: `${props.id}-left`, direction: 'right'}"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ScrollBtn from '~/components/ScrollBtn.vue'
import SingleVideoCard from '~/components/SingleVideoCard.vue'

export default Vue.extend({
  props: {
    props: {
      required: true
    }
  },
  data () {
    return {
      btn_state: {
        left: false,
        right: true
      }
    }
  },
  components: {
    ScrollBtn,
    SingleVideoCard
  },
  methods: {
    toggleBtn(command: string) {
      if(command === 'hide_left') {
        this.btn_state.left = false
      } else if (command === 'hide_right') {
        this.btn_state.right = false
      } else if (command === 'open_both') {
        this.btn_state.right = true
        this.btn_state.left = true
      }
    },
    getVideoId(video: any) {
      if(video['embedUrl'] !== undefined) {
        return video['embedUrl']
      } else {
        return video['videoid']
      }
    },
    getVideoThumbnail(video: any) {
      if(video['thumbnailUrl'] !== undefined) {
        return video['thumbnailUrl']
      } else {
        return video['thumbnail']
      }
    }
  }
})
</script>

<style lang="sass" scoped>
.video_list_wrapper
  width: 100%
  position: relative
  &:before,&:after
    content: ''
    display: inline-block
    width: calc(#{$VIEW_PADDING} + 83px)
    height: 200px
    position: absolute
    top: 0
    right: 0
    z-index: $LAYER_2
    opacity: 1
    transition: opacity .2s
  &:before
    background: linear-gradient(to right, #fff 0%, #fff $VIEW_PADDING, rgba(255, 255, 255, 0.25) 63% ,transparent)
    left: 0
  &:after
    background: linear-gradient(to left, #fff 0%, #fff $VIEW_PADDING, rgba(255, 255, 255, 0.25) 63% ,transparent)
    right: 0
  &.blue
    &:before
      background: linear-gradient(to right, #EEF9FA 0%, #EEF9FA $VIEW_PADDING, rgba(235, 247, 249, 0.25) 63% ,transparent)
    &:after
      background: linear-gradient(to left, #EEF9FA 0%, #EEF9FA $VIEW_PADDING, rgba(235, 247, 249, 0.25) 63% ,transparent)
  &.left_hide
    &:before
      opacity: 0
  &.right_hide
    &:after
      width: $VIEW_PADDING
      background-color: rgba(235, 247, 249, .67)
  &.related_videos
    width: calc(100% + #{$VIEW_PADDING} * 2)
  .video_list
    overflow: hidden
    overflow-x: scroll
    display: flex
    align-items: flex-start
    position: relative
    scrollbar-width: none
    &::-webkit-scrollbar
      display: none      
    > .video_list_box
      vertical-align: top
      position: relative
      transition: .3s
      padding-right: 10px
      &:nth-of-type(1)
        margin-left: $VIEW_PADDING
      &:last-of-type
        padding-right: $VIEW_PADDING
  button
    top: 38px
    z-index: $LAYER_3

@media screen and (max-width: 896px)
  .video_list_wrapper
    &:before,&:after
      width: calc(#{$VIEW_PADDING_SP} + 83px)
      top: -10px
    &:before
      background: linear-gradient(to right, #fff 0%, #fff $VIEW_PADDING_SP, rgba(255, 255, 255, 0.25) 63% ,transparent)
    &:after
      background: linear-gradient(to left, #fff 0%, #fff $VIEW_PADDING_SP, rgba(255, 255, 255, 0.25) 63% ,transparent)
    &.blue
      &:before
        background: linear-gradient(to right, #EEF9FA 0%, #EEF9FA $VIEW_PADDING_SP, rgba(235, 247, 249, 0.25) 63% ,transparent)
      &:after
        background: linear-gradient(to left, #EEF9FA 0%, #EEF9FA $VIEW_PADDING_SP, rgba(235, 247, 249, 0.25) 63% ,transparent)
    &.right_hide
      &:after
        width: $VIEW_PADDING_SP
    &.related_videos
      width: calc(100% + #{$VIEW_PADDING_SP} * 2)
    .video_list
      > .video_list_box
        &:nth-of-type(1)
          margin-left: $VIEW_PADDING_SP
        &:last-of-type
          padding-right: $VIEW_PADDING_SP
</style>
