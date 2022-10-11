<template>
  <div class="controllers">
    <div
      class="controller status"
      :class="[
        privacy_status_by_playlist[playlist.info.id],
        { loading: is_updating_privacy_settings }
      ]"
    >
      <select
        class="privacy_status_selector"
        v-model="privacy_status_by_playlist[playlist.info.id]"
        @change="updatePrvacyStatus($event, playlist.info.id, playlist.info.snippet.title)"
      >
        <option
          v-for="status in PRIVACY_STATUS"
          :key="status"
          :value="status"
          :selected="status === playlist.info.status.privacyStatus"
        >
          {{ $t(status) }}
        </option>
      </select>
    </div>
    <div
      class="controller trash"
      @click="setPlaylistDataToDelete(playlist.info.id, playlist.info.snippet.title)"
    >{{ $t('deletion') }}</div>
    <div
      class="controller edit"
      @click="setPlaylistDataToEdit(playlist.info.id, playlist.info.snippet.title, playlist.info.snippet.description)"
    >{{ $t('edit') }}</div>
    <div
      class="controller share"
      @click="sharePlaylist(playlist)"
    >{{ $t('share') }}</div>
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
import ConfirmModal from "~/components/ConfirmModal.vue";
import EditPlaylist from "~/components/EditPlaylist.vue";
import ShareCourceModal from "~/components/ShareCourceModal.vue";
import { updatePrvacyStatus, deletePlaylist, updatePlaylistData } from "~/assets/js/youtube.js";

const PRIVACY_STATUS = {
  PUBLIC: 'public',
  UNLISTED: 'unlisted',
  PRIVATE: 'private'
}

export default Vue.extend({
  components: {
    ConfirmModal,
    EditPlaylist,
    ShareCourceModal
  },
  props: {
    playlists: {
      type: Array,
      required: true,
    },
    playlist: {
      type: Object,
      required: true,
    },
    privacy_status_by_playlist: {
      type: Object,
      required: true,
    },
    is_fetching_mylist: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
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
  computed: {
    access_token() {
      if (!process.client || !this.$auth.loggedIn) return null;
      return this.$auth.strategies.google.token.$storage._state[
        "_token.google"
      ];
    }
  },
  methods: {
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
      this.$emit('setFetchStatus', true)
      deletePlaylist(this.access_token, id, () => this.$emit('callbackAfterDelete'))
    },
    setPlaylistDataToEdit(id, name, description) {
      this.playlist_to_edit.id = id;
      this.playlist_to_edit.name = name;
      this.playlist_to_edit.description = description;
      this.is_edit_modal_on = true
    },
    async updatePlaylistData() {
      this.is_edit_modal_on = false
      this.$emit('setFetchStatus', true)
      let new_playlist
      await updatePlaylistData(this.access_token, this.playlist_to_edit, res => new_playlist = res)
      this.$emit('setFetchStatus', false)
      this.$emit('setPlaylist', new_playlist)
    },
    sharePlaylist(course) {
      this.playlist_to_share = course
      this.is_share_modal_on = true
    },
    closeModal() {
      this.is_delete_modal_on = false
      this.is_edit_modal_on = false
      this.is_share_modal_on = false
    }
  },
});
</script>

<style lang="sass" scoped>
.controllers
  display: flex
  align-items: center
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
</style>
