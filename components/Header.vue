<template>
  <header :class="checkIfTop()">
    <div class="header_contents">
      <h1>
        <nuxt-link to="/">
          <img class="logo" src="~/assets/img/logo.svg" alt="togo tv">
        </nuxt-link>
      </h1>
      <div class="right_area">
        <nav>
          <ul class="links">
            <li class="link about"><nuxt-link to="welcome">TogoTVについて</nuxt-link></li>
            <li class="link circlevideo has_child_nav">動画を探す<span class="arrow"></span>
              <ul class="child_nav">
                <li class="link course"><nuxt-link to="courses">スキル別コース</nuxt-link></li>
                <li class="link new"><nuxt-link to="newvideo">新着動画</nuxt-link></li>
                <li class="link barchart"><nuxt-link to="realtime">リアルタイム視聴ランキング</nuxt-link></li>
              </ul>
            </li>
            <li class="link picture"><nuxt-link to="pictures">画像を探す</nuxt-link></li>
            <li class="link contact has_child_nav">お問合せ<span class="arrow"></span>
              <ul class="child_nav contact">
                <li class="link question"><nuxt-link to="faq">よくある質問</nuxt-link></li>
                <li class="link video"><nuxt-link to="request">番組リクエスト</nuxt-link></li>
                <li class="link people"><nuxt-link to="staff">スタッフ</nuxt-link></li>
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
  data () {
    return {
      is_childnav_on: {
        video: false,
        contact: false
      }
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
  > .header_contents
    display: flex
    justify-content: space-between
    align-items: center
    white-space: nowrap
    padding: 0 28px
    // padding: 0 $VIEW_PADDING
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
          width: 830px
          display: flex
          align-items: center
          justify-content: space-between
          // margin-right: 27px
          padding-left: 20px
          li.link
            display: flex
            align-items: center
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
            &.about
              &:before
                @include icon('info')
            &.circlevideo
              &:before
                @include icon('circlevideo')
            &.picture
              &:before
                @include icon('img')
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
      min-width: 1108px
      > h1
        > a
          > img.logo
            visibility: hidden
      > .right_area
        > nav
          > ul.links
            width: 547px
            .input_wrapper
              display: none
</style>
