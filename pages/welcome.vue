<template>
  <div class="welcome_wrapper">
    <section class="intro_section">
      <h2 class="tsukushi bold">
        <img src="~/assets/img/logo.png" class="logo" alt="togo tv">
        へようこそ！
      </h2>
      <div class="tutorial_video_wrapper">
        <iframe width="464.1" height="260" src="https://www.youtube.com/embed/M77W5zQdUFU" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        <img class="welcome_main" src="~/assets/img/welcome_main.png" alt="">
        <div class="tutorial_text">統合TVは、生命科学分野の有用なデータベース(DB)やウェブツールの動画マニュアルや講演・講義動画、イラスト、講習資料などを紹介するポータルサイトです。生命科学研究の規模拡大や多様化に伴って、データベースやウェブツールの利用方法も複雑化・専門化しています。いまや研究の効率的な進展にデータベースやウェブツールの利用は不可欠であり、その活用術は研究者として必要な素養のひとつとなっています。統合TVでは、研究者や技術者、それらを志す初学者が研究に役立つリソースに到達し、さらにそれらを使いこなすためのさまざまな情報を作成し、整理しています。</div>
      </div>
    </section>
    <section class="feature_section bg_blue">
      <h2 class="tsukushi bold">
        <img src="~/assets/img/logo.png" class="logo" alt="togo tv">
        の特徴
      </h2>
      <ul class="feature_list">
        <li class="feature">
          <img class="feature_img" src="~/assets/img/welcome_feature_1.png" alt="">
          <p class="feature_title tsukushi bold">無料で使えます</p>
          <p class="feature_description">動画・イラスト・講習資料は出典明記のみで自由に利用できます。</p>
        </li>
        <li class="feature">
          <img class="feature_img" src="~/assets/img/welcome_feature_2.png" alt="">
          <p class="feature_title tsukushi bold">初学者から研究者まで</p>
          <p class="feature_description">大学院生を主な想定利用者層とし、分野の違う研究者でも分かりやすいように。</p>
        </li>
        <li class="feature">
          <img class="feature_img" src="~/assets/img/welcome_feature_3.png" alt="">
          <p class="feature_title tsukushi bold">スキル別コース</p>
          <p class="feature_description">「この順で動画をみていくと、このスキルを習得できる」といった体系的な教育にも。</p>
        </li>
      </ul>
    </section>
    <section class="history_section">
      <h2 class="tsukushi bold">
        <img src="~/assets/img/logo.png" class="logo" alt="togo tv">
        の歴史
      </h2>
      <h3 class="tsukushi">YouTube版統合TVの月間番組再生数および再生時間の推移 (2007年〜2020年)</h3>
      <div class="playtime_transition_graph"></div>
      <h3 class="tsukushi">統合TV年表</h3>
      <div class="chronology_graph"></div>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  head() {
    return {
      title: 'アバウト'
    }
  },
  data () {
    return {
    }
  }
})
</script>

<style lang="sass" scoped>
h2
  font-size: 27px
  text-align: center
  > .logo
    width: 177px
.welcome_wrapper
  text-align: center
  .intro_section
    margin-top: 70px
    > h2
      position: relative
      display: inline-block
      margin: 0
      &:before,
      &:after
        content: ''
        width: 34px
        height: 2px
        background-color: $MAIN_COLOR
        position: absolute
        bottom: -8px
      &:before
        transform: rotate(45deg)
        left: -45px
      &:after
        transform: rotate(-45deg)
        right: -45px
    > .tutorial_video_wrapper
      position: relative
      > iframe
        position: absolute
        top: 61px
        left: 50%
        transform: translateX(-50%)
        border: 12px solid $SUB_COLOR
        border-radius: 3px
        z-index: $LAYER_1
      > .welcome_main
        width: 890px
        position: absolute
        top: 220px
        left: 50%
        transform: translateX(-50%)
      > .tutorial_text
        width: 890px
        font-size: 16px
        line-height: 27px
        text-align: left
        margin: 0 auto
        padding-top: 438px
  .feature_section
    margin-top: 70px
    padding-top: 41px
    padding-bottom: 60.7px
    > h2
      margin-bottom: 46px
    > .feature_list
      display: flex
      justify-content: center
      > .feature
        width: 277px
        margin-right: 31px
        &:last-of-type
          margin-right: 0
        > img.feature_img
          width: 205px
        > .feature_title
          font-size: 22px
          margin-bottom: 12px
        > .feature_description
          margin-top: 0
          font-size: 16px
          line-height: 28px
  .history_section
    padding-top: 76.3px
    > h2
      margin-top: 0
    > h3
      font-size: 22px
</style>
