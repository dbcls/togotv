<template>
  <div class="courses_wrapper">
    <h2 class="page_title tsukushi bold">{{ $t('courses') }}</h2>
    <section class="video_section">
      <ul>
        <li v-for="course in courses" :key="course.id">
          <h3 class="course_name">
            <nuxt-link class="tsukushi bold" :to="localePath({name: 'course', query: {id: course.id}})">
              {{ course.title }}
            </nuxt-link>
            <span class="total_time mont bold" v-html="converSecToHour(course.total_time)"><span class="unit">{{ $t("minutes") }}</span></span>
          </h3>
          <VideoListHorizontalScroll
            :props="{id: `video_${course.id}`, playList: course.playlist, bg:'white', courseId: course.id}"
          />
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import Vue from 'vue'
import VideoListHorizontalScroll from '~/components/VideoListHorizontalScroll.vue'
import axios from 'axios'

export default Vue.extend({
  async asyncData ( params ) {
    const { data } = await axios.get(`//togotv-api.dbcls.jp/api/skillset`)
    return { courses: data.cources}
  },
  head() {
    return {
      title: this.$t('courses'),
      meta: [
        { hid: 'og:title', property: 'og:title', content: this.$t('courses') },
        { hid: 'og:url', property: 'og:url', content: location.href },
        { hid: 'og:image', property: 'og:image', content: 'https://raw.githubusercontent.com/dbcls/togotv/master/assets/img/icon/icon_course.svg'},
      ]
    }
  },
  components: {
    VideoListHorizontalScroll
  },
  methods: {
    converSecToHour(time){
      // const sec: number = (time % 60) % 60;
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
.courses_wrapper
  > .page_title
    @include page_title('course')
    padding-left: $VIEW_PADDING
    margin-left: -10px
  > .video_section
    > ul
      > li
        margin-top: 32px
        &:first-of-type
          margin-top: 0
        > h3.course_name
          padding-left: $VIEW_PADDING
          position: relative
          z-index: $LAYER_2
          display: flex
          align-items: center
          margin-bottom: 15px
          > a
            font-size: 18px
            display: flex
            align-items: flex-start
            text-decoration: none
            color: $BLACK
            transition: .2s
            &:before
              min-width: 26px
              width: 26px
              height: 26px
              margin-right: 2px
              margin-top: -1px
              @include icon('course')
            &:hover
              color: $MAIN_COLOR
          > .total_time
            @include total_time

@media screen and (max-width: 896px)
  .courses_wrapper
    > .page_title
      padding-left: $VIEW_PADDING_SP
    > .video_section
      > ul
        > li
          > h3.course_name
            padding-left: $VIEW_PADDING_SP
            flex-direction: column
            align-items: flex-start
            > .total_time
              margin: 0
</style>
