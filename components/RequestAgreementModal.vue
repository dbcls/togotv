<template>
  <div class="request_agreement_modal_wrapper">
    <p class="modal_title tsukushi bold">{{ $t("request_agreement_modal_title") }}</p>
    <div class="content_wrapper">
      <p v-html="$t('request_agreement_modal_text')"></p>
    </div>
    <div class="btn_wrapper">
      <a
        class="button"
        @click="agree()"
        >{{ $t('agree') }}</a
      >
      <a
        class="button"
        @click="$emit('closeModal')"
        >{{ $t('disagree') }}</a
      >
    </div>
  </div>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  methods: {
    agree() {
      localStorage.setItem('isAgreed', true)
      this.$emit('closeModal')
      this.$auth.loginWith('google')
    }
  },
});
</script>

<style lang="sass" scoped>
.request_agreement_modal_wrapper
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
    align-items: flex-start
    white-space: break-spaces
    text-indent: -12px
    line-height: 1.3
    &:before
      width: 48px
      min-width: 48px
      height: 48px
      @include icon('caution')
      background-position: top center
  > .content_wrapper
    width: 100%
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
      font-weight: normal
      white-space: break-spaces
  > .btn_wrapper
    display: flex
    justify-content: center
    align-items: center
    flex-wrap: wrap
    margin-top: 15px
    > a.button
      @include download_btn
      margin-right: 10px
      margin-top: 8px
      font-size: 16px
      line-height: 1
      &:last-of-type
        margin-right: 0px
      > span
        font-weight: 400
        margin-left: 3px

@media screen and (max-width: 600px)
  .request_agreement_modal_wrapper
    padding: 20px
    width: 92vw
    border-radius: 20px
    > .modal_title
      font-size: 18px
      &:before
        width: 24px
        min-width: 24px
        margin-right: 6px
    > .content_wrapper
      padding: 10px 20px
      > p
        font-size: 14px
        line-height: 22px
    > .btn_wrapper
      margin-top: 6px
      > a.button
        padding: 2px 16px
        line-height: 2
</style>
