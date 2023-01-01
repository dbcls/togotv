<template>
  <div>
    <div class="main">
      <img class="main_visual_1" src="~/assets/img/main_visual_1.svg" alt="">
      <div class="main_text">
        <h1>
          <img class="logo" src="~/assets/img/logo.svg" alt="togo tv">
        </h1>
        <p class="description">{{ $t("top_description_1") }}<span class="br"><br></span>{{ $t("top_description_2") }}<nuxt-link :to="localePath(`/faq.html#copyrights`)" class="add_faq_icon"></nuxt-link></p>
        <ul :class="['description_list', $i18n.locale]">
          <li>・{{ $t("manual_of_database_and_tool") }}</li>
          <li>・{{ $t("ajacs_videos_and_documents") }}</li>
          <li>・{{ $t("illustration") }}</li>
        </ul>
        <TextSearch props="index"/>
        <div class="search_example">
          <p class="search_example_title">{{ `${$t('example_query')}:&nbsp;` }}</p>
          <nuxt-link :to="(localePath({ name: 'result', query: { query: 'PubMed', type: 'manual', page: '1' } }))">PubMed</nuxt-link>
          <span class="comma">,</span>
          <nuxt-link :to="(localePath({ name: 'result', query: { query: 'BLAST', type: 'manual', page: '1' } }))">BLAST</nuxt-link>
          <span class="comma">,</span>
          <nuxt-link :to="(localePath({ name: 'result', query: { query: 'NGS', type: 'handson', page: '1' } }))">{{ $t('NGS_Hands-on_training') }}</nuxt-link>
        </div>
      </div>
      <img class="main_visual_2" src="~/assets/img/main_visual_2.svg" alt="">
    </div>
    <section class="course_section" v-if="course_list">
      <h2 class="sections_title tsukushi bold">
        <nuxt-link :to="localePath('/courses.html')">{{ $t("search_for_courses") }}</nuxt-link>
      </h2>
      <CourseList :props="{bg: 'white', courses: course_list}"/>
    </section>
    <section class="newvideo_section bg_blue" v-if="new_video_list">
      <h2 class="sections_title tsukushi bold">
        <nuxt-link :to="localePath('/newvideo.html')">{{ $t("new_videos") }}</nuxt-link>
      </h2>
      <VideoListHorizontalScroll :props="{id: 'newvideo', playList: new_video_list, bg: 'blue'}"/>
    </section>
    <section class="realtime_view_video_section bg_blue" v-if="realtime_video_list">
      <h2 class="sections_title tsukushi bold">
        <nuxt-link :to="localePath('/rankings.html')">{{ $t("ranking") }}</nuxt-link>
      </h2>
      <VideoListHorizontalScroll :props="{id: 'realtime_view_video', playList: realtime_video_list, bg: 'blue'}"/>
    </section>
    <section class="illustation_section bg_blue">
      <h2 class="sections_title tsukushi bold">
        <nuxt-link :to="localePath('/pics.html')">{{ $t('new_illustrations') }}</nuxt-link>
      </h2>
      <IllustrationList :illustration_list="illustration_list" />
    </section>
  </div>
</template>

<script>
import Vue from 'vue'
import CourseList from '~/components/CourseList.vue'
import VideoListHorizontalScroll from '~/components/VideoListHorizontalScroll.vue'
import IllustrationList from '~/components/IllustrationList.vue'
import TextSearch from '~/components/TextSearch.vue'
import axios from 'axios'

