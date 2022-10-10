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
            <div
              class="controller edit"
              @click="setPlaylistDataToEdit(list.info.id, list.info.snippet.title, list.info.snippet.description)"
            >編集</div>
            <div
              class="controller share"
              @click="sharePlaylist(list)"
            >共有</div>
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
    <EditPlaylist 
      v-if="is_edit_modal_on"
      :playlist="playlist_to_edit"
      @cancel="is_edit_modal_on = false"
      @updatePlaylistData="updatePlaylistData"
    />
    <ShareCourceModal
      v-if="is_share_modal_on"
      :course="playlist_to_share"
    />
    <div
      v-if="is_delete_modal_on || is_edit_modal_on || is_share_modal_on"
      @click="closeModal"
      class="modal_back"
    ></div>
  </div>
</template>

<script>
import Vue from "vue";
import VideoListHorizontalScroll from "~/components/VideoListHorizontalScroll.vue";
import ConfirmModal from "~/components/ConfirmModal.vue";
import EditPlaylist from "~/components/EditPlaylist.vue";
import ShareCourceModal from "~/components/ShareCourceModal.vue";
import { fetchMyLists, updatePrvacyStatus, deletePlaylist, updatePlaylistData } from "~/assets/js/youtube.js";

const PRIVACY_STATUS = {
  PUBLIC: 'public',
  UNLISTED: 'unlisted',
  PRIVATE: 'private'
}

export default Vue.extend({
  components: {
    VideoListHorizontalScroll,
    ConfirmModal,
    EditPlaylist,
    ShareCourceModal
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
      },
      is_edit_modal_on: false,
      playlist_to_edit: {
        id: '',
        name: '',
        description: ''
      },
      is_share_modal_on: false,
      playlist_to_share: null
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
      this.is_fetching_mylist = false;
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
    setPlaylistDataToDelete(id, name) {
      this.playlist_to_delete.id = id;
      this.playlist_to_delete.name = name;
      this.is_delete_modal_on = true
    },
    deletePlaylist(id) {
      this.is_delete_modal_on = false
      this.is_fetching_mylist = true
      deletePlaylist(this.access_token, id, this.fetchPlayList)
    },
    setPlaylistDataToEdit(id, name, description) {
      this.playlist_to_edit.id = id;
      this.playlist_to_edit.name = name;
      this.playlist_to_edit.description = description;
      this.is_edit_modal_on = true
    },
    updatePlaylistData() {
      this.is_edit_modal_on = false
      this.is_fetching_mylist = true
      updatePlaylistData(this.access_token, this.playlist_to_edit, (res) => {
        this.playlists = this.playlists.map(playlist => {
          if(playlist.info.id === res.data.id) {
            playlist.info.snippet.title = res.data.snippet.title
            playlist.info.snippet.description = res.data.snippet.description
          }
          return playlist
        })
        this.is_fetching_mylist = false;
      })
    },
    closeModal() {
      this.is_delete_modal_on = false
      this.is_edit_modal_on = false
      this.is_share_modal_on = false
    },
    sharePlaylist(course) {
      this.playlist_to_share = course
      this.is_share_modal_on = true
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
</style>
