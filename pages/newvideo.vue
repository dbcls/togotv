<template>
  <div class="newvideo_wrapper">
    <AsideParts />
    <div class="video_section">
      <div class="video_section_header">
        <h2 class="page_title tsukushi bold">{{ $t("new_videos") }}</h2>
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
      <VideoListCard v-if="$store.state.display === 'card'" :video_info_array="new_video_list" :has_aside="true" />
      <VideoList v-if="$store.state.display === 'list'" :video_info_array="new_video_list"/>
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
  data() {
    return {
      lastpage: 0,
      new_video_list: []
    }
  },
  head() {
    return {
      title: this.$t("new_videos"),
      meta: [
        { hid: 'og:title', property: 'og:title', content: this.$t("new_videos") },
        { hid: 'og:url', property: 'og:url', content: process.client ? location.href : '' },
        { hid: 'og:image', property: 'og:image', content: 'https://raw.githubusercontent.com/dbcls/togotv/master/assets/img/icon/icon_new.svg'},
      ]
    }
  },
  mounted() {
    this.fetchData(1, true)
  },
  components: {
    VideoListCard,
    AsideParts,
    VideoList,
    Pagination
  },
  methods: {
    toggleDisplay() {
      this.$store.commit('toggleDisplay')
    },
    fetchData(page, is_initial) {
      let url = ''
      if(this.$i18n.locale === 'ja') {
        url = `https://togotv-api.dbcls.jp/api/entries?from=${page}&rows=21`
      } else if (this.$i18n.locale === 'en') {
        url = `https://togotv-api.dbcls.jp/api/bool_search?lang=en&from=${page}&rows=21`
      }

      axios.get(url).then(data => {
        this.new_video_list = data.data.data
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
.newvideo_wrapper
  padding: 0 $VIEW_PADDING
  display: flex
  align-items: flex-start
  justify-content: flex-start
  > .video_section
    > .video_section_header
      display: flex
      justify-content: space-between
      > .page_title
        @include page_title('new')
      > ul.display_icon_wrapper
        display: flex
        margin-top: 56px
        > li
          margin-left: 4px
          > img
            width: 27px
            &:hover
              cursor: pointer
    // > ul
    //   display: flex
    //   flex-wrap: wrap
    //   margin-left: -18px
    //   min-width: 654px
    //   > li
    //     margin-left: 18px
    //     margin-bottom: 15px
    //     > img
    //       width: 200px
    //       border-radius: 4px
@media screen and (max-width: 896px)
  .newvideo_wrapper
    padding: 0 $VIEW_PADDING_SP
    flex-direction: column-reverse
    > .video_section
      > .video_section_header
        > ul.display_icon_wrapper
          margin-top: 9px
</style>