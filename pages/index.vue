<template>
  <div>
    <div class="main">
      <img class="main_visual_1" src="~/assets/img/main_visual_1.svg" alt="">
      <div class="main_text">
        <h1>
          <img class="logo" src="~/assets/img/logo.svg" alt="togo tv">
        </h1>
        <p class="description">生命科学分野における有用な情報を紹介するウェブサイトです。<br>だれでも自由に閲覧し再利用することができます。<nuxt-link :to="{name: 'faq', hash: '#copyrights' }" class="add_faq_icon"></nuxt-link></p>
        <ul class="description_list">
          <li>・データベースやツールの動画マニュアル</li>
          <li>・講演や講習会動画、資料</li>
          <li>・イラスト</li>
        </ul>
        <TextSearch props="index"/>
        <!-- <form>
          <input type="text" name="" id="" placeholder="動画を検索">
          <button type="submit"></button>
        </form> -->
      </div>
      <img class="main_visual_2" src="~/assets/img/main_visual_2.svg" alt="">
    </div>
    <section class="course_section">
      <h2 class="tsukushi bold">
        <nuxt-link to="courses">スキル別コースから探す</nuxt-link>
      </h2>
      <CourseList :props="{bg: 'white', courses: course_list}"/>
    </section>
    <section class="newvideo_section bg_blue">
      <h2 class="tsukushi bold">
        <nuxt-link to="newvideo">新着動画</nuxt-link>
      </h2>
      <VideoListHorizontalScroll :props="{id: 'newvideo', playList: new_video_list.data.data, bg: 'blue'}"/>
    </section>
    <section class="realtime_view_video_section bg_blue">
      <h2 class="tsukushi bold">
        <nuxt-link to="rankings">リアルタイム視聴ランキング</nuxt-link>
      </h2>
      <VideoListHorizontalScroll :props="{id: 'realtime_view_video', playList: realtime_video_list.data.data, bg: 'blue'}"/>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CourseList from '~/components/CourseList.vue'
import VideoListHorizontalScroll from '~/components/VideoListHorizontalScroll.vue'
import TextSearch from '~/components/TextSearch.vue'
import axios from 'axios'

export default Vue.extend({
  async asyncData() {
    // 2つのHTTPのレスポンスを受けてからページがレンダリングされる
    const [course_list, new_video_list, realtime_video_list] = await Promise.all([
      axios.get(`http://togotv-api.bhx.jp/api/skillset`),
      axios.get(`http://togotv-api.bhx.jp/api/entries?rows=20`),
      axios.get(`http://togotv-api.bhx.jp/api/entries?rows=20`)
    ]);
    return { course_list: course_list.data.cources, new_video_list, realtime_video_list };
  },
  head() {
    return {
      title: 'トップ'
    }
  },
  components: {
    CourseList,
    VideoListHorizontalScroll,
    TextSearch
  }
})
</script>

<style lang="sass" scoped>
  .main
    display: flex
    align-items: center
    justify-content: center
    > img
      object-fit: contain
    > .main_visual_1
      width: 32.6%
      min-width: 404px
    > .main_visual_2
      width: 19.8%
      min-width: 233px
      transform: translateY(77px)
    > .main_text
      margin-top: 58px
      margin-left: 34px
      margin-right: 15px
      > h1
        > img.logo
          width: 327px
      > .description
        margin-bottom: 8px
        white-space: nowrap
        line-height: 24px
      > .description_list
        display: flex
        flex-wrap: wrap
        width: 342px
        font-size: 18px
        line-height: 28px
        font-weight: bold
        li
          &:last-child
            margin-left: 10px
  .course_section,
  .newvideo_section,
  .realtime_view_video_section
    > h2
      margin-left: $VIEW_PADDING
      > a
        text-decoration: none
        color: $BLACK
        transition: .2s
        &:hover
          color: $MAIN_COLOR
  .course_section
    margin-top: 80px
    > h2
      @include section_title('course')
  .newvideo_section
    margin-top: 58px
    padding-top: 30px
    > h2
      @include section_title('new')
  .realtime_view_video_section
    padding-top: 28px
    padding-bottom: 52px
    > h2
      @include section_title('barchart')
</style>
