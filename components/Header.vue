<template>
  <header
    :class="[
      this.$route.path.split('/').pop().replace('/', '').replace('\.html', ''),
      is_sp_menu_on ? '' : 'close',
      this.$route.path.match(/\/\d+/) ? 'video' : '',
      checkIfTop($route.path),
    ]"
  >
    <span
      :class="['sp_toggle_menu', is_sp_menu_on ? '' : 'close']"
      @click="toggleMenu()"
    ></span>
    <div class="header_contents">
      <h1>
        <nuxt-link :to="localePath('/')">
          <img class="logo" src="~/assets/img/logo.svg" alt="togo tv" />
        </nuxt-link>
      </h1>
      <div class="right_area">
        <nav>
          <ul class="links">
            <li class="link home">
              <nuxt-link :to="localePath('/')">{{ $t("top") }}</nuxt-link>
            </li>
            <li class="link about">
              <nuxt-link :to="localePath('/welcome.html')">{{
                $t("about")
              }}</nuxt-link>
            </li>
            <li
              :class="[
                'link',
                'circlevideo',
                'has_child_nav',
                $store.state.sp_menu_toggle_state['search_videos']
                  ? 'open'
                  : '',
              ]"
              @click="toggleChildMenu('search_videos')"
            >
              <span
                :class="{
                  'nuxt-link-exact-active':
                    $route.path === '/courses.html' ||
                    $route.path === '/dbcls.html' ||
                    $route.path === '/newvideo.html' ||
                    $route.path === '/rankings.html' ||
                    $route.path === '/course.html' ||
                    $route.path === '/tag.html' ||
                    $route.path.match(/\/[\d]+\.html/),
                }"
                >{{ $t("search_videos") }}</span
              >
              <span class="arrow"></span>
              <ul
                :class="[
                  'child_nav',
                  $store.state.sp_menu_toggle_state['search_videos']
                    ? 'open'
                    : '',
                ]"
              >
                <li @click="$event.stopPropagation()" class="link course">
                  <nuxt-link
                    :class="{
                      'nuxt-link-exact-active': $route.path === '/course.html',
                    }"
                    :to="localePath('/courses.html')"
                  >
                    {{ $t("courses") }}
                  </nuxt-link>
                </li>
                <li @click="$event.stopPropagation()" class="link video">
                  <nuxt-link :to="localePath('/dbcls.html')">
                    DBCLS動画
                  </nuxt-link>
                </li>
                <li @click="$event.stopPropagation()" class="link new">
                  <nuxt-link :to="localePath('/newvideo.html')">{{
                    $t("new_videos")
                  }}</nuxt-link>
                </li>
                <li @click="$event.stopPropagation()" class="link barchart">
                  <nuxt-link :to="localePath('/rankings.html')">{{
                    $t("ranking")
                  }}</nuxt-link>
                </li>
              </ul>
            </li>
            <li
              :class="[
                'link',
                'picture',
                'has_child_nav',
                $store.state.sp_menu_toggle_state['search_pictures']
                  ? 'open'
                  : '',
              ]"
              @click="toggleChildMenu('search_pictures')"
            >
              <span
                :class="{
                  'nuxt-link-exact-active':
                    $route.path === '/pics.html' ||
                    $route.path.includes('/togopic'),
                }"
                >{{ $t("search_pictures") }}</span
              >
              <span class="arrow"></span>
              <ul
                :class="[
                  'child_nav',
                  $store.state.sp_menu_toggle_state['search_pictures']
                    ? 'open'
                    : '',
                ]"
              >
                <li @click="$event.stopPropagation()" class="link img">
                  <nuxt-link :to="localePath('/pics.html')">
                    全ての画像
                  </nuxt-link>
                </li>
                <!-- Heritage Trees: イラスト製作中のため一時的に非表示
                <li @click="$event.stopPropagation()" class="link img">
                  <nuxt-link :to="localePath('/heritage-trees.html')">
                    Heritage Trees
                  </nuxt-link>
                </li>
                -->
              </ul>
            </li>
            <li class="link ajacs">
              <nuxt-link
                :class="{
                  'nuxt-link-exact-active': $route.path.includes('/ajacs'),
                }"
                :to="localePath('/ajacs_text.html?page=1')"
              >
                {{ $t("search_ajacs_text") }}
              </nuxt-link>
            </li>
            <li
              :class="[
                'link',
                'contact',
                'has_child_nav',
                $store.state.sp_menu_toggle_state['contact'] ? 'open' : '',
              ]"
              @click="toggleChildMenu('contact')"
            >
              <span
                :class="{
                  'nuxt-link-exact-active':
                    $route.path === '/faq.html' ||
                    $route.path === '/request.html' ||
                    $route.path === '/staff.html',
                }"
                >{{ $t("contact") }}</span
              >
              <span class="arrow"></span>
              <ul
                :class="[
                  'child_nav',
                  'contact',
                  $store.state.sp_menu_toggle_state['contact'] ? 'open' : '',
                ]"
              >
                <li @click="$event.stopPropagation()" class="link question">
                  <nuxt-link :to="localePath('/faq.html')">{{
                    $t("faq")
                  }}</nuxt-link>
                </li>
                <li @click="$event.stopPropagation()" class="link video">
                  <nuxt-link :to="localePath('/request.html')">{{
                    $t("request")
                  }}</nuxt-link>
                </li>
                <li @click="$event.stopPropagation()" class="link people">
                  <nuxt-link :to="localePath('/staff.html')">{{
                    $t("staff")
                  }}</nuxt-link>
                </li>
              </ul>
            </li>
            <li class="link mypage">
              <a
                v-if="!$auth.loggedIn"
                @click="login()"
                >{{ $t("mypage") }}</a
              >
              <nuxt-link v-else :to="localePath('/mypage.html')">
                <img class="user_icon" :src="$auth.user.picture" />
                {{ $t("mypage") }}
              </nuxt-link>
              <RequestAgreementModal
                v-if="is_agree_modal_on"
                @closeModal="is_agree_modal_on = false" 
              />
            </li>
            <!--
            <li class="list_text_search">
              <TextSearch props="header" />
            </li>
            -->
          </ul>
        </nav>
      </div>
    </div>
    <div v-if="is_agree_modal_on" @click="is_agree_modal_on = false" class="modal_back"></div>
  </header>
