<template>
  <div class="edit_playlist_modal_wrapper">
    <p class="modal_title tsukushi bold">{{ $t("edit_playlist") }}</p>
    <div class="content_wrapper">
      <label for="playlist_title">{{ $t("name") }}</label>
      <input
        type="text"
        id="playlist_title"
        v-model="playlist.name"
      />
      <label for="playlist_description">{{
        $t("description")
      }}</label>
      <textarea
        id="playlist_description"
        v-model="playlist.description"
        rows="4"
      ></textarea>
    </div>
    <div class="btn_wrapper">
      <a
        class="button mont bold"
        target="_blank"
        @click="$emit('cancel')"
        >{{ $t('cancel') }}</a
      >
      <a
        class="button mont bold"
        target="_blank"
        @click="$emit('updatePlaylistData')"
        >{{ $t('confirm') }}</a>
    </div>
  </div>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  props: {
    playlist: {
      type: Object,
      required: true,
    },
  }
});
</script>

<style lang="sass" scoped>
.edit_playlist_modal_wrapper
  @include modal
  padding: 41px 70px 33px
  width: 70vw
  max-width: 800px
  background-color: $MAIN_COLOR
  border-radius: 20px
  > .modal_title
    font-size: 27px
    margin: 0 0 17px 0
    color: #ffffff
    display: flex
    align-items: center
    &:before
      width: 48px
      height: 48px
      @include icon('caution')
  > .content_wrapper
    width: 100%
    min-height: 200px
    max-height: 400px
    overflow: auto
    padding: 30px
    box-sizing: border-box
    background-color: rgba(255, 255, 255, .95)
    border-radius: 5px
    color: $DEEP_MAIN_COLOR
    > label, input, textarea
      display: block
    > label
      font-size: 14px
      font-weight: bold
      margin-bottom: 6px
      margin-left: 4px
      &:not(:first-of-type)
        margin-top: 22px
    > input, textarea, select
      width: 100%
      border-radius: 14px
      border: none
      padding: 2px 8px
      box-sizing: border-box
  > .btn_wrapper
    display: flex
    justify-content: center
    align-items: center
    flex-wrap: wrap
    margin-top: 15px
    > a.button
      @include download_btn
      margin-right: 10px
      margin-top: 9px
      &:last-of-type
        margin-right: 0px
      > span
        font-weight: 400
        margin-left: 3px
</style>
