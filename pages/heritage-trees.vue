<template>
  <div class="ht2_wrapper">

    <!-- ホームビュー（メイン画像＋解説） -->
    <transition name="ht2-view" mode="out-in">
      <div v-if="activeView === 'home'" key="home" class="home_view">
        <div class="home_image">
          <a href="https://togotv.dbcls.jp/togopic.2026.025.html" target="_blank" rel="noopener noreferrer">
            <img src="~/assets/img/heritage-trees/202605_cedrus_deodara_hp.png" alt="Heritage Trees" />
          </a>
        </div>
        <div class="home_description">
          <h2 class="tsukushi bold home_heading">Heritage Trees Project</h2>
          <p class="home_body tsukushi">
            ヘリテージツリーズ（Heritage Trees, 歴史遺産樹木）は、日本最古の公立植物園である京都府立植物園が開園100年を記念して園内の貴重なお宝樹木を紹介するプロジェクトです。統合TVでは、京都府立植物園とのコラボレーションのもと、日本の植物史を体現する38本の樹木を体系的にイラスト化することにより、教育・研究・保全の基盤資料として公開しています。
          </p>
          <p class="home_link tsukushi">
            Heritage Treesについて詳しくは<a href="https://www.kyotobotanicalgardens.jp" target="_blank" rel="noopener noreferrer">京都府立植物園公式サイト</a>をご覧ください。
          </p>
          <p class="home_hint tsukushi">▶ 右下の季節ブロックをクリックして各季節のイラストへ</p>
          <nuxt-link :to="localePath('/heritage-trees-why.html')" class="why_link tsukushi">
            Why Heritage Trees × TogoTV?
          </nuxt-link>
        </div>
      </div>

      <!-- 季節イラストビュー -->
      <div v-else key="season" class="season_view">

        <!-- 季節エフェクト -->
        <div class="seasonal_particles" :class="activeSeason">
          <template v-if="activeSeason !== 'summer'">
            <span v-for="n in particleCount" :key="'p-'+n" class="particle" :style="particleStyle(n)"></span>
          </template>
          <template v-if="activeSeason === 'autumn'">
            <div v-for="(img, idx) in fallingAutumnImages" :key="'fall-'+idx" class="falling_thumb" :style="fallingThumbStyle(idx)">
              <img :src="imgUrl(img)" :alt="img.name" />
            </div>
          </template>
          <template v-if="activeSeason === 'summer'">
            <div v-for="n in 14" :key="'komorebi-'+n" class="komorebi_spot" :style="komorebiStyle(n)"></div>
          </template>
        </div>

        <transition name="mosaic-fade" mode="out-in">
          <div class="image_mosaic" :key="activeSeason" :class="activeSeason">
            <template v-if="mosaicItems.length">
              <div
                v-for="(item, i) in mosaicItems"
                :key="item.id + '-' + i"
                class="mosaic_card"
                :class="`card-pos-${i}`"
                :style="cardSlots[i]"
                @click="handleNavigation($event, `/${item.id.split('/').pop()}.html`)"
              >
                <span class="specimen_no mont">No.{{ item.ht_number ? String(item.ht_number).padStart(2, '0') : String(i + 1).padStart(2, '0') }}</span>
                <div class="fg_frame">
                  <img :src="imgUrl(item)" :alt="item.name" />
                </div>
                <!-- <div class="fg_label">
                  <p class="fg_name_ja tsukushi">{{ item.name }}</p>
                  <p class="fg_name_sci mont">{{ item.scientific_name || item.name_en }}</p>
                </div> -->
                <div class="fg_popup">
                  <p class="popup_name tsukushi bold">{{ item.name }}</p>
                  <p class="popup_sci mont">{{ item.scientific_name || item.name_en }}</p>
                </div>
              </div>
            </template>
            <div v-else class="mosaic_empty">
              <p class="empty_text tsukushi">{{ currentSeason.comingSoon || '準備中' }}</p>
            </div>
          </div>
        </transition>
      </div>
    </transition>

    <!-- 下部グラデーション -->
    <div class="bottom_gradient" :class="activeView === 'season' ? activeSeason : 'home'"></div>

    <!-- サイトタイトル（左下・クリックでHome） -->
    <div class="site_title" :class="{ is_home: activeView === 'home' }" @click="goHome">
      <p class="collab_label tsukushi">京都府立植物園 × Togo Picture Gallery</p>
      <h1 class="main_title mont bold">Heritage Trees<br>× TogoTV</h1>
    </div>

    <!-- テトリスブロック季節セレクター（右下） -->
    <div class="tetris_selector">
      <div
        v-for="(season, i) in seasons"
        :key="season.id"
        class="tetris_block"
        :class="[season.id, `block-pos-${i}`, { active: activeView === 'season' && activeSeason === season.id }]"
        @click="goSeason(season.id)"
      >
        <span class="block_kanji tsukushi bold">{{ season.title }}</span>
      </div>
    </div>

    <!-- ローディング -->
    <transition name="fade">
      <div v-if="isLoading" class="loading_overlay">
        <div class="loading_spinner"></div>
      </div>
    </transition>

  </div>
