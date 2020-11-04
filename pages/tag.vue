<template>
  <div class="result_wrapper">
    <AsideParts />
    <div class="video_section">
      <div class="video_section_header">
        <h2 class="page_title tsukushi bold">{{this.$route.query.name}}</h2>
        <ul class="display_icon_wrapper">
          <li>
            <img v-if="$store.state.display === 'card'" @click="toggleDisplay" src="~/assets/img/icon/icon_list_off.svg" alt="リスト表示">
            <img v-if="$store.state.display === 'list'" src="~/assets/img/icon/icon_list.svg" alt="リスト表示">
          </li>
          <li>
            <img v-if="$store.state.display === 'list'" @click="toggleDisplay" src="~/assets/img/icon/icon_card_off.svg" alt="カード表示">
            <img v-if="$store.state.display === 'card'" src="~/assets/img/icon/icon_card.svg" alt="カード表示">
          </li>
        </ul>
      </div>
      <VideoListCard v-if="$store.state.display === 'card'" :video_info_array="result_list"/>
      <VideoList v-if="$store.state.display === 'list'" :video_info_array="result_list"/>
      <Pagination ref="pagination" :props="{lastpage: lastpage}" @fetchData="fetchData" />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import VideoListCard from '~/components/VideoListCard.vue'
import VideoList from '~/components/VideoList.vue'
import AsideParts from '~/components/AsideParts.vue'
import Pagination from '~/components/Pagination.vue'
import axios from 'axios'

export default Vue.extend({
  watchQuery: ['name'],
  key: route => route.fullPath,
  head() {
    return {
      title: this.$route.query.name
    }
  },
  mounted() {
    this.fetchData(1)
  },
  components: {
    VideoListCard,
    VideoList,
    AsideParts,
    Pagination
  },
  data () {
    return {
      selected_video_type: [],
      selected_release_season: [],
      selected_language: [],
      selected_duration: 0,
      result_list: [],
      lastpage: 0
    }
  },
  methods: {
    toggleDisplay() {
      this.$store.commit('toggleDisplay')
    },
    fetchData (page) {
      axios.get(`https://togotv-api.dbcls.jp/api/search?keywords=${this.$route.query.name}&from=${page}&rows=21`).then(data => {
        this.result_list = data.data.data
        if(data.data.last_page !== undefined) {
          this.lastpage = data.data.last_page
        }
        this.$refs.pagination.changeCurrentPage(page);
      })
    }
  }
})
</script>

<style lang="sass" scoped>
.result_wrapper
  padding: 0 $VIEW_PADDING
  display: flex
  align-items: flex-start
  justify-content: flex-start
  > .facet_wrapper
    @include facet
    > p.facet_title
      font-size: 18px
      display: flex
      align-items: center
      margin: 30px 0 14px
      &:before
        width: 32px
        height: 32px
      &.search
        &:before
          @include icon('search_color')
      &.filter
        &:before
          @include icon('filter')
    > .input_wrapper
      @include text_input
      > input
        width: 240px
        height: 28px
      > button
        width: 18px
        height: 18px
    > .facet_small_section
      border-bottom: 1px solid $MAIN_COLOR
      padding-bottom: 26px
      &:last-of-type
       border-bottom: none
      > .facet_small_title
        font-size: 14px
        display: flex
        align-items: center
        &:before
          width: 23px
          height: 23px
          margin-top: -1px
          margin-right: 2px
        &.video
          &:before
            @include icon('video')
        &.calender
          &:before
            @include icon('calender')
        &.tag
          &:before
            @include icon('tag')
        &.language
          &:before
            @include icon('language')
        &.time
          &:before
            @include icon('time')
      > label
        @include checkbox
        margin-left: 3px
      > .select_time_bar
        position: relative
        display: flex
        justify-content: space-between
        width: 213px
        margin: 26px 0 0 6px
        &:before
          content: ''
          width: 213px
          height: 3px
          background-color: $SUB_COLOR
          position: absolute
          top: 50%
          left: 50%
          transform: translate(-50%, -50%)
        > span.tab
          display: flex
          flex-direction: column
          position: relative
          > .duration_time
            font-size: 14px
            position: absolute
            left: -50%
            top: -19px
            display: flex
            align-items: flex-end
            font-weight: 600
            > span.unit
              font-size: 10px
              white-space: nowrap
              font-weight: 500
          &:after
            content: ''
            width: 11px
            height: 11px
            display: inline-block
            border-radius: 11px
            box-sizing: border-box
            background-color: $SUB_COLOR
          &.on
            &:after
              background-color: $POINT_COLOR
              border: 2px solid $SUB_COLOR
          &:hover
            cursor: pointer
  > .video_section
    > .video_section_header
      display: flex
      justify-content: space-between
      > .page_title
        @include page_title('tag')
        &:before
          min-width: 40px
          width: 40px
          height: 40px
          margin-right: 5px
          transform: translateY(3px)
      > ul.display_icon_wrapper
        display: flex
        margin-top: 64px
        > li
          margin-left: 4px
          > img
            width: 27px
            &:hover
              cursor: pointer

@media screen and (max-width: 896px)
  .result_wrapper
    padding: 0 $VIEW_PADDING_SP
    flex-direction: column-reverse
    > .video_section
      > .video_section_header
        > ul.display_icon_wrapper
          margin-top: 9px

</style>
