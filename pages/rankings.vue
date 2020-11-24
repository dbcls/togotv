<template>
  <div class="realtime_rank_wrapper">
    <AsideParts />
    <div class="video_section">
      <div class="video_section_header">
        <h2 class="page_title tsukushi bold">{{ $t('ranking') }}</h2>
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
      <ul class="span_tab_wrapper">
        <li @click="active_tab = 'year'" :class="['span_tab', 'tsukushi', 'bold', active_tab === 'year' ? 'active' : '']">{{ $t('last_year') }}</li>
        <li @click="active_tab = 'month'" :class="['span_tab', 'tsukushi', 'bold', active_tab === 'month' ? 'active' : '']">{{ $t('last_month') }}</li>
        <li @click="active_tab = 'weekly'" :class="['span_tab', 'tsukushi', 'bold', active_tab === 'weekly' ? 'active' : '']">{{ $t('last_week') }}</li>
      </ul>
      <VideoListCard v-if="$store.state.display === 'card'" :video_info_array="getActiveData()"/>
      <VideoList v-if="$store.state.display === 'list'" :video_info_array="getActiveData()"/>
      </div>
  </div>
</template>

<script>
import Vue from 'vue'
import VideoListCard from '~/components/VideoListCard.vue'
import VideoList from '~/components/VideoList.vue'
import AsideParts from '~/components/AsideParts.vue'
import axios from 'axios'

export default Vue.extend({
  // async asyncData() {
  //   const [year_data, month_data, weekly_data] = await Promise.all([
  //     axios.get(`https://togotv-api.dbcls.jp/api/yt_view/year`),
  //     axios.get(`https://togotv-api.dbcls.jp/api/yt_view/month`),
  //     axios.get(`https://togotv-api.dbcls.jp/api/yt_view/weekly`)
  //   ]);
  //   return { year_data: year_data.data, month_data: month_data.data, weekly_data: weekly_data.data };
  // },
  created() {
    axios
      .get(`https://togotv-api.dbcls.jp/api/yt_view/year`)
      .then(data => {
        this.year_data = data.data
      })
      .catch(error => {
        console.log('error', error)
      })

    axios
      .get(`https://togotv-api.dbcls.jp/api/yt_view/month`)
      .then(data => {
        this.month_data = data.data
      })
      .catch(error => {
        console.log('error', error)
      })

    axios
      .get(`https://togotv-api.dbcls.jp/api/yt_view/weekly`)
      .then(data => {
        this.weekly_data = data.data
      })
      .catch(error => {
        console.log('error', error)
      })
  },
  head() {
    return {
      title: this.$t('ranking'),
      meta: [
        { hid: 'og:title', property: 'og:title', content: this.$t('ranking') },
        { hid: 'og:url', property: 'og:url', content: process.client ? location.href : '' },
        { hid: 'og:image', property: 'og:image', content: 'https://raw.githubusercontent.com/dbcls/togotv/master/assets/img/icon/icon_barchart.svg'},
      ]
    }
  },
  data () {
    return {
      active_tab: 'year',
      year_data: [],
      month_data: [],
      weekly_data: []
    }
  },
  components: {
    VideoListCard,
    AsideParts,
    VideoList
  },
  methods: {
    toggleDisplay() {
      this.$store.commit('toggleDisplay')
    },
    getActiveData() {
      switch (this.active_tab) {
        case 'year':
          return this.year_data
        case 'month':
          return this.month_data
        case 'weekly':
          return this.weekly_data

      }
    }
  }
})
</script>

<style lang="sass" scoped>
.realtime_rank_wrapper
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
        margin-top: 56px
        > li
          margin-left: 4px
          > img
            width: 27px
            &:hover
              cursor: pointer
    > .span_tab_wrapper
      display: flex
      margin-bottom: 8px
      > .span_tab
        font-size: 18px
        margin-right: 40px
        padding: 0 10px 22px
        &:hover
          cursor: pointer
        &.active
          @include blue_underline
          background-position: 10px 26px
@media screen and (max-width: 896px)
  .realtime_rank_wrapper
    padding: 0 $VIEW_PADDING_SP
    flex-direction: column-reverse
    > .video_section
      width: 100%
      overflow: hidden
      > .video_section_header
        > ul.display_icon_wrapper
          margin-top: 9px
      > .span_tab_wrapper
        > .span_tab
          margin-right: 8px
          padding: 0
</style>