</template>

<script>
import Vue from 'vue';
import axios from 'axios';

const CARD_SLOTS = [
  { top: '7%',  left: '5%',  width: '27vw' },
  { top: '3%',  left: '37%', width: '17vw' },
  { top: '16%', left: '59%', width: '23vw' },
  { top: '44%', left: '22%', width: '14vw' },
  { top: '40%', left: '42%', width: '20vw' },
];

export default Vue.extend({
  data() {
    return {
      activeView: 'home',
      activeSeason: null,
      seasons: [
        { id: 'spring', title: '春', subtitle: 'Spring', comingSoon: '2026年6月に公開予定', images: [] },
        { id: 'summer', title: '夏', subtitle: 'Summer', comingSoon: '2026年9月に公開予定', images: [] },
        { id: 'autumn', title: '秋', subtitle: 'Autumn', comingSoon: '2026年11月に公開予定', images: [] },
        { id: 'winter', title: '冬', subtitle: 'Winter', comingSoon: null, images: [] }
      ],
      allImages: [],
      isLoading: false,
      loadError: null
    };
  },
  computed: {
    currentSeason() {
      return this.seasons.find(s => s.id === this.activeSeason) || {};
    },
    cardSlots() {
      return CARD_SLOTS;
    },
    mosaicItems() {
      const imgs = this.currentSeason.images || [];
      return imgs.slice(0, CARD_SLOTS.length);
    },
    particleCount() {
      return { winter: 55, spring: 22, autumn: 14 }[this.activeSeason] || 0;
    },
    fallingAutumnImages() {
      return (this.currentSeason.images || []).slice(0, 12);
    }
  },
  async asyncData() {
    try {
      const res = await axios.get(
        'https://togotv-api.dbcls.jp/api/bool_search',
        { params: { target: 'pictures', other_tags: 'KBG', rows: 1000 }, timeout: 30000 }
      );
      return { allImages: res.data.data || [] };
    } catch (e) {
      return { allImages: [] };
    }
  },
  created() {
    this.categorizeImages();
  },
  head() {
    return {
      title: 'Heritage Tree × TogoTV',
      meta: [
        { hid: 'og:title', property: 'og:title', content: 'Heritage Tree × TogoTV' },
        { hid: 'og:url', property: 'og:url', content: process.client ? location.href : '' }
      ]
    };
  },
  methods: {
    imgUrl(img) {
      return `https://dbarchive.biosciencedbc.jp/data/togo-pic/image/${img.png}`;
    },
    goHome() {
      this.activeView = 'home';
      this.activeSeason = null;
    },
    goSeason(id) {
      this.activeSeason = id;
      this.activeView = 'season';
    },
    async fetchImages() {
      this.isLoading = true;
      try {
        const res = await axios.get(
          'https://togotv-api.dbcls.jp/api/bool_search',
          { params: { target: 'pictures', other_tags: 'KBG', rows: 1000 }, timeout: 30000 }
        );
        this.allImages = res.data.data || [];
        this.categorizeImages();
      } catch (e) {
        this.loadError = '画像の読み込みに失敗しました';
      } finally {
        this.isLoading = false;
      }
    },
    categorizeImages() {
      // other_tags_comma（カンマ区切り文字列）で季節タグを判定
      const hasTag = (img, ...keywords) => {
        const tags = (img.other_tags_comma || '').split(',').map(t => t.trim());
        return keywords.some(k => tags.includes(k));
      };
      this.seasons[0].images = this.allImages.filter(img => hasTag(img, '春', 'Spring'));
      this.seasons[1].images = this.allImages.filter(img => hasTag(img, '夏', 'Summer'));
      this.seasons[2].images = this.allImages.filter(img => hasTag(img, '秋', 'Autumn', 'Fall'));
      this.seasons[3].images = this.allImages.filter(img => hasTag(img, '冬', 'Winter'));
    },
    handleNavigation(event, path) {
      event.preventDefault();
      this.$router.push({ path: this.localePath(path), query: { from_ht: 'true' } });
    },
    particleStyle(n) {
      const s = n * 137.508;
      const isWinter = this.activeSeason === 'winter';
      const isSpring = this.activeSeason === 'spring';
      const isAutumn = this.activeSeason === 'autumn';
      const sz = isWinter ? 3 + (n % 9) : 10 + (n % 22);
      // 春・秋は風で流れるように横振れを大きく
      const amp = (isSpring || isAutumn) ? 80 + (n % 140) : 20 + (n % 50);
      const sign = n % 2 === 0 ? 1 : -1;
      return {
        left: `${(s % 100).toFixed(1)}%`,
        animationDelay: `-${(s % 9).toFixed(2)}s`,
        animationDuration: `${(isWinter ? 6 + s % 8 : 4 + s % 7).toFixed(2)}s`,
        '--sz': `${sz}px`,
        '--rot0': `${(s % 360).toFixed(0)}deg`,
        '--rot1': `${((s * 1.618) % 360).toFixed(0)}deg`,
        '--dx1': `${sign * amp * 0.5}px`,
        '--dx2': `${-sign * amp * 0.8}px`,
        '--dx3': `${sign * amp}px`,
        '--dx4': `${-sign * amp * 0.3}px`,
      };
    },
    fallingThumbStyle(i) {
      const s = i * 97.3 + 31;
      return {
        left: `${(s % 86).toFixed(1)}%`,
        animationDelay: `-${(s % 11).toFixed(2)}s`,
        animationDuration: `${(10 + s % 8).toFixed(2)}s`,
        '--drift': `${-35 + Math.floor(s % 70)}px`,
      };
    },
    komorebiStyle(n) {
      const s = n * 89.3;
      const sz = 90 + (n % 160);
      return {
        left: `${(s % 90).toFixed(1)}%`,
        top: `${(s % 80).toFixed(1)}%`,
        width: `${sz}px`,
        height: `${sz}px`,
        animationDelay: `-${(s % 5).toFixed(2)}s`,
        animationDuration: `${(3 + s % 5).toFixed(2)}s`,
      };
    }
  }
});
</script>

