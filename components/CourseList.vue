<template>
  <div :class="['course_wrapper', props.bg, btn_state.left ? '' : 'left_hide', btn_state.right ? '' : 'right_hide']">
    <ScrollBtn @toggleBtn="toggleBtn" :props="{id: 'course-left', direction: 'left'}"/>
    <ul class="course_list scroll-horizontal">
      <li :class="['course_box', is_shorter_than_vw ? 'short' : '']" v-for="course in props.courses" :key="course.id">
        <nuxt-link class="title tsukushi bold" :to="localePath({name: 'course', query: {id: course.id}})">{{ course.title }}</nuxt-link>
        <p class="total_time" v-html="converSecToHour(course.total_time)"></p>
        <div class="detail">
          <nuxt-link class="detail_title tsukushi bold" :to="localePath({name: 'course', query: {id: course.id}})">{{ course.title }}</nuxt-link>
          <p class="detail_description">{{ course.description }}</p>
          <span class="tsukushi">再生リスト一覧</span>
          <ul class="detail_playlist">
            <li v-for="video in course.playlist" :key="video.videoid">
              <nuxt-link :to="localePath({name: 'video', params: {video: video.uploadDate.replace(/-/g, '')}})" class="tsukushi bold">{{ video.title }}</nuxt-link>
            </li>
          </ul>
        </div>
      </li>
    </ul>
    <ScrollBtn :style="is_shorter_than_vw ? 'display: none;' : ''" @toggleBtn="toggleBtn" :props="{id: 'course-right', direction: 'right'}"/>
  </div>
</template>