export default Vue.extend({
  // async asyncData() {
  //   const [course_list, new_video_list, realtime_video_list] = await Promise.all([
  //     axios.get(`https://togotv-api.dbcls.jp/api/skillset`),
  //     axios.get(`https://togotv-api.dbcls.jp/api/entries?rows=20`),
  //     axios.get(`https://togotv-api.dbcls.jp/api/yt_view/weekly`)
  //   ]);
  //   return { course_list: course_list.data.cources, new_video_list: new_video_list.data.data, realtime_video_list: realtime_video_list.data };
  // },
  beforeCreate() {
    axios
      .get(`https://togotv-api.dbcls.jp/api/skillset_s`)
      .then(data => {
        this.course_list = data.data.cources
      })
      .catch(error => {
        console.log('error', error)
      })
    axios
      .get(`https://togotv-api.dbcls.jp/api/entries?rows=20`)
      .then(data => {
        this.new_video_list = data.data.data
      })
      .catch(error => {
        console.log('error', error)
      })
    axios
      .get(`https://togotv-api.dbcls.jp/api/yt_view/weekly`)
      .then(data => {
        this.realtime_video_list = data.data
      })
      .catch(error => {
        console.log('error', error)
      })
    axios
      .get(`https://togotv-api.dbcls.jp/api/entries?target=pictures&from=1&rows=11`)
      .then(data => {
        this.illustration_list = data.data.data
      })
      .catch(error => {
        console.log('error', error)
      })
  },
  data() {
    return {
      course_list: [],
      new_video_list: [],
      realtime_video_list: [],
      illustration_list: [],
    }
  },
  head() {
    return {
      title: this.$t('top'),
      meta: [
        { hid: 'og:title', property: 'og:title', content: "TogoTV"},
        { hid: 'og:description', property: 'og:description', content: this.$t('about_description') },
        { hid: 'og:url', property: 'og:url', content: process.client ? location.href : '' },
        { hid: 'og:image', property: 'og:image', content: 'https://togotv.dbcls.jp/top_screen_captcha.png'},
      ]

    }
  },
  components: {
    CourseList,
    VideoListHorizontalScroll,
    IllustrationList,
    TextSearch
  }
})
</script>

<style lang="sass" scoped>
.main
  display: flex
  align-items: center
  justify-content: center
  width: 100%
  max-width: 1464px
  margin: 0 auto
  > img
    object-fit: contain
  > .main_visual_1
    width: 32.6%
    min-width: 404px
    transform: translateY(-6px)
    z-index: 20
  > .main_visual_2
    width: 19.8%
    min-width: 233px
    transform: translateY(77px)
  > .main_text
    margin-top: 58px
    margin-left: 42px
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
      &.en
        width: 382px
        li
          &:last-child
            margin-left: 0px
    > .search_example
      display: flex
      align-items: center
      font-size: 12px
      margin-top: -4px
      margin-left: 14px
      text-align: center
      > .comma
        margin: 0 3px
section
  padding: 15px 0
  &:nth-of-type(2)
    margin-top: 30px
    padding-top: 30px
  > h2
    margin-left: $VIEW_PADDING
    > a
      text-decoration: none
      color: $BLACK
      transition: .2s
      &:hover
        color: $MAIN_COLOR
  &.course_section > h2
    @include section_title('course')
  &.newvideo_section > h2
    @include section_title('new')
  &.realtime_view_video_section > h2
    @include section_title('barchart')
  &.illustation_section > h2
    @include section_title('img')

@media screen and (max-width: 896px)
  .main
    flex-direction: column
    text-align: center
    width: 100vw
    overflow: hidden
    > .main_visual_1,
    > .main_visual_2
      display: none
    > .main_text
      margin: 0
      > h1
        > img.logo
          width: 60%
      > .description
        font-size: 14px
        line-height: 20px
        white-space: break-spaces
        width: 80%
        margin: 0 auto
        > .br
          display: none
      > .description_list
        width: 100%
        justify-content: center
        font-size: 14px
        line-height: 22px
        margin-top: 12px
      > .search_example
        justify-content: center
      > .input_wrapper
        &.index
          margin: 20px auto 0
  .course_section,
  .newvideo_section,
  .realtime_view_video_section,
  .illustation_section
    > h2
      margin-left: $VIEW_PADDING_SP

</style>
