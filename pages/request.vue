<template>
  <div class="request_wrapper">
    <h2 class="page_title tsukushi bold">番組リクエスト</h2>
    <p class="description">ライフサイエンス統合データベースセンター(DBCLS) が提供する「統合TV」にて紹介(あるいは内容のアップデート)したほうがよいと思われる有用なデータベースやウェブツールについて、自薦他薦問わず自由にリクエストするフォームです。<br>また、解説動画以外に、あると便利なイメージ画像もこちらからリクエストすることができます。ご記入いただいた内容は原則非公開です。<br>統合TVに欲しい情報やコンテンツがない場合には、統合TVを利用していただいたあなた自身によるフィードバックや寄与が可能です。<br>統合TVを使って役に立った、こんなところが良かった、などの利用者の声についても絶賛募集中です！<br>これらは、開発者の励みになるだけでなく、この活動を続けていくための(予算的な)原動力になります！</p>
    <iframe src="https://docs.google.com/forms/d/15pxJHnsV_Cu8B55Xy0F3jg5S9FXupkbBqONrZsyUE7k/viewform?embedded=true" width="740" height="805" frameborder="0" marginheight="0" marginwidth="0"></iframe>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  head() {
    return {
      title: '番組リクエスト'
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
</style>