</template>

<script>
import TextSearch from "~/components/TextSearch.vue";
import RequestAgreementModal from "~/components/RequestAgreementModal.vue";
import Vue from "vue";
export default Vue.extend({
  props: {
    data: "",
  },
  watch: {
    $route: function (to, from) {
      this.is_sp_menu_on = false;
      this.$emit("toggleMenu", false);
    },
  },
  data() {
    return {
      is_childnav_on: {
        video: false,
        contact: false,
      },
      is_sp_menu_on: false,
      is_agree_modal_on: false,
    };
  },
  components: {
    TextSearch,
    RequestAgreementModal,
  },
  methods: {
    checkIfTop(path) {
      if (path === "/" || path.indexOf("index.html") !== -1) {
        return "index";
      }
    },
    toggleChildMenu(type) {
      if (document.body.clientWidth < 896) {
        // this.has_child_nav_elements[type] = !this.has_child_nav_elements[type]
        this.$store.commit("toggleSPMenu", type);
      }
    },
    toggleMenu() {
      this.is_sp_menu_on = !this.is_sp_menu_on;
      if (document.body.clientWidth < 896) {
        this.$emit("toggleMenu", this.is_sp_menu_on);
      }
    },
    login() {
      // クッキーの確認
      if (process.client && localStorage.getItem("isAgreed") === 'true') {
        this.$auth.loginWith('google')
      } else {
        // モーダル表示
        this.is_agree_modal_on = true
      }
    }
  },
});
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
          padding-left: 20px
          .input_wrapper
            display: none
          li.link
            display: flex
            align-items: center
            margin-right: 12px
            &:hover
              cursor: pointer
            .nuxt-link-exact-active,
            .mypage .nuxt-link-active
              @include active_underline
              background-position: 10px 50px
              padding: 0 0 10px 25px
              margin-bottom: -10px
              margin-left: -25px
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
                > li
                  .nuxt-link-exact-active
                    background-position: 10px 29px
                    background-size: 100% 72%
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
              z-index: $LAYER_1
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
            &.mypage
              &:before
                display: none
              > a
                display: flex
                align-items: center
                padding-left: 0px
                margin-left: 0px
                > img.user_icon
                  width: 20px
                  height: 20px
                  border-radius: 20px
                  object-fit: cover
  &.index
    box-shadow: none
    > .header_contents
      > h1
        > a
          > img.logo
            visibility: hidden
  &.courses,
  &.course,
  &.newvideo,
  &.rankings,
  &.video,
  &.result,
  &.tag,
  > .header_contents
    > .right_area
      > nav
        > ul.links
          .input_wrapper
            display: block
  > .modal_back
    @include modal_back
@media screen and (max-width: 896px)
  header
    height: 60px
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
            height: calc(100vh - 194px)
            padding-bottom: 40px
            overflow: auto
            box-sizing: border-box
            display: block
            > li.link
              padding-left: 24px
              width: 100vw
              background: #ffffff
              z-index: 1
              > a.active
                @include active_underline()
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
                      @include active_underline()
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
