<template>
  <div class="courses_wrapper">
    <h2 class="page_title tsukushi bold">
      <span class="course_title">{{ course.title }}</span>
      <span class="total_time" v-if="course.total_time" v-html="converSecToHour(course.total_time)"></span>
    </h2>
    <div class="content_wrapper">
      <p>{{ course.description }}</p>
      <section class="video_section">
        <ul>
          <li v-for="video in course.playlist" :key="video.id">
            <SingleVideoCard :props="{id: video.videoid, thumbnail: video.thumbnailUrl, title: video.title, description: video.description, duration: video.duration, courseId: course.id, uploadDate: video.uploadDate}" />
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import SingleVideoCard from '~/components/SingleVideoCard.vue'
import axios from 'axios'

export default Vue.extend({
  created() {
    axios.get(`https://togotv-api.dbcls.jp/api/skillset`).then(data => {
      let return_course = []
      data.data.cources.forEach(course => {
        if(course.id === this.$route.query.id) {
          return_course = course
        }
      })
      this.course = return_course
    })
  },
  data() {
    return {
      course: {}
    }
  },
  head() {
    return {
      title: this.course.title
    }
  },
  components: {
    SingleVideoCard
  },
  methods: {
    converSecToHour(time){
      // const sec = (time % 60) % 60;
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
    > .total_time
      @include total_time
  > .content_wrapper
    padding: 0 $VIEW_PADDING
    > .video_section
      > ul
        margin-left: -14px
        display: flex
        flex-wrap: wrap
        > li
          margin-left: 14px
          margin-bottom: 28px

@media screen and (max-width: 896px)
  .courses_wrapper
    > .page_title
      padding-left: $VIEW_PADDING_SP
      align-items: flex-start
      position: relative
      margin-bottom: 30px
      > .course_title
        margin-top: 9px
      > .total_time
        position: absolute
        bottom: -18px
    > .content_wrapper
      padding: 0 $VIEW_PADDING_SP
      overflow: hidden
      > .video_section
        width: 100%
        overflow: hidden
        > ul
          > li
            width: calc((100% - 28px) / 2)
</style>
