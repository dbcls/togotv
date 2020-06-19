<template>
  <div class="single_video_wrapper">
    <nuxt-link
      class="thumbnail_wrapper"
      :to="{name: 'video', query: {id: props.id, course: props.courseId}}">
      <img :class="['thumbnail', props.size]" :src="props.thumbnail" :alt="props.title">
      <span class="duration" v-html="converSecToHour(props.duration)"></span>
    </nuxt-link>
    <div class="description_wrapper">
      <p :class="['description', props.size]" v-html="props.description"></p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    props: {
      required: true
    }
  },
  methods: {
    converSecToHour(time: number){
      const sec: number = (time % 60) % 60;
      const min: number = Math.floor(time / 60) % 60;
      const hour: number = Math.floor(time / 3600);

      if(hour === 0) {
        return `<span class="time mont bold">${min}</span><span style="font-size: 12px; margin-right: 2px;">分</span>`
      }　else {
        return `<span class="time mont bold">${hour}</span><span style="font-size: 12px; margin-right: 2px;">時間</span><span class="time mont bold">${min}</span><span style="font-size: 12px; margin-right: 2px;">分</span>`
      }
    }
  }
})
</script>

<style lang="sass" scoped>
.single_video_wrapper
  a
    text-decoration: none
    color: $BLACK
    display: block
    &.thumbnail_wrapper
      position: relative
    > .thumbnail
      width: 247px
      max-width: 247px
      min-width: 247px
      height: 139px
      min-height: 139px
      max-height: 139px
      object-fit: cover
      border-radius: 4px
      &.small
        width: 166px
    > .duration
      position: absolute
      right: 0
      bottom: 0
      background-color: #fff
      padding: 0 5px 4px 4px
      border-radius: 2px 0 2px 0
      @include total_time
      color: $MAIN_COLOR
      font-size: 14px
      &:before
        @include icon('time_hover')
        width: 18px
        height: 18px
    > .title
      font-size: 14px
      margin: 3px 0 2px
  > .description_wrapper
    overflow: hidden
    width: 247px
    height: 30px
    > .description
      font-size: 12px
      line-height: 15px
      margin: 0
      display: -webkit-box
      -webkit-box-orient: vertical
      -webkit-line-clamp: 2
      &.small
        width: 166px
</style>
