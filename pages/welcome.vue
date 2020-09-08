<template>
  <div class="welcome_wrapper">
    <section class="intro_section">
      <h2 class="tsukushi bold">
        <img src="~/assets/img/logo.png" class="logo" alt="togo tv" />
        へようこそ！
      </h2>
      <div class="tutorial_video_wrapper">
        <iframe
          width="464.1"
          height="260"
          src="https://www.youtube.com/embed/M77W5zQdUFU"
          frameborder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
        <img class="welcome_main" src="~/assets/img/welcome_main.png" alt />
        <img class="welcome_main_sp" src="~/assets/img/welcome_main_sp.png" alt />
        <div
          class="tutorial_text"
        >統合TVは、生命科学分野の有用なデータベース(DB)やウェブツールの動画マニュアルや講演・講義動画、イラスト、講習資料などを紹介するポータルサイトです。生命科学研究の規模拡大や多様化に伴って、データベースやウェブツールの利用方法も複雑化・専門化しています。いまや研究の効率的な進展にデータベースやウェブツールの利用は不可欠であり、その活用術は研究者として必要な素養のひとつとなっています。統合TVでは、研究者や技術者、それらを志す初学者が研究に役立つリソースに到達し、さらにそれらを使いこなすためのさまざまな情報を作成し、整理しています。</div>
      </div>
    </section>
    <section class="feature_section bg_blue">
      <h2 class="tsukushi bold">
        <img src="~/assets/img/logo.png" class="logo" alt="togo tv" />
        の特徴
      </h2>
      <ul class="feature_list">
        <li class="feature">
          <img class="feature_img" src="~/assets/img/welcome_feature_1.png" alt />
          <div class="feature_description_wrapper">
            <p class="feature_title tsukushi bold">無料で使えます</p>
            <p class="feature_description">動画・イラスト・講習資料は出典明記のみで自由に利用できます。</p>
          </div>
        </li>
        <li class="feature">
          <img class="feature_img" src="~/assets/img/welcome_feature_2.png" alt />
          <div class="feature_description_wrapper">
            <p class="feature_title tsukushi bold">初学者から研究者まで</p>
            <p class="feature_description">大学院生を主な想定利用者層とし、分野の違う研究者でも分かりやすいように。</p>
          </div>
        </li>
        <li class="feature">
          <img class="feature_img" src="~/assets/img/welcome_feature_3.png" alt />
          <div class="feature_description_wrapper">
            <p class="feature_title tsukushi bold">スキル別コース</p>
            <p class="feature_description">「この順で動画をみていくと、このスキルを習得できる」といった体系的な教育にも。</p>
          </div>
        </li>
      </ul>
    </section>
    <section class="history_section">
      <h2 class="tsukushi bold">
        <img src="~/assets/img/logo.png" class="logo" alt="togo tv" />
        の歴史
      </h2>
      <h3 class="tsukushi bold">YouTube版統合TVの月間番組再生数および再生時間の推移 (2007年〜2020年)</h3>
      <div class="playtime_transition_graph">
        <img src="~/static/TogoTV_YouTube_stats.png" alt="">
      </div>
      <h3 class="tsukushi bold">統合TV年表</h3>
      <div class="chronology_graph">
        <table class="table-history">
          <tr v-for="(event, index) in history" :key="index">
            <td>
              <time class="history_year mont" v-html="displayHistoryYear(event.year, index)"></time>
            </td>
            <td class="history_node"></td>
            <td>
              <time class="history_month mont">{{ event.month }}</time>
            </td>
            <td>
              <p class="tsukushi" v-html="convertToHtmlLink(event.event)"></p>
            </td>
          </tr>
        </table>
      </div>
    </section>
  </div>
</template>

<script>
import Vue from "vue";
import axios from "axios"

export default Vue.extend({
  head() {
    return {
      title: "アバウト"
    };
  },
  data() {
    return {
      history: []
    };
  },
  mounted() {
    this.fetchHistory()
  },
  methods: {
    fetchHistory() {
      axios.get(`${location.origin}/${this.$router.history.base}/json/history.json`).then(data => {
        this.history = data.data.history
      })
    },
    displayHistoryYear(year, index) {
      if(this.history[index + 1] !== undefined &&  this.history[index + 1].year !== year) {
        return year
      } else if (index + 1 === this.history.length) {
        return year
      } else {
        return ''
      }
    },
    convertToHtmlLink(content) {

      return content.replace(/\[(.+)\]\((.+)\)/g, '<a href="$2" target="_blank">$1</a>')
      
    }
  }
});
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
        width: 463px
      > img
        max-width: 890px
        position: absolute
        top: 220px
        left: 50%
        transform: translateX(-50%)
        &.welcome_main_sp
          display: none
      > .tutorial_text
        max-width: 890px
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
        > .feature_description_wrapper
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
      margin-bottom: 26px
    > .playtime_transition_graph
      margin-bottom: 70px
      > img
        width: 100%
        max-width: 890px
    > .chronology_graph
      > table.table-history
        max-width: 890px
        margin: 0 auto
        text-align: left
        tr:nth-of-type(1)
          td
            padding-top: 0
        > th
          font-size: 10px
        > tr
          > td
            color: $BLACK
            vertical-align: top
            > time
              font-size: 16px
              color: $MAIN_COLOR
              font-weight: 600
              &.history_year
                margin-right: 3px
              &.history_month
                margin-left: 3px
            > p
              font-size: 17px
              margin: 0 0 15px 19px
            &.history_node
              position: relative
              &:after
                content: ''
                width: 9px
                height: 9px
                border-radius: 100px
                background-color: $POINT_COLOR
                border: 2px solid #fff
                display: inline-block
                z-index: $LAYER_1
                position: relative
              &:before
                content: ''
                display: inline-block
                width: 3px
                height: 107%
                background-color: $SUB_COLOR
                position: absolute
                left: 6px
                top: 2px

@media screen and (max-width: 896px)
  h2
    font-size: 19px
    > img.logo
      width: 155px
  .welcome_wrapper
    .intro_section
      margin: 0
      > .tutorial_video_wrapper
        > iframe
          width: 85vw
          height: 48vw
        > img
          &.welcome_main
            display: none
          &.welcome_main_sp
            display: block
            width: 95%
            top: 282px
        > .tutorial_text
          padding-top: 360px
          width: 90%
          font-size: 14px
    .feature_section
      > .feature_list
        flex-direction: column
        > .feature
          width: calc(100% - #{$VIEW_PADDING_SP} * 2)
          min-height: 130px
          display: flex
          align-items: flex-start
          margin: 0 auto
          &:last-of-type
            margin-right: auto
          > img.feature_img
            width:  100px
            margin-right: 10px
          > .feature_description_wrapper
            text-align: left
            margin-top: -6px
            > .feature_title
              font-size: 18px
              margin-bottom: 8px
            > .feature_description
              font-size: 14px
              line-height: 22px
    .history_section
      width: calc(100% - #{$VIEW_PADDING_SP} * 2)
      margin: 0 auto
</style>
