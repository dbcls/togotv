<template>
  <div class="ht2_wrapper">

    <!-- メインコンテンツ: ホームビューと同じ左右レイアウト -->
    <div class="why_view">

      <!-- 左: クロスフェードスライドショー（Treeと同じ位置） -->
      <div class="why_image_panel">
        <div class="why_slideshow">
          <img
            v-for="(src, i) in slides"
            :key="i"
            :src="src"
            :class="['why_slide', { active: i === currentSlide }]"
            alt="Heritage Trees × TogoTV 制作レビュー記録"
          />
        </div>
        <div class="slide_dots">
          <span
            v-for="(_, i) in slides"
            :key="i"
            :class="['dot', { active: i === currentSlide }]"
            @click="goToSlide(i)"
          ></span>
        </div>
      </div>

      <!-- 右: スクロール可能な解説テキスト -->
      <div class="why_description_panel">
        <h2 class="tsukushi bold why_heading">Why Heritage Trees × TogoTV?</h2>
        <div class="why_body tsukushi">
          <p>TogoTVでは、植物学に関するコンテンツをさらに充実させるため、京都府立植物園との連携により、科学的視座に基づいた植物イラストの制作を進めています。</p>
          <p>植物を題材とした科学イラストは、美しさだけでなく、形態や特徴を正確に捉えることが求められるため、専門的な確認が欠かせません。そこでTogoTVでは、植物の専門家によるレビューを受けられる連携先を探していました。</p>
          <p>京都府立植物園のHeritage Treesには、日本の植物史において重要な樹木に加え、さまざまな研究と関わりのある樹木が含まれています。今回公開するイラストは、京都府立植物園の樹木医によるレビューを受けながら、イラストレーターとの綿密な議論を重ねて制作したものです。</p>
        </div>
        <nuxt-link :to="localePath('/heritage-trees.html')" class="back_link tsukushi">
          ← Heritage Trees トップへ
        </nuxt-link>
      </div>
    </div>

    <!-- 下部グラデーション -->
    <div class="bottom_gradient home"></div>

    <!-- サイトタイトル（左下・クリックでHeritage Treesホームへ） -->
    <div class="site_title is_home" @click="goBack">
      <p class="collab_label tsukushi">京都府立植物園 × Togo Picture Gallery</p>
      <h1 class="main_title mont bold">Heritage Trees<br>× TogoTV</h1>
    </div>

  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      slides: [
        require('~/assets/img/heritage-trees/rounghsketch.png'),
        require('~/assets/img/heritage-trees/rounghsketch3.png'),
        require('~/assets/img/heritage-trees/rounghsketch4.png'),
      ],
      currentSlide: 0,
      slideTimer: null,
    }
  },
  head() {
    return {
      title: 'Why Heritage Trees × TogoTV?',
      meta: [
        { hid: 'og:title', property: 'og:title', content: 'Why Heritage Trees × TogoTV? | TogoTV' },
        { hid: 'og:url', property: 'og:url', content: process.client ? location.href : '' },
      ],
    }
  },
  mounted() {
    // 6秒間隔でスライド切替（2秒クロスフェード込み）
    this.slideTimer = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.slides.length
    }, 6000)
  },
  beforeDestroy() {
    if (this.slideTimer) clearInterval(this.slideTimer)
  },
  methods: {
    goBack() {
      this.$router.push(this.localePath('/heritage-trees.html'))
    },
    goToSlide(i) {
      this.currentSlide = i
    },
  },
})
</script>

<style lang="sass">
// ─── Why ページ: 左右レイアウト ──────────────────────────
.why_view
  position: absolute
  inset: 0
  display: flex
  align-items: center
  z-index: 1

  > .why_image_panel
    flex: 0 0 50%
    height: 100%
    display: flex
    flex-direction: column
    align-items: center
    justify-content: center
    padding: 80px 20px 80px 60px
    box-sizing: border-box
    animation: ht2-fadein 1.1s cubic-bezier(0.22, 1, 0.36, 1) both
    gap: 20px

  > .why_description_panel
    flex: 0 0 50%
    height: 100%
    overflow-y: auto
    padding: 80px 60px 160px 32px
    box-sizing: border-box
    animation: ht2-fadein 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both
    scrollbar-width: thin
    scrollbar-color: rgba(26, 74, 46, 0.3) transparent
    &::-webkit-scrollbar
      width: 5px
    &::-webkit-scrollbar-thumb
      background: rgba(26, 74, 46, 0.3)
      border-radius: 3px
    > .why_heading
      font-size: 40px
      color: #1a4a2e
      margin: 0 0 32px 0
      line-height: 1.25
    > .why_body
      font-size: 22px
      line-height: 2.0
      color: #1a4a2e
      > p
        margin: 0 0 28px 0
        &:last-child
          margin-bottom: 40px
    > .back_link
      display: inline-block
      font-size: 18px
      color: rgba(26, 74, 46, 0.65)
      text-decoration: none
      border-bottom: 1px solid rgba(26, 74, 46, 0.3)
      padding-bottom: 2px
      transition: color 0.2s ease, border-color 0.2s ease
      &:hover
        color: #1a4a2e
        border-bottom-color: #1a4a2e

// ─── スライドショー ──────────────────────────────────────
.why_slideshow
  position: relative
  width: 100%
  height: 60vh

  > .why_slide
    position: absolute
    inset: 0
    width: 100%
    height: 100%
    object-fit: contain
    opacity: 0
    transition: opacity 2s ease
    filter: drop-shadow(0 8px 32px rgba(0, 0, 0, 0.18))
    &.active
      opacity: 1

// ─── スライドドット ──────────────────────────────────────
.slide_dots
  display: flex
  gap: 10px

  > .dot
    width: 8px
    height: 8px
    border-radius: 50%
    background: rgba(26, 74, 46, 0.25)
    cursor: pointer
    transition: background 0.3s ease, transform 0.3s ease
    &.active
      background: #1a4a2e
      transform: scale(1.3)
    &:hover:not(.active)
      background: rgba(26, 74, 46, 0.5)

// ─── レスポンシブ ─────────────────────────────────────────
@media screen and (max-width: 1024px)
  .why_view
    flex-direction: column
    overflow-y: auto
    align-items: stretch
    > .why_image_panel
      flex: 0 0 auto
      padding: 80px 24px 20px
      height: auto
    > .why_description_panel
      flex: 0 0 auto
      height: auto
      padding: 20px 24px 200px

  .why_slideshow
    height: 35vh
</style>
