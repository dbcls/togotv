<template>
  <div class="courses_wrapper" v-if="course.playlist.length > 0">
    <div class="upper">
      <h2 class="page_title tsukushi bold">
        <span class="course_title">{{ course.info.snippet.title }}</span>
      </h2>
      <button class="share" @click="is_popup_on = true">
        {{ $t("share") }}
      </button>
    </div>
    <div class="content_wrapper">
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
    <template v-if="is_popup_on">
      <ShareCourceModal :course="course" />
      <div
        @click="is_popup_on = false"
        class="modal_back"
      ></div>
    </template>
  </div>
</template>

<script>
import Vue from "vue";
import SingleVideoCard from "~/components/SingleVideoCard.vue";
import ShareCourceModal from "~/components/ShareCourceModal.vue";
import { fetchMyList, fetchPlayListItems } from "~/assets/js/youtube.js";

export default Vue.extend({
  async created() {
    if (!this.$auth.loggedIn) this.$auth.loginWith("google");
    const access_token =
      this.$auth.strategies.google.token.$storage._state["_token.google"];
    const course = await fetchMyList(access_token, this.$route.query.id);
    this.course.info = course[0];
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
    };
  },
  head() {
    return {
      title: this.course.title,
    };
  },
  components: {
    SingleVideoCard,
    ShareCourceModal
  }
});
</script>

<style lang="sass">
.courses_wrapper
  > .upper
    display: flex
    align-items: center
    justify-content: space-between
    padding-right: $VIEW_PADDING
    > .page_title
      @include page_title('course')
      padding-left: $VIEW_PADDING
      margin-left: -10px
    > button.share
      @include download_btn
      background-color: $MAIN_COLOR
  > .content_wrapper
    padding: 0 $VIEW_PADDING
    > .video_section
      > ul
        margin-left: -10px
        display: flex
        flex-wrap: wrap
        > li
          margin-left: 10px
          margin-bottom: 28px
  > .modal_back
    @include modal_back

@media screen and (max-width: 896px)
  .courses_wrapper
    > .page_title
      padding-left: $VIEW_PADDING_SP
      align-items: flex-start
      position: relative
      margin-bottom: 30px
      > .course_title
        margin-top: 9px
      > .total_time
        position: absolute
        bottom: -18px
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
