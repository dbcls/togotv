<template>
  <header :class="[checkIfTop(), is_sp_menu_on ? '' : 'close']">
    <span :class="['sp_toggle_menu', is_sp_menu_on ? '' : 'close']" @click="is_sp_menu_on = !is_sp_menu_on"></span>
    <div class="header_contents">
      <h1>
        <nuxt-link to="/">
          <img class="logo" src="~/assets/img/logo.svg" alt="togo tv">
        </nuxt-link>
      </h1>
      <div class="right_area">
        <nav>
          <ul class="links">
            <li class="link home"><nuxt-link to="/">トップ</nuxt-link></li>
            <li class="link about"><nuxt-link to="/welcome">TogoTVについて</nuxt-link></li>
            <li class="link circlevideo has_child_nav">動画を探す<span class="arrow"></span>
              <ul class="child_nav">
                <li class="link course"><nuxt-link to="/courses">スキル別コース</nuxt-link></li>
                <li class="link new"><nuxt-link to="/newvideo">新着動画</nuxt-link></li>
                <li class="link barchart"><nuxt-link to="/rankings">視聴ランキング</nuxt-link></li>
              </ul>
            </li>
            <li class="link picture"><nuxt-link to="/pics">画像を探す</nuxt-link></li>
            <li class="link ajacs"><nuxt-link :to="{name: 'ajacs_text', query: {page: 1} }">講習会資料を探す</nuxt-link></li>
            <li class="link contact has_child_nav">お問合せ<span class="arrow"></span>
              <ul class="child_nav contact">
                <li class="link question"><nuxt-link to="/faq">よくある質問</nuxt-link></li>
                <li class="link video"><nuxt-link to="/request">番組リクエスト</nuxt-link></li>
                <li class="link people"><nuxt-link to="/staff">スタッフ</nuxt-link></li>
              </ul>
            </li>
            <li>
              <TextSearch props="header"/>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import TextSearch from '~/components/TextSearch.vue'
import Vue from 'vue'
export default Vue.extend({
  watch: {
      '$route': function(to, from) {
        this.is_sp_menu_on = false
      }
  },
  data () {
    return {
      is_childnav_on: {
        video: false,
        contact: false
      },
      is_sp_menu_on: false
    }
  },
  components: {
    TextSearch
  },
  computed: {
  },
  methods: {
    checkIfTop() {
      return this.$nuxt.$route.name === 'index' ? 'top' : ''
    }

  }
})
</script>

<style lang="sass" scoped>
header
  width: 100%
  box-sizing: border-box
  box-shadow: 0 2px 4px rgba(0, 0, 0, .1)
  background-color: #fff
  position: fixed
  top: 0
  z-index: $LAYER_HEADER
  > .sp_toggle_menu
    display: none
  > .header_contents
    display: flex
    justify-content: space-between
    align-items: center
    white-space: nowrap
    padding: 0 28px
    > h1
      > a
        > img.logo
          width: 177px
          visibility: visible
    > .right_area
      display: flex
      align-items: center
      > nav
        font-size: 16px
        font-weight: 600
        > ul.links
          display: flex
          align-items: center
          justify-content: space-between
          // margin-right: 27px
          padding-left: 20px
          li.link
            display: flex
            align-items: center
            margin-right: 12px
            &.home
              display: none
            > a
              text-decoration: none
              color: $BLACK
            &.has_child_nav
              position: relative
              z-index: $LAYER_1
              > span.arrow
                width: 13px
                height: 13px
                margin-left: 2px
                @include icon('arrow')
              > ul.child_nav
                display: none
                padding: 0
                position: absolute
                top: 25px
                left: 0
                background-color: white
                box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.2)
                font-size: 16px
                padding: 12px 18px 10px 13px
                line-height: 32px
              &.contact
                > ul.child_nav
                  right: 0
                  left: auto
              &:hover
                > ul.child_nav
                  display: inline-block
            &:before
              content: ''
              display: inline-block
              width: 25px
              height: 25px
            &.home
              &:before
                @include icon('home')
            &.about
              &:before
                @include icon('info')
            &.circlevideo
              &:before
                @include icon('circlevideo')
            &.picture
              &:before
                @include icon('img')
            &.ajacs
              &:before
                @include icon('file')
            &.contact
              &:before
                @include icon('mail')
            &.course
              &:before
                @include icon('course')
            &.new
              &:before
                @include icon('new')
            &.barchart
              &:before
                @include icon('barchart')
            &.question
              &:before
                @include icon('question')
            &.video
              &:before
                @include icon('video')
            &.people
              &:before
                @include icon('people')

  &.top
    box-shadow: none
    > .header_contents
      > h1
        > a
          > img.logo
            visibility: hidden
      > .right_area
        > nav
          > ul.links
            .input_wrapper
              display: none

@media screen and (max-width: 896px)
  header
    height: 60px
    > .sp_toggle_menu
      background-image: none
      display: inline-block
      position: fixed
      top: 16px
      right: 17px
      z-index: $LAYER_HEADER
      &:before,
      &:after
        content: ''
        width: 30px
        height: 1px
        background-color: $BLACK
        position: absolute
        top: 16px
        left: -30px
      &.close
        width: 30px
        height: 30px
        display: inline-block
        background-image: url('../assets/img/icon/icon_humburger_menu.svg')
        background-repeat: no-repeat
        background-position: center center
        &:before,
        &:after
          height: 0
      &:before
        transform: rotate(45deg)
      &:after
        transform: rotate(-45deg)
    > .header_contents
      z-index: $LAYER_UNDER_HEADER
      transition: .3s
      width: 100vw
      > .right_area
        opacity: 1
        position: absolute
        align-items: flex-start
        top: 0
        right: 0
        background: #ffffff
        height: 100vh
        width: 100vw
        > nav
          > ul.links
            flex-direction: column
            align-items: baseline
            padding-left: 0
            padding-left: 24px
            padding-top: 70px
            > li.link,
            > li.link > a
              font-size: 20px
              line-height: 66px
              font-family: fot-tsukuardgothic-std, sans-serif
              &.home
                display: block
              &.has_child_nav
                position: relative
                padding-bottom: 121px
                > span.arrow
                  display: none
                > ul.child_nav
                  display: block
                  position: absolute
                  background: none
                  box-shadow: none
                  padding: 0
                  top: 56px
                  left: 20px
                  line-height: 44px
                &.contact
                  > ul.child_nav
                    left: 20px
                    right: auto
            .input_wrapper
              position: fixed
              top: 17px
    &.close
      > .header_contents
        > h1
          position: fixed
          top: -10px
          left: 21px
          > a
            > img.logo
              width: 135px
        > .right_area
          opacity: 0
          pointer-events: none
    &.top
      box-shadow: none
      > .header_contents
        > .right_area
          > nav
            > ul.links
              .input_wrapper
                display: block
</style>