<style lang="sass">
// ─── 季節エフェクト keyframes ─────────────────────────
@keyframes snow-fall
  0%
    transform: translateX(0) translateY(0)
    opacity: 0
  8%
    opacity: 0.85
  25%
    transform: translateX(var(--dx1)) translateY(25vh)
  50%
    transform: translateX(var(--dx2)) translateY(50vh)
  75%
    transform: translateX(var(--dx3)) translateY(75vh)
  92%
    opacity: 0.75
  100%
    transform: translateX(var(--dx4)) translateY(108vh)
    opacity: 0

@keyframes petal-fall
  0%
    transform: translateX(0) translateY(0) rotate(var(--rot0)) scaleX(1)
    opacity: 0
  6%
    opacity: 0.88
  18%
    transform: translateX(var(--dx1)) translateY(18vh) rotate(calc(var(--rot0) + 35deg)) scaleX(0.15)
  35%
    transform: translateX(var(--dx2)) translateY(35vh) rotate(calc(var(--rot0) + 80deg)) scaleX(1)
  52%
    transform: translateX(var(--dx3)) translateY(52vh) rotate(calc(var(--rot0) + 130deg)) scaleX(0.1)
  68%
    transform: translateX(var(--dx4)) translateY(68vh) rotate(calc(var(--rot0) + 185deg)) scaleX(0.95)
  84%
    transform: translateX(var(--dx1)) translateY(84vh) rotate(calc(var(--rot0) + 240deg)) scaleX(0.12)
    opacity: 0.75
  100%
    transform: translateX(var(--dx2)) translateY(108vh) rotate(var(--rot1)) scaleX(0.8)
    opacity: 0

