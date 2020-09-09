<template>
  <div class="request_wrapper">
    <h2 class="page_title tsukushi bold">{{ $t('request') }}</h2>
    <p class="description" v-html="$t('request_description')"></p>
    <iframe src="https://docs.google.com/forms/d/15pxJHnsV_Cu8B55Xy0F3jg5S9FXupkbBqONrZsyUE7k/viewform?embedded=true" width="740" height="805" frameborder="0" marginheight="0" marginwidth="0"></iframe>
  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  head() {
    return {
      title: $t('request')
    }
  }
})
</script>

<style lang="sass" scoped>
.request_wrapper
  padding: 0 $VIEW_PADDING
  > .page_title
    @include page_title('video')
    margin-bottom: 0
  > .description
    font-size: 16px
    line-height: 25px
    padding-left: 5px
  > iframe
    margin-left: -30px

@media screen and (max-width: 896px)
  .request_wrapper
    padding: 0 $VIEW_PADDING_SP
    > iframe
      margin: 0
      width: 100%
</style>
