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
      <ul v-else>
        <li v-for="list in playlists" :key="list.info.id">
          <h3 class="course_name">
            <a @click="$router.push(`/mypage/course?id=${list.info.id}`)">
              {{ list.info.snippet.title }}
            </a>
            <div
              class="controller status"
              :class="[
                privacy_status_by_playlist[list.info.id],
                { loading: is_updating_privacy_settings }
              ]"
            >
              <select
                class="privacy_status_selector"
                v-model="privacy_status_by_playlist[list.info.id]"
                @change="updatePrvacyStatus($event, list.info.id, list.info.snippet.title)"
              >
                <option
                  v-for="status in PRIVACY_STATUS"
                  :key="status"
                  :value="status"
                  :selected="status === list.info.status.privacyStatus"
                >
                  {{ $t(status) }}
                </option>
              </select>
            </div>
            <div
              class="controller trash"
              @click="setPlaylistDataToDelete(list.info.id, list.info.snippet.title)"
            >削除</div>
            <div class="controller edit">編集</div>
            <div class="controller share">共有</div>
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
    <ConfirmModal 
      v-if="is_delete_modal_on"
      :id="playlist_to_delete.id"
      :playlist_name="playlist_to_delete.name"
      @cancel="is_delete_modal_on = false"
      @deletePlaylist="deletePlaylist"
    />
  </div>
</template>

<script>
import Vue from "vue";
import VideoListHorizontalScroll from "~/components/VideoListHorizontalScroll.vue";
import ConfirmModal from "~/components/ConfirmModal.vue";
import { fetchMyLists, updatePrvacyStatus, deletePlaylist } from "~/assets/js/youtube.js";

const PRIVACY_STATUS = {
  PUBLIC: 'public',
  UNLISTED: 'unlisted',
  PRIVATE: 'private'
}

export default Vue.extend({
  components: {
    VideoListHorizontalScroll,
    ConfirmModal
  },
  middleware: "auth",
  async created() {
    this.fetchPlayList()
  },
  data() {
    return {
      playlists: [],
      is_fetching_mylist: false,
      privacy_status_by_playlist: {},
      PRIVACY_STATUS,
      is_updating_privacy_settings: false,
      is_delete_modal_on: false,
      playlist_to_delete: {
        id: '',
        name: ''
      }
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
      this.playlists.forEach(playlist => this.privacy_status_by_playlist[playlist.info.id] = playlist.info.status.privacyStatus)
      this.is_fetching_mylist = await false;
    },
    formatDate(time) {
      const uploadDate = new Date(time);
      const year = uploadDate.getFullYear();
      const month = uploadDate.getMonth() + 1;
      const date = uploadDate.getDate();
      return `${year}-${("0" + month).slice(-2)}-${("0" + date).slice(-2)}`;
    },
    updatePrvacyStatus(e, id, title) {
      this.is_updating_privacy_settings = true
      updatePrvacyStatus(
        this.access_token,
        id,
        title,
        e.target.value,
        () => this.is_updating_privacy_settings = false
      )
    },
    setPlaylistDataToDelete(id, name,) {
      this.playlist_to_delete.id = id;
      this.playlist_to_delete.name = name;
      this.is_delete_modal_on = true
    },
    deletePlaylist(id) {
      this.is_delete_modal_on = false
      this.is_fetching_mylist = true
      deletePlaylist(this.access_token, id, this.fetchPlayList)
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
          z-index: $LAYER_2
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
          > .controller
            font-size: 14px
            margin-right: 10px
            transition: opacity .2s
            display: flex
            align-items: center
            position: relative
            &:hover
              cursor: pointer
              opacity: .8
            &:before
              width: 16px
              height: 16px
              margin-right: 2px
              margin-bottom: -2px
            &.trash:before
              @include icon('trash')
            &.edit:before
              @include icon('editor')
            &.share:before
              @include icon('share')
            &.status
              transition: opacity .3s
              &.loading
                opacity: .3
                pointer-events: none
              @include public-status
              > .privacy_status_selector
                border: none
                border-bottom: 1px solid $BLACK
                &:hover
                  cursor: pointer
                &:focus
                  outline: 0

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
</style>