@keyframes leaf-fall
  0%
    transform: translateX(0) translateY(0) rotate(var(--rot0))
    opacity: 0
  6%
    opacity: 0.72
  35%
    transform: translateX(var(--dx1)) translateY(35vh) rotate(calc(var(--rot0) + 180deg))
  65%
    transform: translateX(var(--dx3)) translateY(65vh) rotate(calc(var(--rot0) + 320deg))
  92%
    opacity: 0.6
  100%
    transform: translateX(var(--dx2)) translateY(108vh) rotate(var(--rot1))
    opacity: 0

@keyframes thumb-fall
  0%
    transform: translateX(0) rotate(-4deg)
    opacity: 0
  8%
    opacity: 0.55
  45%
    transform: translateX(var(--drift)) rotate(3deg)
  90%
    opacity: 0.45
  100%
    transform: translateX(0) translateY(110vh) rotate(-3deg)
    opacity: 0

@keyframes komorebi-pulse
  0%, 100%
    transform: scale(1) rotate(0deg)
    opacity: 0.1
  50%
    transform: scale(1.25) rotate(3deg)
    opacity: 0.22

@keyframes block-drop
  0%
    transform: translateY(-160px) rotate(var(--rot, 0deg))
    opacity: 0
  65%
    transform: translateY(10px) rotate(var(--rot, 0deg))
    opacity: 1
  80%
    transform: translateY(-5px) rotate(var(--rot, 0deg))
  100%
    transform: translateY(0px) rotate(var(--rot, 0deg))
    opacity: 1

@keyframes ht2-fadein
  from
    opacity: 0
    transform: translateY(18px)
  to
    opacity: 1
    transform: translateY(0)

@keyframes ht2-mosaic-in
  from
    opacity: 0
    transform: scale(0.98)
  to
    opacity: 1
    transform: scale(1)

@keyframes ht2-spin
  to
    transform: rotate(360deg)

// ─── ラッパー ─────────────────────────────────────────
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
// 背景イラスト（季節ビューの下層に固定配置する画像を入れる。元は、ヒマラヤスギを入れていた）
  //  &::after
  //   content: ''
  //   position: fixed
  //   bottom: 0
  //   left: 0
  //   width: 55vw
  //   height: 100vh
  //   background-image: url('~@/assets/img/heritage-trees/202605_cedrus_deodara_hp.png')
  //   background-size: 100% auto
  //   background-position: left bottom
  //   background-repeat: no-repeat
  //   opacity: 0.2
  //   z-index: 0
  //   pointer-events: none

// ─── ホームビュー ─────────────────────────────────────
.home_view
  position: absolute
  inset: 0
  display: flex
  align-items: center
  z-index: 1

  > .home_image
    flex: 0 0 50%
    animation: ht2-fadein 1.1s cubic-bezier(0.22, 1, 0.36, 1) both
    height: 100%
    display: flex
    align-items: center
    justify-content: center
    padding: 80px 20px 80px 60px
    box-sizing: border-box
    > img,
    > a > img
      max-width: 100%
      max-height: 80vh
      object-fit: contain
      filter: drop-shadow(0 8px 32px rgba(0, 0, 0, 0.18))
    > a
      display: contents  // aタグがレイアウトに影響しないように

  > .home_description
    flex: 0 0 50%
    padding: 60px 60px 60px 32px
    box-sizing: border-box
    animation: ht2-fadein 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both
    > .home_heading
      font-size: 52px
      color: #1a4a2e
      margin: 0 0 28px 0
    > .home_body
      font-size: 28px
      line-height: 1.8
      color: #1a4a2e
      margin: 0 0 24px 0
    > .home_link
      font-size: 24px
      color: #1a4a2e
      margin: 0 0 32px 0
      > a
        color: #1a4a2e
        text-decoration: underline
        font-weight: bold
        &:hover
          color: #2d7a4a
    > .home_hint
      font-size: 20px
      color: rgba(26, 74, 46, 0.6)
      margin: 0 0 20px 0
    > .why_link
      display: inline-block
      font-size: 18px
      font-weight: bold
      color: #1a4a2e
      text-decoration: none
      border-bottom: 2px solid rgba(26, 74, 46, 0.35)
      padding-bottom: 2px
      transition: color 0.2s ease, border-color 0.2s ease
      &:hover
        color: #2d7a4a
        border-bottom-color: #2d7a4a

