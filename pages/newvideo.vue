<template>
  <div class="newvideo_wrapper">
    <AsideParts />
    <div class="video_section">
      <div class="video_section_header">
        <h2 class="page_title tsukushi bold">新着動画</h2>
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
      <VideoListCard v-if="$store.state.display === 'card'" :video_info_array="new_video_list"/>
      <VideoList v-if="$store.state.display === 'list'" :video_info_array="new_video_list"/>
      </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import VideoListCard from '~/components/VideoListCard.vue'
import VideoList from '~/components/VideoList.vue'
import AsideParts from '~/components/parts/AsideParts.vue'
import axios from 'axios'

export default Vue.extend({
  async asyncData ( params ) {
    // console.log('params', params.query.id) //ID部分これに差し替える
    const { data } = await axios.get(`http://togotv-api.bhx.jp/api/entries?rows=20`)
    console.log(data)
    return { new_video_list: data.data }
  },
  head() {
    return {
      title: '新着動画'
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
</style>