<script>
import Vue from 'vue'
import ScrollBtn from '~/components/ScrollBtn.vue'

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
  computed: {
    is_shorter_than_vw: function () {
      let single_course_width = 204
      if(this.props.courses !== undefined) {
        let course_width = this.props.courses.length * single_course_width
        if(window.innerWidth - 160 >= course_width) {
          return true
        }
      }
    }
  },
  components: {
    ScrollBtn
  },
  methods: {
    toggleBtn(command) {
      if(command === 'hide_left') {
        this.btn_state.left = false
      } else if (command === 'hide_right') {
        this.btn_state.right = false
      } else if (command === 'open_both') {
        this.btn_state.right = true
        this.btn_state.left = true
      }
    },
    converSecToHour(time){
      const sec = (time % 60) % 60;
      const min = Math.floor(time / 60) % 60;
      const hour = Math.floor(time / 3600);

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
.course_wrapper
  width: 100%
  position: relative
  &:before,&:after
    content: ''
    display: inline-block
    width: calc(#{$VIEW_PADDING} + 83px)
    height: 246px
    position: absolute
    top: 0
    right: 0
    z-index: $LAYER_2
    opacity: 1
    transition: opacity .2s
  &:before
    background: linear-gradient(to right, #fff 0%, #fff $VIEW_PADDING, rgba(255, 255, 255, 0.25) 63% ,rgba(255, 255, 255, 0))
    left: 0
  &:after
    background: linear-gradient(to left, #fff 0%, #fff $VIEW_PADDING, rgba(255, 255, 255, 0.25) 63% ,rgba(255, 255, 255, 0))
    right: 0
  &.left_hide
    &:before
      opacity: 0
  &.right_hide
    &:after
      width: $VIEW_PADDING
      background: #fff
  &.blue
    background-color: rgba(235, 247, 249, .67)
    &:before
      background: linear-gradient(to right, #EEF9FA 0%, #EEF9FA $VIEW_PADDING, rgba(255, 255, 255, 0.25) 63% ,rgba(255, 255, 255, 0))
      left: 0
    &:after
      background: linear-gradient(to left, #EEF9FA 0%, #EEF9FA $VIEW_PADDING, rgba(255, 255, 255, 0.25) 63% ,rgba(255, 255, 255, 0))
  .course_list
    overflow: hidden
    overflow-x: scroll
    display: flex
    align-items: flex-start
    position: relative
    scrollbar-width: none
    &::-webkit-scrollbar
      display: none
    &:hover
      padding: 40px 0 600px 0
      margin-top: -40px
      margin-bottom: -600px
    > .course_box
      background-color: $MAIN_COLOR
      vertical-align: top
      position: relative
      transition: .3s
      &:nth-of-type(1)
        margin-left: $VIEW_PADDING
      &:last-of-type
        display: flex
        &:after
          content: ''
          width: $VIEW_PADDING
          height: 10px
          display: inline-block
      &:before
        position: absolute
        top: 0
        left: 0
        content: ''
        border-top: 103px solid rgba(255, 255, 255, .15)
        border-right: 103px solid rgba(255, 255, 255, 0)
        border-bottom: 103px solid rgba(255, 255, 255, 0)
        border-left: 103px solid rgba(255, 255, 255, .15)
      &.short
        &:after
          display: none
      > .title
        font-size: 20px
        width: 206px
        height: 206px
        color: #fff
        text-decoration: none
        display: flex
        align-items: center
        justify-content: center
        padding: 30px
        box-sizing: border-box
        line-height: 29px
        text-align: center
        position: relative
        z-index: $LAYER_1
      > .total_time
        position: absolute
        left: 0
        bottom: 12px
        color: $POINT_COLOR
        margin: 0
        font-size: 17px
        width: 192px
        text-align: right
        &:before
          width: 22px
          height: 16px
          transform: translateY(1.5px)
          margin-right: 1px
          @include icon('time')
      > .detail
          display: none
          position: absolute
          z-index: $LAYER_4
          background-color: $MAIN_COLOR
          border-radius: 5px
          top: -20px
          left: 205px
          color: #fff
          text-decoration: none
          width: 330px
          box-shadow: 0 3px 20px rgba(0, 0, 0, .4)
          padding: 22px 24px
          box-sizing: border-box
          &:before
            content: ""
            position: absolute
            top: 15%
            left: -26px
            border: 15px solid rgba(255, 255, 255, 0)
            border-right: 15px solid $MAIN_COLOR
          > .detail_title
            font-size: 20px
            line-height: 25px
            margin: 0
            color: #fff
            text-decoration: none
            &:before
              @include icon("course-white")
              width: 25px
              height: 25px
              transform: translateY(5px)
          > .detail_description
              font-size: 14px
              margin: 7px 0 14px
              line-height: 20px
          > .detail_playlist
            background-color: #fff
            border-radius: 5px
            margin-top: 4px
            padding: 15px 13px
            max-height: 200px
            overflow-y: auto
            > li
              > a
                text-decoration: none
                color: $BLACK
                font-size: 12px
                line-height: 14px
                margin-bottom: 6px
                display: flex
                align-items: flex-start
                &:before
                  @include icon("circlevideo")
                  width: 15px
                  min-width: 15px
                  height: 15px
                &:hover
                  text-decoration: underline
          > span
            font-size: 12px
      &:hover
        background-color: $POINT_COLOR
        > .title
          color: $MAIN_COLOR
        > .detail
          display: block
        > .total_time
          color: $MAIN_COLOR
          &:before
            @include icon('time_hover')
  button
    top: 82px
    z-index: $LAYER_3
  &:hover
    padding-top: 40px
    margin-top: -40px
    button
      top: 122px

@media screen and (max-width: 896px)
  .course_wrapper
    &:before,&:after
      width: calc(#{$VIEW_PADDING_SP} + 20px)
      height: 206px
    &:before
      background: linear-gradient(to right, #fff 0%, #fff $VIEW_PADDING_SP, rgba(255, 255, 255, 0.25) 63% ,rgba(255, 255, 255, 0))
    &:after
      background: linear-gradient(to left, #fff 0%, #fff $VIEW_PADDING_SP, rgba(255, 255, 255, 0.25) 63% ,rgba(255, 255, 255, 0))
    &.right_hide
      &:after
        width: $VIEW_PADDING_SP
    &.blue
      &:before
        background: linear-gradient(to right, #EEF9FA 0%, #EEF9FA $VIEW_PADDING_SP, rgba(255, 255, 255, 0.25) 63% ,rgba(255, 255, 255, 0))
      &:after
        background: linear-gradient(to left, #EEF9FA 0%, #EEF9FA $VIEW_PADDING_SP, rgba(255, 255, 255, 0.25) 63% ,rgba(255, 255, 255, 0))
    .course_list
      > .course_box
        &:nth-of-type(1)
          margin-left: $VIEW_PADDING_SP
        &:last-of-type
          &:after
            display: none
        &:before
          border-top: 78px solid rgba(255, 255, 255, 0.15)
          border-right: 78px solid rgba(255, 255, 255, 0)
          border-bottom: 78px solid rgba(255, 255, 255, 0)
          border-left: 78px solid rgba(255, 255, 255, 0.15)
        > a.title
          font-size: 16px
          line-height: 24px
          width: 126px
          height: 126px
          padding: 15px
          box-sizing: content-box
        > .total_time
          display: none
        &:hover
          > .detail
            display: none
</style>
