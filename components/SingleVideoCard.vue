<template>
  <div class="single_video_wrapper">
    <nuxt-link
      class="thumbnail_wrapper"
      :to="localePath({name: 'video', params: {video: `${props.uploadDate.replace(/-/g, '')}`}})">
      <img :class="['thumbnail', props.size]" :src="props.thumbnail" :alt="props.title">
      <span v-if="props.duration !== ''" class="duration" v-html="converSecToHour(props.duration)"></span>
    </nuxt-link>
    <div class="description_wrapper">
      <p :class="['description', props.size]" v-html="props.description"></p>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  props: {
    props: {
      required: true
    }
  },
  methods: {
    converSecToHour(time){
      // if(time.indexOf('duration') !== -1) {
      //   time = JSON.parse(time)
      //   time = time.duration
      // }
      let hour = 0, min = 0, sec = 0;
      if(String(time).indexOf('PT') !== -1) {
        const reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
        if (reptms.test(time)) {
          const matches = reptms.exec(time);
          if (matches[1]) hour = Number(matches[1]);
          if (matches[2]) min = Number(matches[2]);
          if (matches[3]) sec = Number(matches[3]);
        }
      } else {
        sec = (time % 60) % 60;
        min = Math.floor(time / 60) % 60;
        hour = Math.floor(time / 3600);
      }
      let hour_unit = ''
      let min_unit = ''
      let sec_unit = ''
      if(this.$i18n.locale === 'ja') {
        hour_unit = '時間'
        min_unit = '分'
        sec_unit = '秒'
      } else if (this.$i18n.locale === 'en') {
        hour_unit = 'h'
        min_unit = 'min'
        sec_unit = 'sec'
      }
      
      if(hour === 0) {
        return `<span class="time mont bold">${min}</span><span style="font-size: 12px; margin-right: 2px;">${min_unit}</span><span class="time mont bold">${sec}</span><span class="unit">${sec_unit}</span>`
      }　else {
        return `<span class="time mont bold">${hour}</span><span style="font-size: 12px; margin-right: 2px;">${hour_unit}</span><span class="time mont bold">${min}</span><span style="font-size: 12px; margin-right: 2px;">${min_unit}</span><span class="time mont bold">${sec}</span><span clas="unit">${sec_unit}</span>`
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
      font-weight: 500
      line-height: 15px
      margin: 0
      display: -webkit-box
      -webkit-box-orient: vertical
      -webkit-line-clamp: 2
      &.small
        width: 166px

@media screen and (max-width: 896px)
  .single_video_wrapper
    a
      > .thumbnail
        width: 150px
        max-width: 150px
        min-width: 150px
        height: 86px
        min-height: 86px
        max-height: 86px
    > .description_wrapper
      width: 150px
</style>