// ─── 季節ビュー ───────────────────────────────────────
.season_view
  position: absolute
  inset: 0
  z-index: 1

// ─── イラスト散在配置 ─────────────────────────────────
.image_mosaic
  position: absolute
  inset: 0
  pointer-events: none

  .mosaic_card
    position: absolute
    background: #fafaf4
    border: 1px solid #c4af8a
    padding: 12px
    box-sizing: border-box
    cursor: pointer
    pointer-events: auto
    transition: transform 0.35s ease, box-shadow 0.35s ease
    overflow: visible

    // 図鑑らしい微妙な傾き（ほぼ真っ直ぐ）
    &.card-pos-0
      transform: rotate(-1deg)
    &.card-pos-1
      transform: rotate(0.8deg)
    &.card-pos-2
      transform: rotate(-1.5deg)
    &.card-pos-3
      transform: rotate(1.2deg)
    &.card-pos-4
      transform: rotate(-0.5deg)

    // 標本番号（右上）
    > .specimen_no
      position: absolute
      top: 7px
      right: 10px
      font-size: 11px
      color: #a08060
      letter-spacing: 0.05em

    // 内側フレーム（細い罫線囲み）
    > .fg_frame
      width: 100%
      aspect-ratio: 1
      border: 1px solid #d0bb96
      overflow: hidden
      background: #f5f0e8
      > img
        width: 100%
        height: 100%
        object-fit: contain

    // ラベル部分
    > .fg_label
      padding: 8px 2px 4px
      border-top: 1px solid #d0bb96
      > .fg_name_ja
        font-size: 18px
        color: #2a1a0a
        margin: 0 0 3px 0
        line-height: 1.3
      > .fg_name_sci
        font-size: 11px
        font-style: italic
        color: #6a4e2a
        margin: 0
        line-height: 1.3

    // ホバーポップアップ
    > .fg_popup
      position: absolute
      top: calc(100% + 12px)
      left: 50%
      transform: translateX(-50%) translateY(6px)
      opacity: 0
      transition: opacity 0.25s ease, transform 0.25s ease
      background: rgba(250, 247, 238, 0.97)
      border: 1px solid #c4af8a
      padding: 14px 18px
      min-width: 190px
      max-width: 260px
      z-index: 20
      pointer-events: none
      box-shadow: 0 4px 20px rgba(100, 80, 40, 0.22)
      &::before
        content: ''
        position: absolute
        bottom: 100%
        left: 50%
        transform: translateX(-50%)
        border: 6px solid transparent
        border-bottom-color: #c4af8a
      > .popup_name
        font-size: 16px
        font-weight: bold
        color: #1a0a00
        margin: 0 0 5px 0
      > .popup_sci
        font-size: 12px
        font-style: italic
        color: #6a4e2a
        margin: 0

    &:hover
      transform: rotate(0deg) scale(1.1) !important
      box-shadow: 0 6px 28px rgba(100, 80, 40, 0.28)
      z-index: 10
      > .fg_popup
        opacity: 1
        transform: translateX(-50%) translateY(0)

  // 季節ごとの内側フレーム色
  &.spring .fg_frame
    background: rgba(255, 235, 240, 0.95)
  &.summer .fg_frame
    background: rgba(235, 250, 235, 0.95)
  &.autumn .fg_frame
    background: rgba(255, 248, 225, 0.95)
  &.winter .fg_frame
    background: rgba(232, 245, 252, 0.95)

  .mosaic_empty
    position: absolute
    inset: 0
    display: flex
    align-items: center
    justify-content: center
    pointer-events: none
    > .empty_text
      font-size: 44px
      color: rgba(255, 255, 255, 0.85)
      text-shadow: 0 2px 12px rgba(0, 0, 0, 0.45)

