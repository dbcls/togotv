<template>
  <div class="result_wrapper">
    <FacetVideo />
    <div class="video_section">
      <div class="video_section_header">
        <h2 class="page_title tsukushi bold">「{{this.$route.query.query}}」の検索結果</h2>
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
      <Pagination ref="pagination" :lastpage="lastpage" @fetchData="fetchData" />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import VideoListCard from '~/components/VideoListCard.vue'
import VideoList from '~/components/VideoList.vue'
import Pagination from '~/components/Pagination.vue'
import FacetVideo from '~/components/FacetVideo.vue'
import axios from 'axios'

export default Vue.extend({
  watchQuery: ['query'],
  key: route => route.fullPath,
  head() {
    return {
      title: `「${this.$route.query.query}」の検索結果`
    }
  },
  components: {
    VideoListCard,
    VideoList,
    Pagination,
    FacetVideo
  },
  data () {
    return {
      lastpage: 0,
      result_list: []
    }
  },
  mounted() {
    this.fetchData(1, true)
  },
  methods: {
    toggleDisplay() {
      this.$store.commit('toggleDisplay')
    },
    fetchData(page, is_initial) {
      axios.get(`http://togotv-api.bhx.jp/api/search?from=${page}&text=${this.$route.query.query}&rows=21`).then(data => {
        this.result_list = data.data.data
        if(is_initial) {
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
  > .video_section
    > .video_section_header
      display: flex
      justify-content: space-between
      > .page_title
        @include page_title('barchart')
      > ul.display_icon_wrapper
        display: flex
        margin-top: 64px
        > li
          margin-left: 4px
          > img
            width: 27px
            &:hover
              cursor: pointer
</style>
