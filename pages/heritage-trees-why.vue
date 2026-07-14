<template>
  <div class="ht2_wrapper">

    <!-- メインコンテンツ: ホームビューと同じ左右レイアウト -->
    <div class="why_view">

      <!-- 左: クロスフェードスライドショー（Treeと同じ位置） -->
      <div class="why_image_panel">
        <div class="specimen_frame">
          <div class="why_slideshow">
            <img
              v-for="(src, i) in slides"
              :key="i"
              :src="src"
              :class="['why_slide', { active: i === currentSlide }]"
              alt="Heritage Trees × TogoTV 制作レビュー記録"
            />
          </div>
          <div class="specimen_label tsukushi">{{ captions[currentSlide] }}</div>
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
          <p>京都府立植物園のHeritage Treesには、日本の植物史において重要な樹木に加え、さまざまな研究と関わりのある樹木が含まれています。京都府立植物園の皆様とTogoTVスタッフとの議論の結果、植物学のイラストとして最も相応しくかつ、体系的にまとめられるプロジェクトとして、今回のHeritage Treesコラボレーションが決定しました。</p>
          <p>今回公開するイラストは、京都府立植物園の樹木医によるレビューを受けながら、イラストレーターとの綿密な議論を重ねて制作したものです。その一例として、左のスライドショーには京都府立植物園からご提供いただいた植物サンプルを撮影、実体顕微鏡による細部の確認、イラスト化、レビューの過程を記録した画像を掲載しています。</p>
          <p>AIによる画像生成が注目される昨今ですが、科学イラストの制作においては、このように実物を用いた書き起こしや、顕微鏡などの専門的な機材を用いた綿密な確認と、専門家によるレビューを受けながら正確な情報を反映させることが重要です。</p>
          <p>AIによるイラスト化は、いわゆる模式図やマッシュアップされた画像生成に優れる一方で、個体特徴表現に欠けるという問題があります。</p>
          <p>TogoTVでは、今後も科学的な視点を大切にしながら、植物学に関するコンテンツの充実を図ってまいります。</p>
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
        '/ht-review/slide-1.png',
        '/ht-review/slide-2.png',
        '/ht-review/slide-3.png',
      ],
      captions: [
        'No. 1 ハナミズキ（春）の制作過程',
        'No. 6 シナマンサク（春）の制作過程',
        'No. 14 トキワマンサク（春）の制作過程',
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
    // 10秒間隔でスライド切替（2秒クロスフェード込み）
    this.slideTimer = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.slides.length
    }, 12000)
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
// ─── heritage-trees.vue と共通の土台スタイル ─────────────
// ページ単位でCSSが分割されるため、ここにも複製が必要
.ht2_wrapper
  position: relative
  height: 100vh
  overflow: hidden

  &::before
    content: ''
    position: fixed
    inset: 0
    background-image: url('~@/assets/img/test_wall.jpg')
    background-size: cover
    background-position: center
    opacity: 0.1
    z-index: 0
    pointer-events: none

.bottom_gradient
  position: absolute
  bottom: 0
  left: 0
  right: 0
  height: 50%
  z-index: 2
  pointer-events: none
  transition: background 0.6s ease
  &.home
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.55))

.site_title
  position: absolute
  bottom: 39px
  left: 60px
  z-index: 3
  cursor: pointer
  transition: opacity 0.2s ease
  animation: ht2-fadein 1.4s cubic-bezier(0.22, 1, 0.36, 1) 0.4s both

  &:hover
    opacity: 0.8

  &.is_home
    > .main_title
      text-shadow: 2px 4px 24px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255,255,255,0.15)

  > .collab_label
    font-size: 13px
    color: rgba(255, 255, 255, 0.88)
    margin: 0 0 8px 0
    letter-spacing: 0.06em
    text-shadow: 0 1px 6px rgba(0, 0, 0, 0.55)

  > .main_title
    font-size: 71px
    line-height: 1.0
    color: #fff
    margin: 0
    letter-spacing: -0.02em
    text-shadow: 2px 4px 24px rgba(0, 0, 0, 0.55), 0 0 80px rgba(0, 0, 0, 0.25)

@keyframes ht2-fadein
  from
    opacity: 0
    transform: translateY(18px)
  to
    opacity: 1
    transform: translateY(0)

// ─── Why ページ: 左右レイアウト ──────────────────────────
.why_view
  position: absolute
  inset: 0
  display: flex
  align-items: stretch
  z-index: 1

  > .why_image_panel
    flex: 0 0 50%
    display: flex
    flex-direction: column
    align-items: center
    padding: 80px 20px 165px 60px
    box-sizing: border-box
    animation: ht2-fadein 1.1s cubic-bezier(0.22, 1, 0.36, 1) both
    gap: 16px

  > .why_description_panel
    flex: 0 0 50%
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
      font-size: 52px
      color: #1a4a2e
      margin: 0 0 40px 0
      line-height: 1.2
    > .why_body
      font-size: 20px
      line-height: 1.5
      color: #1a4a2e
      > p
        margin: 0 0 10px 0
        &:last-child
          margin-bottom: 48px
    > .back_link
      display: inline-block
      font-size: 23px
      color: rgba(26, 74, 46, 0.65)
      text-decoration: none
      border-bottom: 1px solid rgba(26, 74, 46, 0.3)
      padding-bottom: 2px
      transition: color 0.2s ease, border-color 0.2s ease
      &:hover
        color: #1a4a2e
        border-bottom-color: #1a4a2e

// ─── 図鑑ふうの標本枠 ────────────────────────────────────
.specimen_frame
  width: 100%
  flex: 1
  min-height: 0
  display: flex
  flex-direction: column
  background: #f4f9fc
  border: 1px solid #8aa9c4
  padding: 12px
  box-sizing: border-box
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12)

  > .specimen_label
    flex: 0 0 auto
    margin-top: 10px
    padding-top: 10px
    border-top: 1px solid #a8c4d8
    font-size: 18px
    color: #1a3a4a
    text-align: center
    letter-spacing: 0.02em

// ─── スライドショー ──────────────────────────────────────
.why_slideshow
  position: relative
  width: 100%
  flex: 1
  min-height: 0
  border: 1px solid #a8c4d8
  background: #e8f0f5
  overflow: hidden

  > .why_slide
    position: absolute
    inset: 0
    width: 100%
    height: 100%
    object-fit: contain
    object-position: center top
    opacity: 0
    transition: opacity 2s ease
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
    flex: none
    height: 40vh
</style>