// ─── 下部グラデーション ───────────────────────────────
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
  &.spring
    background: linear-gradient(transparent, rgba(255, 160, 185, 0.72))
  &.summer
    background: linear-gradient(transparent, rgba(80, 180, 80, 0.65))
  &.autumn
    background: linear-gradient(transparent, rgba(200, 160, 0, 0.68))
  &.winter
    background: linear-gradient(transparent, rgba(100, 170, 210, 0.65))

// ─── サイトタイトル（左下） ──────────────────────────
.site_title
  position: absolute
  bottom: 44px
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
    font-size: 76px
    line-height: 1.0
    color: #fff
    margin: 0
    letter-spacing: -0.02em
    text-shadow: 2px 4px 24px rgba(0, 0, 0, 0.55), 0 0 80px rgba(0, 0, 0, 0.25)

// ─── テトリスブロック（右下） ─────────────────────────
.tetris_selector
  position: absolute
  bottom: 44px
  right: 56px
  z-index: 10
  display: grid
  animation: ht2-fadein 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.6s both
  grid-template-columns: repeat(2, 88px)
  grid-template-rows: repeat(3, 88px)
  gap: 5px

  .tetris_block
    display: flex
    align-items: center
    justify-content: center
    border: 3px solid currentColor
    cursor: pointer
    opacity: 0
    animation: block-drop 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) forwards
    transition: box-shadow 0.2s ease, background 0.2s ease

    > .block_kanji
      font-size: 40px
      line-height: 1
      transition: color 0.2s ease

    &.block-pos-0
      --rot: 1.8deg
      color: #c0334a
      background: rgba(255, 220, 228, 0.82)
      animation-delay: 0.05s
      grid-area: 3 / 2
      box-shadow: 0 4px 16px rgba(192, 51, 74, 0.35), 0 2px 6px rgba(0,0,0,0.2)
      &.active
        background: #c0334a
        color: #fff
        box-shadow: 0 0 0 2px #fff, 0 6px 24px rgba(192, 51, 74, 0.6)

    &.block-pos-1
      --rot: -2.2deg
      color: #1f7a3a
      background: rgba(200, 240, 210, 0.82)
      animation-delay: 0.18s
      grid-area: 2 / 2
      box-shadow: 0 4px 16px rgba(31, 122, 58, 0.35), 0 2px 6px rgba(0,0,0,0.2)
      &.active
        background: #1f7a3a
        color: #fff
        box-shadow: 0 0 0 2px #fff, 0 6px 24px rgba(31, 122, 58, 0.6)

    &.block-pos-2
      --rot: 3deg
      color: #a07000
      background: rgba(255, 240, 180, 0.82)
      animation-delay: 0.32s
      grid-area: 1 / 2
      box-shadow: 0 4px 16px rgba(160, 112, 0, 0.35), 0 2px 6px rgba(0,0,0,0.2)
      &.active
        background: #a07000
        color: #fff
        box-shadow: 0 0 0 2px #fff, 0 6px 24px rgba(160, 112, 0, 0.6)

    &.block-pos-3
      --rot: -1.5deg
      color: #1a6a90
      background: rgba(200, 230, 245, 0.82)
      animation-delay: 0.46s
      grid-area: 3 / 1
      box-shadow: 0 4px 16px rgba(26, 106, 144, 0.35), 0 2px 6px rgba(0,0,0,0.2)
      &.active
        background: #1a6a90
        color: #fff
        box-shadow: 0 0 0 2px #fff, 0 6px 24px rgba(26, 106, 144, 0.6)

    &:hover:not(.active)
      transform: scale(1.07) rotate(var(--rot, 0deg))
      box-shadow: 0 6px 24px rgba(0, 0, 0, 0.35)

