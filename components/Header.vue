<template>
  <header :class="[checkIfTop(), is_sp_menu_on ? '' : 'close']">
    <span :class="['sp_toggle_menu', is_sp_menu_on ? '' : 'close']" @click="toggleMenu()"></span>
    <div class="header_contents">
      <h1>
        <nuxt-link to="/">
          <img class="logo" src="~/assets/img/logo.svg" alt="togo tv">
        </nuxt-link>
      </h1>
      <div class="right_area">
        <nav>
          <ul class="links">
            <li class="link home"><nuxt-link :to="localePath('/')">{{ $t('top') }}</nuxt-link></li>
            <li class="link about"><nuxt-link :to="localePath('/welcome')">{{ $t('about') }}</nuxt-link></li>
            <li :class="['link', 'circlevideo', 'has_child_nav', $store.state.sp_menu_toggle_state['search_videos'] ? 'open' : '']" @click="toggleChildMenu('search_videos')">{{ $t('search_videos') }}<span class="arrow"></span>
              <ul :class="['child_nav', $store.state.sp_menu_toggle_state['search_videos'] ? 'open' : '']">
                <li @click="$event.stopPropagation()" class="link course"><nuxt-link :to="localePath('/courses')">{{ $t('courses') }}</nuxt-link></li>
                <li @click="$event.stopPropagation()" class="link new"><nuxt-link :to="localePath('/newvideo')">{{ $t('new_videos') }}</nuxt-link></li>
                <li @click="$event.stopPropagation()" class="link barchart"><nuxt-link :to="localePath('/rankings')">{{ $t('ranking') }}</nuxt-link></li>
              </ul>
            </li>
            <li class="link picture"><nuxt-link :to="localePath('/pics')">{{ $t('search_pictures') }}</nuxt-link></li>
            <li class="link ajacs"><nuxt-link :to="localePath({name: 'ajacs_text', query: {page: 1} })">{{ $t('search_ajacs_text') }}</nuxt-link></li>
            <li :class="['link', 'contact', 'has_child_nav', $store.state.sp_menu_toggle_state['contact'] ? 'open' : '']" @click="toggleChildMenu('contact')">{{ $t('contact') }}<span class="arrow"></span>
              <ul :class="['child_nav', 'contact', $store.state.sp_menu_toggle_state['contact'] ? 'open' : '']">
                <li @click="$event.stopPropagation()" class="link question"><nuxt-link :to="localePath('/faq')">{{ $t('faq') }}</nuxt-link></li>
                <li @click="$event.stopPropagation()" class="link video"><nuxt-link :to="localePath('/request')">{{ $t('request') }}</nuxt-link></li>
                <li @click="$event.stopPropagation()" class="link people"><nuxt-link :to="localePath('/staff')">{{ $t('staff') }}</nuxt-link></li>
              </ul>
            </li>
            <!-- <li class="link null"></li> -->
            <li class="list_text_search">
              <TextSearch props="header"/>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </header>
</template>

<script>
import TextSearch from '~/components/TextSearch.vue'
import Vue from 'vue'
export default Vue.extend({
  watch: {
    '$route': function(to, from) {
      this.is_sp_menu_on = false
      this.$emit('toggleMenu', false)
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
    toggleChildMenu(type) {
      if(document.body.clientWidth < 896) {
        // this.has_child_nav_elements[type] = !this.has_child_nav_elements[type]
        this.$store.commit("toggleSPMenu", type)
      }
    },
    checkIfTop() {
      return this.$nuxt.$route.fullPath === '/' ? 'top' : ''
    },
    toggleMenu() {
      this.is_sp_menu_on = !this.is_sp_menu_on
      if(document.body.clientWidth < 896) {
        this.$emit('toggleMenu', this.is_sp_menu_on)
      }
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
  top: 24px
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
    &.top
      > .header_contents
        > .right_area
          > nav
            > ul.links
              .input_wrapper
                display: block
    > .sp_toggle_menu
      background-image: none
      display: inline-block
      position: fixed
      top: 39px
      right: 17px
      z-index: $LAYER_HEADER
      width: 30px
      height: 30px
      &:before,
      &:after
        content: ''
        width: 30px
        height: 1px
        background-color: $BLACK
        position: absolute
        top: 16px
        left: 0px
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
        left: 0
        background: #ffffff
        height: 100vh
        width: 100vw
        > nav
          // height: calc(100vh - 114px)
          // padding-bottom: 70px
          // box-sizing: border-box
          // overflow: auto
          > ul.links
            padding-left: 0
            padding-top: 40px
            padding-bottom: 100px
            height: calc(100vh - 154px)
            overflow: auto
            box-sizing: border-box
            display: block
            > li.link
              padding-left: 24px
              width: 100vw
              background: #ffffff
              z-index: 1
              > a.nuxt-link-exact-active
                @include blue_underline()
                padding: 0
                background-position: center 8px
                background-size: 100% 43px
                background-repeat: no-repeat
            > li.link,
            > li.link > a
              font-size: 20px
              line-height: 66px
              font-family: fot-tsukuardgothic-std, sans-serif
              margin: 0
              box-sizing: border-box
              &.home
                display: flex
              // &.null
              //   height: 110px
              &.has_child_nav
                position: relative
                padding-bottom: 0
                transition: .3s
                // &:hover
                //   > ul.child_nav
                //     display: none
                &.open
                  padding-bottom: 120px
                > ul.child_nav
                  display: block
                  padding: 0 0 0 25px
                  position: absolute
                  background: none
                  box-shadow: none
                  top: 56px
                  left: 20px
                  line-height: 44px
                  z-index: -1
                  max-height: 0
                  transition: .3s
                  overflow: hidden
                  > li
                    > a.nuxt-link-exact-active
                      @include blue_underline()
                      padding: 0
                      background-position: center -6px
                      background-size: auto 43px
                      background-repeat: no-repeat
                  &.open
                    max-height: 200px
                &.contact
                  > ul.child_nav
                    left: 20px
                    right: auto
            > li.list_text_search
              position: fixed
              bottom: 0
              left: 50%
              transform: translateX(-50%)
              z-index: $LAYER_2
              width: 100vw
              height: 90px
              display: flex
              align-items: center
              justify-content: center
              background: rgba(255, 255, 255, .8)
    &.close
      > .header_contents
        > h1
          position: fixed
          top: 12px
          left: 21px
          > a
            > img.logo
              width: 135px
        > .right_area
          opacity: 0
          pointer-events: none
</style>
