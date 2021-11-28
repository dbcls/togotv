<template>
  <div class="video_list_wrapper">
    <ul>
      <li v-for="video in video_info_array" :key="video.embedUrl">
        <SingleVideoCard
          :props="{
            id: video.embedUrl,
            thumbnail: video.thumbnailUrl,
            title: video.name,
            description: video.description,
            uploadDate: video.uploadDate,
            duration: video['duration(ISO 8601)'] ? video['duration(ISO 8601)'] : video.duration,
            has_aside: has_aside,
          }"
        />
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
    },
    has_aside: {
      required: false
    }
  },
  components: {
    SingleVideoCard
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
    margin-left: -10px
    > li
      margin: 0 0 21px 10px

@media screen and (max-width: 896px)
  .video_list_wrapper
    min-width: auto
</style>
