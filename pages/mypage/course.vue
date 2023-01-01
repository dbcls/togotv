<template>
  <div class="courses_wrapper" v-if="course.playlist.length > 0">
    <div class="upper">
      <h2 class="page_title tsukushi bold">
        <span class="course_title">{{ course.info.snippet.title }}</span>
      </h2>
      <PlaylistController
        :playlist="course"
        :privacy_status_by_playlist="{[course.info.id]: course.info.status.privacyStatus}"
        @setFetchStatus="setFetchStatus"
        @setPlaylist="setPlaylist"
        @callbackAfterDelete="$router.push('/mypage.html')"
      />
    </div>
    <div class="content_wrapper" :class="{ loading: is_updating }">
      <p>{{ course.info.snippet.description }}</p>
      <section class="video_section">
        <ul>
          <li v-for="video in course.playlist" :key="video.id">
            <SingleVideoCard
              :props="{
                id: video.videoid,
                thumbnail: video.thumbnail,
                title: video.title,
                description: video.description,
                duration: video.duration,
                courseId: course.id,
                uploadDate: video.uploadDate,
              }"
            />
          </li>
        </ul>
      </section>
    </div>
    <div v-if="is_updating" class="loader">Loading...</div>
  </div>
</template>

<script>
import Vue from "vue";
import SingleVideoCard from "~/components/SingleVideoCard.vue";
import PlaylistController from "~/components/PlaylistController.vue";
import { fetchMyList, fetchPlayListItems } from "~/assets/js/youtube.js";

export default Vue.extend({
  head() {
    return {
      title: this.course.title,
    };
  },
  components: {
    SingleVideoCard,
    PlaylistController
  },
  async created() {
    if (!this.$auth.loggedIn) this.$auth.loginWith("google");
    const access_token =
      this.$auth.strategies.google.token.$storage._state["_token.google"];
    const course = await fetchMyList(access_token, this.$route.query.id);
    this.course.info = course ?? course[0];
    const playlist = await fetchPlayListItems(access_token, {
      part: "id,snippet,contentDetails,status",
      playlistId: this.$route.query.id,
      maxResults: 50,
    });

    for (let item of playlist) {
      const res = await fetch(
        `https://togotv-api.dbcls.jp/api/date/${item.contentDetails.videoId}`
      );
      const { uploadDate } = await res.json();

      this.course.playlist.push({
        id: item?.id,
        youtubeVideoId: item?.contentDetails?.videoId,
        thumbnail: item?.snippet?.thumbnails?.high?.url,
        title: item?.snippet?.title,
        description: item?.snippet?.description,
        duration: 0,
        courseId: item?.id,
        uploadDate,
      });
    }
  },
  data() {
    return {
      base_url: "https://www.googleapis.com/youtube/v3/",
      course: {
        info: {},
        playlist: [],
      },
      is_popup_on: false,
      is_updating: false
    };
  },
  methods: {
    setFetchStatus(status) {
      this.is_updating = status
    },
    setPlaylist(playlist) {
      this.course.info.snippet.title = playlist.data.snippet.title
      this.course.info.snippet.description = playlist.data.snippet.description
    }
  }
});
</script>

<style lang="sass">
.courses_wrapper
  position: relative
  > .upper
    display: flex
    align-items: center
    margin-top: 36px
    > .page_title
      @include page_title('course')
      padding-left: $VIEW_PADDING
      margin: 0 10px 0 -10px
  > .content_wrapper
    padding: 0 $VIEW_PADDING
    &.loading
      opacity: .3
      pointer-events: none
    > .video_section
      > ul
        margin-left: -10px
        display: flex
        flex-wrap: wrap
        > li
          margin-left: 10px
          margin-bottom: 28px
  > .loader
    @include loader
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
@media screen and (max-width: 896px)
  .courses_wrapper
    > .upper
      flex-wrap: wrap
      padding-left: $VIEW_PADDING_SP
      > .page_title
        padding-left:  0
        margin-bottom: 10px
        align-items: flex-start
        position: relative
        > .course_title
          margin-top: 9px
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
