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
      <div class="popup">
        <p class="modal_title tsukushi bold">{{ $t("share") }}</p>
        <div class="content_wrapper">
          <span :class="['complete_copy', { show: is_complete_copy_on }]">{{
            $t("complete_copy")
          }}</span>
          <p class="share_link">
            {{ `https://www.youtube.com/playlist?list=${course.info.id}` }}
            <span class="copy" @click="copyLink">{{ $t("copy") }}</span>
          </p>
          <hr />
          <p class="title">
            TogoTVの利用者にこの有用な再生リストを共有しませんか?
          </p>
          <p class="description">
            TogoTVの<nuxt-link :to="localePath('/courses.html')"
              >スキル別コース</nuxt-link
            >にこの再生リストを追加しても良い場合は、以下のフォームからぜひお知らせください。
          </p>
          <form
            action="https://docs.google.com/forms/u/1/d/e/1FAIpQLScfzAgbNzdrC2GcW8YJDs4Uei68qtpieRwP5LiIARY9-6lITg/formResponse"
            method="post"
            target="hidden_iframe"
          >
            <label for="playlist_title">共有する再生リストの名称案</label>
            <input
              type="text"
              id="playlist_title"
              :value="course.info.snippet.title"
              name="entry.665981767"
              required
            />
            <label for="playlist_URL">共有する再生リストのURL</label>
            <input
              type="text"
              id="playlist_URL"
              :value="`https://www.youtube.com/playlist?list=${this.course.info.id}`"
              name="entry.1153596095"
              required
            />
            <label for="playlist_description">共有する再生リストの概要</label>
            <textarea
              rows="4"
              type="text"
              id="playlist_description"
              :value="course.info.snippet.description"
              name="entry.1804916998"
            >
            </textarea>
            <button type="submit" name="submit" class="share">{{ $t("share") }}</button>
          </form>
        </div>
      </div>
      <div @click="is_popup_on = false" class="modal_back"></div>
    </template>
  </div>
</template>

<script>
import Vue from "vue";
import SingleVideoCard from "~/components/SingleVideoCard.vue";
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
      is_complete_copy_on: false
    };
  },
  head() {
    return {
      title: this.course.title,
    };
  },
  components: {
    SingleVideoCard,
  },
  methods: {
    copyLink() {
      navigator?.clipboard.writeText(
        `https://www.youtube.com/playlist?list=${this.course.info.id}`
      );
      this.is_complete_copy_on = true;
      setTimeout(() => {
        this.is_complete_copy_on = false;
      }, 1000);
    },
  },
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
  > .popup
    @include modal
    padding: 30px 50px 33px
    width: 70vw
    min-width: 500px
    max-width: 980px
    background-color: $MAIN_COLOR
    border-radius: 20px
    > .modal_title
      font-size: 27px
      margin: 0 0 17px 0
      color: #ffffff
      display: flex
      justify-content: center
      align-items: center
      &:before
        width: 30px
        height: 30px
        @include icon('share')
    > .content_wrapper
      width: 100%
      max-height: 400px
      overflow: auto
      padding: 28px 46px
      box-sizing: border-box
      background-color: rgba(255, 255, 255, .9)
      border-radius: 5px
      > .complete_copy
        font-size: 12px
        display: block
        text-align: right
        margin-bottom: 6px
        visibility: hidden
        &.show
          visibility: visible
      > p.share_link
        font-size: 14px
        background-color: #ffffff
        border-radius: 20px
        white-space: nowrap
        overflow: hidden
        margin: 0
        padding: 8px 16px
        position: relative
        > .copy
          font-size: 12px
          padding: 10px 14px 10px 8px
          position: absolute
          background-color: $MAIN_COLOR
          color: #ffffff
          top: 0
          right: 0
          &:hover
            cursor: pointer
      > hr
        margin: 20px 0
      > .title
        font-size: 16px
        font-weight: bold
      > .description
        font-size: 14px
      > form
        > label, > input, > textarea
          display: block
          font-size: 14px
        > label
          margin-top: 20px
          margin-bottom: 2px
        > input, > textarea
          width: 100%
          border: none
          border-radius: 20px
          padding: 8px 16px
          box-sizing: border-box
        > button.share
          @include download_btn
          background-color: $MAIN_COLOR
          margin: 10px auto 0
          display: block
          &:before
            width: 12px
            height: 12px
            margin-right: 4px
            @include icon('share')
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
