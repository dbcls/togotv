<template>
  <footer>
    <div class="logo_sitemap_wrapper">
      <img class="logo" src="~/assets/img/logo.png" alt="togo tv" />
      <div class="sitemap">
        <ul>
          <li>
            <nuxt-link to="/">{{ $t('top') }}</nuxt-link>
          </li>
          <li>
            <nuxt-link :to="localePath('/welcome.html')">{{ $t('about') }}</nuxt-link>
          </li>
          <li>
            {{ $t('search_videos') }}
            <ul class="child_nav">
              <li>
                <nuxt-link :to="localePath('/courses.html')">{{ $t('courses') }}</nuxt-link>
              </li>
              <li>
                <nuxt-link :to="localePath('/newvideo.html')">{{ $t('new_videos') }}</nuxt-link>
              </li>
              <li>
                <nuxt-link :to="localePath('/rankings.html')">{{ $t('ranking') }}</nuxt-link>
              </li>
            </ul>
          </li>
          <li>
            <nuxt-link :to="localePath('/pics.html')">{{ $t('search_pictures') }}</nuxt-link>
          </li>
          <li>
            {{ $t('contact') }}
            <ul class="child_nav">
              <li>
                <nuxt-link :to="localePath('/faq.html')">{{ $t('faq') }}</nuxt-link>
              </li>
              <li>
                <nuxt-link :to="localePath('/request.html')">{{ $t('request') }}</nuxt-link>
              </li>
              <li>
                <nuxt-link :to="localePath('/staff.html')">{{ $t('staff') }}</nuxt-link>
              </li>
            </ul>
          </li>
          <li>
            <ul class="lang_switch">
              <li>
                <a :class="$route.path.indexOf('/en') === -1 ? 'active' : ''" @click="switchLocalePath('ja')">日本語</a><span>/</span>
              </li>
              <li>
                <a :class="$route.path.indexOf('/en') !== -1 ? 'active' : ''" @click="switchLocalePath('en')">English</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
    <ul class="sns">
      <li>
        <a href="https://www.youtube.com/results?search_query=togotv" target="_blank">
          <img src="~/assets/img/icon/youtube.svg" alt="youtube">
        </a>
      </li>
      <li>
        <a href="https://twitter.com/togotv" target="_blank">
          <img src="~/assets/img/icon/twitter.svg" alt="twitter">
        </a>
      </li>
      <li>
        <a href="https://www.facebook.com/togotv" target="_blank">
          <img src="~/assets/img/icon/facebook.svg" alt="facebook">
        </a>
      </li>
    </ul>
  </footer>
</template>

<script>
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {}
  },
  methods: {
    switchLocalePath(lang) {
      if(lang === 'ja') {
        location.href = location.origin + location.pathname.replace('/en', '')
      } else if (lang === 'en') {
        location.href = location.origin + '/en' + location.pathname.replace('/en', '')
      }
    }
  }
})
</script>

<style lang="sass" scoped>
footer
  width: calc(100% - #{$VIEW_PADDING} * 2)
  margin: 0 auto
  padding: 31px 30px 23px
  border-top: 1px solid $BLACK
  margin-top: 62px
  > .logo_sitemap_wrapper
    display: flex
    flex-wrap: wrap
    justify-content: center
    align-items: center
    > img.logo
      width: 268.13px
    > .sitemap
      margin-left: 67.9px
      a
        color: $BLACK
        text-decoration: none
      > ul
        display: flex
        justify-content: space-between
        width: 682px
        > li
          font-size: 14px
          font-weight: bold
          > ul.child_nav
            margin-top: 13px
            > li
              font-size: 12px
              font-weight: normal
              line-height: 22px
              &:before
                content: '−'
                margin-right: 2px
          > ul.lang_switch
            display: flex
            align-items: center
            > li
              font-size: 12px
              font-weight: normal
              white-space: nowrap
              &:hover
                cursor: pointer
              > a.active
                color: $MAIN_COLOR
                font-weight: bold
                pointer-events: none
              > span
                margin: 0 5px
  > ul.sns
    display: flex
    justify-content: center
    margin-top: 23px
    > li
      > a
        > img
          width: 27px
          margin-right: 13px
      &:last-of-type
        > a
          > img
            margin-right: 0

@media screen and (max-width:1178px)
  footer
    > .logo_sitemap_wrapper
      > img.logo
        margin-top: 10px
        margin-bottom: 35px

@media screen and (max-width: 896px)
  footer
    width: calc(100% - #{$VIEW_PADDING_SP} * 2)
    padding: 19px 0px 23px
    > .logo_sitemap_wrapper
      flex-direction: column-reverse
      > img.logo
        margin-bottom: 18px
        margin-top: 30px
        width: 200px
      > .sitemap
        margin: 0
        width: 100%
        > ul
          width: auto
          flex-direction: column
          > li
            line-height: 30px
            > ul.child_nav
              margin-top: 0
    > ul.sns
      margin-top: 5px
</style>
