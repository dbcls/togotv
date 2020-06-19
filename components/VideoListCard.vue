<template>
  <div class="video_list_wrapper">
    <ul>
      <li v-for="video in video_info_array" :key="video.embedUrl">
        <SingleVideoCard :props="{id: video.embedUrl, thumbnail: video.thumbnailUrl, title: video.name, description: video.description, duration: video['duration(ISO 8601)']}"/>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import SingleVideoCard from '~/components/SingleVideoCard.vue'

export default Vue.extend({
  props: {
    video_info_array: {
      required: true
    }
  },
  data () {
    return {

    }
  },
  components: {
    SingleVideoCard
  },
  methods: {

  }
})
</script>

<style lang="sass" scoped>
.video_list_wrapper
  width: 100%
  min-width: 636px
  > ul
    display: flex
    flex-wrap: wrap
    margin-left: -18px
    > li
      margin: 0 0 21px 19px
</style>
