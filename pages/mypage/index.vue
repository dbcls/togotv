<template>
  <div class="mypage_wrapper" v-if="$auth.loggedIn">
    <div class="upper">
      <h2 class="page_title tsukushi bold">
        <img class="user_icon" :src="$auth.user.picture" />
        <template v-if="$i18n.locale === 'ja'">{{
          `${$auth.user.name}さんの作成した再生リスト`
        }}</template>
        <template v-if="$i18n.locale === 'en'">{{
          `Playlist created by ${$auth.user.name}`
        }}</template>
      </h2>
      <button class="logout" @click="$auth.logout('google')">
        {{ $t("logout") }}
      </button>
    </div>
    <section class="video_section">
      <div v-if="is_fetching_mylist" class="loader">Loading...</div>
      <p
        v-else-if="!this.playlists || this.playlists.length === 0"
        class="no_result"
      >
        {{ $t("no_result") }}
      </p>
      <ul v-show="!is_fetching_mylist && this.playlists">
        <li v-for="list in playlists" :key="list.info.id">
          <h3 class="course_name">
            <a @click="$router.push(`/mypage/course?id=${list.info.id}`)">
              {{ list.info.snippet.title }}
            </a>
            <PlaylistController
              class="playlist_controller"
              :playlist="list"
              :privacy_status_by_playlist="privacy_status_by_playlist"
              @setFetchStatus="setFetchStatus"
              @setPlaylist="setPlaylist"
              @callbackAfterDelete="fetchPlayList"
            />
          </h3>
          <VideoListHorizontalScroll
            :props="{
              id: `video_${list.info.id}`,
              playList: list.items,
              bg: 'white',
              courseId: list.info.id,
            }"
          />
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import Vue from "vue";
import VideoListHorizontalScroll from "~/components/VideoListHorizontalScroll.vue";
import PlaylistController from "~/components/PlaylistController.vue";
import { fetchMyLists } from "~/assets/js/youtube.js";

export default Vue.extend({
  components: {
    VideoListHorizontalScroll,
    PlaylistController
  },
  middleware: "auth",
  async created() {
    this.fetchPlayList()
  },
  data() {
    return {
      playlists: [],
      is_fetching_mylist: false,
      privacy_status_by_playlist: {}
    };
  },
  head() {
    return {
      title: this.$t("mypage"),
    };
  },
  computed: {
    access_token() {
      if (!process.client || !this.$auth.loggedIn) return null;
      return this.$auth.strategies.google.token.$storage._state[
        "_token.google"
      ];
    }
  },
  methods: {
    async fetchPlayList() {
      this.is_fetching_mylist = true;
      this.playlists = await fetchMyLists(this.access_token).catch((err) => {
        console.error(err);
      });
      this.playlists?.forEach(playlist => this.privacy_status_by_playlist[playlist.info.id] = playlist.info.status.privacyStatus)
      this.is_fetching_mylist = false;
    },
    formatDate(time) {
      const uploadDate = new Date(time);
      const year = uploadDate.getFullYear();
      const month = uploadDate.getMonth() + 1;
      const date = uploadDate.getDate();
      return `${year}-${("0" + month).slice(-2)}-${("0" + date).slice(-2)}`;
    },
    setFetchStatus(status) {
      this.is_fetching_mylist = status
    },
    setPlaylist(playlist) {
      this.playlists = this.playlists.map(list => {
        if(list.info.id === playlist.data.id) {
          list.info.snippet.title = playlist.data.snippet.title
          list.info.snippet.description = playlist.data.snippet.description
        }
        return list
      })
    }
  },
});
</script>

<style lang="sass" scoped>
.mypage_wrapper
  > .upper
    display: flex
    align-items: center
    justify-content: space-between
    padding-right: $VIEW_PADDING
    > .page_title
      @include page_title('course')
      padding-left: $VIEW_PADDING
      margin-left: -10px
      &:before
        display: none
      > .user_icon
        width: 40px
        height: 40px
        border-radius: 20px
        object-fit: cover
        margin-right: 4px
    > button.logout
      @include download_btn
      background-color: $MAIN_COLOR
  > .video_section
    > .loader
      @include loader
    > .no_result
      padding: 0 $VIEW_PADDING
    > ul
      > li
        margin-top: 32px
        &:first-of-type
          margin-top: 0
        > h3.course_name
          padding-left: $VIEW_PADDING
          position: relative
          display: flex
          align-items: center
          margin-bottom: 8px
          > a
            font-size: 18px
            display: flex
            align-items: center
            text-decoration: none
            color: $BLACK
            margin-right: 10px
            transition: .2s
            &:before
              min-width: 26px
              width: 26px
              height: 26px
              margin-right: 2px
              margin-top: -1px
              @include icon('course')
            &:hover
              color: $MAIN_COLOR
              cursor: pointer
  .modal_back
    @include modal_back
@media screen and (max-width: 896px)
  .mypage_wrapper
    > .upper
      padding-right: $VIEW_PADDING_SP
      > .page_title
        padding-left: $VIEW_PADDING_SP
    > .video_section
      > .no_result
        padding: 0 $VIEW_PADDING_SP
      > ul
        > li
          > h3.course_name
            padding-left: $VIEW_PADDING_SP
            margin: 4px 0
            flex-wrap: wrap
            > .playlist_controller
              margin: 10px 0
</style>
