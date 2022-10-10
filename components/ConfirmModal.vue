<template>
  <div class="confirm_modal_wrapper">
    <p class="modal_title tsukushi bold">{{ $t("confirm_delete_playlist") }}</p>
    <div class="content_wrapper">
      <p v-html="$t('delete_the_playlist')"></p>
      <p>・{{ playlist_name }}</p>
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
        @click="$emit('deletePlaylist', id)"
        >{{ $t('delete') }}</a>
    </div>
  </div>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  props: {
    id: {
      type: String,
      required: true,
    },
    playlist_name: {
      type: String,
      required: true,
    }
  }
});
</script>

<style lang="sass" scoped>
.confirm_modal_wrapper
  @include modal
  padding: 41px 70px 33px
  width: 70vw
  max-width: 980px
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
    padding: 28px 46px
    box-sizing: border-box
    background-color: rgba(255, 255, 255, .95)
    border-radius: 5px
    color: $DEEP_MAIN_COLOR
    > p
      margin: 0
      font-size: 18px
      line-height: 30px
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