// ─── 季節エフェクト ───────────────────────────────────
.seasonal_particles
  position: absolute
  inset: 0
  pointer-events: none
  z-index: 0
  overflow: hidden

  .particle
    position: absolute
    top: -40px
    width: var(--sz)
    height: var(--sz)

  // 冬: 雪
  &.winter .particle
    border-radius: 50%
    background: rgba(255, 255, 255, 0.88)
    box-shadow: 0 0 5px rgba(220, 240, 255, 0.7)
    animation: snow-fall ease-in-out infinite

  // 春: 桜の花びら
  &.spring .particle
    background: radial-gradient(ellipse at 40% 30%, #fff0f3 0%, #FFB7C5 55%, #f48fa8 100%)
    border-radius: 50% 50% 50% 50% / 65% 65% 35% 35%
    height: calc(var(--sz) * 0.65)
    animation: petal-fall ease-in-out infinite

  // 秋: 落ち葉
  &.autumn .particle
    background: rgba(195, 90, 25, 0.72)
    border-radius: 45% 0 35% 65% / 65% 35% 65% 35%
    animation: leaf-fall ease-in-out infinite

  // 秋: コンテンツサムネイル
  .falling_thumb
    position: absolute
    top: -130px
    width: 78px
    height: 78px
    animation: thumb-fall ease-in-out infinite
    > img
      width: 100%
      height: 100%
      object-fit: contain
      border-radius: 4px
      background: rgba(255, 248, 220, 0.9)
      box-shadow: 2px 4px 14px rgba(0, 0, 0, 0.28)

  // 夏: 木漏れ日
  .komorebi_spot
    position: absolute
    background: radial-gradient(ellipse, rgba(255, 255, 180, 0.45) 0%, rgba(180, 240, 100, 0.1) 50%, transparent 70%)
    border-radius: 50%
    animation: komorebi-pulse ease-in-out infinite

// ─── トランジション ───────────────────────────────────
.ht2-view-enter-active
  transition: opacity 0.4s ease, transform 0.4s ease
.ht2-view-leave-active
  transition: opacity 0.3s ease, transform 0.3s ease
.ht2-view-enter
  opacity: 0
  transform: translateY(12px)
.ht2-view-leave-to
  opacity: 0
  transform: translateY(-12px)

.mosaic-fade-enter-active
  animation: ht2-mosaic-in 0.45s ease
.mosaic-fade-leave-active
  transition: opacity 0.25s ease
.mosaic-fade-leave-to
  opacity: 0

.fade-enter-active,
.fade-leave-active
  transition: opacity 0.4s ease
.fade-enter,
.fade-leave-to
  opacity: 0

// ─── ローディング ─────────────────────────────────────
.loading_overlay
  position: absolute
  inset: 0
  background: rgba(255, 255, 255, 0.55)
  backdrop-filter: blur(4px)
  display: flex
  align-items: center
  justify-content: center
  z-index: 10

  > .loading_spinner
    width: 52px
    height: 52px
    border: 4px solid rgba(0, 153, 153, 0.2)
    border-top-color: #009999
    border-radius: 50%
    animation: ht2-spin 0.75s linear infinite

@media screen and (max-width: 1024px)
  .home_view
    flex-direction: column
    overflow-y: auto
    > .home_image
      flex: 0 0 auto
      padding: 80px 24px 20px
      max-height: 40vh
    > .home_description
      flex: 0 0 auto
      padding: 20px 24px 240px

  // ホームビューはテキストがスクロールするため、固定オーバーレイの
  // グラデーション/タイトルは表示せず（本文と重なって読めなくなるため）
  .bottom_gradient.home
    display: none

  .site_title.is_home
    display: none

  .site_title:not(.is_home)
    bottom: 200px
    left: 24px
    > .main_title
      font-size: 44px

  .tetris_selector
    right: 24px
    bottom: 24px
    grid-template-columns: repeat(2, 64px)
    grid-template-rows: repeat(3, 64px)
    gap: 4px
    .tetris_block > .block_kanji
      font-size: 28px
</style>
