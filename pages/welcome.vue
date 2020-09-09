<template>
  <div class="welcome_wrapper">
    <section class="intro_section">
      <h2 class="tsukushi bold">
        <span v-if="$i18n.locale === 'en'" >{{ $t("welcome_to") }}</span>
        <img src="~/assets/img/logo.png" class="logo" alt="togo tv" />
        <span v-if="$i18n.locale === 'ja'" >{{ $t("welcome_to") }}</span>
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
        >{{ $t("about_description") }}</div>
      </div>
    </section>
    <section class="feature_section bg_blue">
      <h2 class="tsukushi bold">
        <span v-if="$i18n.locale === 'en'">{{ $t('of_feautre') }}</span>
        <img src="~/assets/img/logo.png" class="logo" alt="togo tv" />
        <span v-if="$i18n.locale === 'ja'">{{ $t('of_feautre') }}</span>
      </h2>
      <ul class="feature_list">
        <li class="feature">
          <img class="feature_img" src="~/assets/img/welcome_feature_1.png" alt />
          <div class="feature_description_wrapper">
            <p class="feature_title tsukushi bold">{{ $t("feature_1_title") }}</p>
            <p class="feature_description">{{ $t("feature_1_description") }}</p>
          </div>
        </li>
        <li class="feature">
          <img class="feature_img" src="~/assets/img/welcome_feature_2.png" alt />
          <div class="feature_description_wrapper">
            <p class="feature_title tsukushi bold">{{ $t("feature_2_title") }}</p>
            <p class="feature_description">{{ $t("feature_2_description") }}</p>
          </div>
        </li>
        <li class="feature">
          <img class="feature_img" src="~/assets/img/welcome_feature_3.png" alt />
          <div class="feature_description_wrapper">
            <p class="feature_title tsukushi bold">{{ $t("feature_3_title") }}</p>
            <p class="feature_description">{{ $t("feature_3_description") }}</p>
          </div>
        </li>
      </ul>
    </section>
    <section class="history_section">
      <h2 class="tsukushi bold">
        <span v-if="$i18n.locale === 'en'">{{ $t('of_history') }}</span>
        <img src="~/assets/img/logo.png" class="logo" alt="togo tv" />
        <span v-if="$i18n.locale === 'ja'">{{ $t('of_history') }}</span>
      </h2>
      <h3 class="tsukushi bold">{{ $t('play_number_transition') }}</h3>
      <div class="playtime_transition_graph">
        <img src="~/static/TogoTV_YouTube_stats.png" alt="">
      </div>
      <h3 class="tsukushi bold">{{ $t('chronological_table') }}</h3>
      <div class="chronology_graph">
        <table class="table-history">
          <tr v-for="(event, index) in $i18n.locale === 'ja' ? history : history_en" :key="index">
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
      history: [],
      history_en: []
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

      axios.get(`${location.origin}/${this.$router.history.base}/json/history_en.json`).then(data => {
        this.history_en = data.data.history
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
        margin-top: 30px
        > iframe
          width: 85vw
          height: 48vw
          position: relative
          top: auto
          left: auto
          transform: none
        > img
          &.welcome_main
            display: none
          &.welcome_main_sp
            display: block
            width: 85vw
            margin: 0 auto
            top: -4px
            left: 0
            transform: none
            position: relative
        > .tutorial_text
          padding-top: 10px
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
