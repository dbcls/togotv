<template>
  <div class="heritage_trees_develop_wrapper">
    <h2 class="tsukushi bold section_heading_center">京都府立植物園 Heritage Trees Project x Togo Picture Gallery 特設サイト</h2>

    <!-- トップ画像 -->
    <div class="top_image_panel">
      <img src="~/assets/img/heritage-trees/rounghsketch4.png" alt="Heritage Trees" />
    </div>

    <!-- 解説文章（トップ画像の直下） -->
    <div class="hero_text">
      <p>
        ヘリテージツリーズ（Heritage Trees, 歴史遺産樹木)は、日本最古の公立植物園である京都府立植物園が開園１００年を記念して園内の貴重なお宝樹木を紹介するプロジェクトです。統合TVでは、京都府立植物園とのコラボレーションのもと、日本の植物史を体現する38本の樹木を体系的にイラスト化することにより、教育・研究・保全の基盤資料として公開しています。
      </p>
      <p class="heritage_link">
        詳しくは<a href="https://www.kyotobotanicalgardens.jp" target="_blank" rel="noopener noreferrer">京都府立植物園公式サイト</a>をご覧ください。
      </p>
    </div>

    <!-- 四季ボックスレイアウト：Box1(春夏) + Box2(秋冬) -->
    <div class="main_layout">

      <!-- Box1: 春・夏 -->
      <div class="season_box" :class="getBoxClass('box1')">
        <!-- 拡大アニメーション用オーバーレイ -->
        <div v-if="expandingSeason && isInBox(expandingSeason, 'box1')"
          class="expand_overlay" :class="expandingSeason"
        ></div>

        <!-- デフォルト表示：対角レイアウト -->
        <div v-show="!isBoxOpen('box1')" class="diagonal_layout">
          <!-- 春：左上 -->
          <div class="season_strip top_strip spring" @click="openSeason('spring')">
            <div class="strip_falling_overlay" aria-hidden="true">
              <div v-for="(item, i) in fallingItemsBySeasonId.spring" :key="i" class="strip_falling_item" :style="item.style">
                <img :src="item.src" :alt="item.name" />
              </div>
            </div>
            <div class="strip_tab">
              <h3 class="tsukushi bold">春</h3>
              <span>Spring</span>
            </div>
            <div class="strip_images">
              <template v-if="getImages('spring').length">
                <div v-for="img in getImages('spring')" :key="img.id" class="thumb">
                  <img :src="imgUrl(img)" :alt="img.name" />
                </div>
              </template>
              <p v-else class="coming_soon">{{ getSeason('spring').comingSoon }}</p>
            </div>
          </div>
          <!-- 夏：右下（漢字は左） -->
          <div class="season_strip bottom_strip summer" @click="openSeason('summer')">
            <div class="strip_falling_overlay" aria-hidden="true">
              <div v-for="(item, i) in fallingItemsBySeasonId.summer" :key="i" class="strip_falling_item" :style="item.style">
                <img :src="item.src" :alt="item.name" />
              </div>
            </div>
            <div class="strip_tab">
              <h3 class="tsukushi bold">夏</h3>
              <span>Summer</span>
            </div>
            <div class="strip_images">
              <template v-if="getImages('summer').length">
                <div v-for="img in getImages('summer')" :key="img.id" class="thumb">
                  <img :src="imgUrl(img)" :alt="img.name" />
                </div>
              </template>
              <p v-else class="coming_soon">{{ getSeason('summer').comingSoon }}</p>
            </div>
          </div>
        </div>

        <!-- オープン表示 -->
        <transition name="season-open">
          <div v-if="isBoxOpen('box1')" class="open_layout" :class="activeSeason">
            <div class="open_tab" @click="closeSeason">
              <h3 class="tsukushi bold">{{ getSeasonTitle(activeSeason) }}</h3>
              <span class="close_hint">×</span>
            </div>
            <div class="open_content">
              <template v-if="getImages(activeSeason).length">
                <div v-for="img in getImages(activeSeason)" :key="img.id" class="open_card"
                  @click.stop="handleNavigation($event, `/${img.id.split('/').pop()}.html`)">
                  <div class="open_img_wrap">
                    <img :src="imgUrl(img)" :alt="img.name" />
                  </div>
                  <p class="img_name tsukushi">{{ img.name }}</p>
                </div>
              </template>
              <p v-else class="coming_soon_lg">{{ getSeason(activeSeason).comingSoon }}</p>
            </div>
          </div>
        </transition>
      </div>

      <!-- Box2: 秋・冬 -->
      <div class="season_box" :class="getBoxClass('box2')">
        <div v-if="expandingSeason && isInBox(expandingSeason, 'box2')"
          class="expand_overlay" :class="expandingSeason"
        ></div>

        <div v-show="!isBoxOpen('box2')" class="diagonal_layout">
          <!-- 秋：左上 -->
          <div class="season_strip top_strip autumn" @click="openSeason('autumn')">
            <div class="strip_falling_overlay" aria-hidden="true">
              <div v-for="(item, i) in fallingItemsBySeasonId.autumn" :key="i" class="strip_falling_item" :style="item.style">
                <img :src="item.src" :alt="item.name" />
              </div>
            </div>
            <div class="strip_tab">
              <h3 class="tsukushi bold">秋</h3>
              <span>Autumn</span>
            </div>
            <div class="strip_images">
              <template v-if="getImages('autumn').length">
                <div v-for="img in getImages('autumn')" :key="img.id" class="thumb">
                  <img :src="imgUrl(img)" :alt="img.name" />
                </div>
              </template>
              <p v-else class="coming_soon">{{ getSeason('autumn').comingSoon }}</p>
            </div>
          </div>
          <!-- 冬：右下 -->
          <div class="season_strip bottom_strip winter" @click="openSeason('winter')">
            <div class="strip_falling_overlay" aria-hidden="true">
              <div v-for="(item, i) in fallingItemsBySeasonId.winter" :key="i" class="strip_falling_item" :style="item.style">
                <img :src="item.src" :alt="item.name" />
              </div>
            </div>
            <div class="strip_images reverse">
              <template v-if="getImages('winter').length">
                <div v-for="img in getImages('winter')" :key="img.id" class="thumb">
                  <img :src="imgUrl(img)" :alt="img.name" />
                </div>
              </template>
              <p v-else class="coming_soon">{{ getSeason('winter').comingSoon }}</p>
            </div>
            <div class="strip_tab">
              <h3 class="tsukushi bold">冬</h3>
              <span>Winter</span>
            </div>
          </div>
        </div>

        <transition name="season-open">
          <div v-if="isBoxOpen('box2')" class="open_layout" :class="activeSeason">
            <div class="open_tab" @click="closeSeason">
              <h3 class="tsukushi bold">{{ getSeasonTitle(activeSeason) }}</h3>
              <span class="close_hint">×</span>
            </div>
            <div class="open_content">
              <template v-if="getImages(activeSeason).length">
                <div v-for="img in getImages(activeSeason)" :key="img.id" class="open_card"
                  @click.stop="handleNavigation($event, `/${img.id.split('/').pop()}.html`)">
                  <div class="open_img_wrap">
                    <img :src="imgUrl(img)" :alt="img.name" />
                  </div>
                  <p class="img_name tsukushi">{{ img.name }}</p>
                </div>
              </template>
              <p v-else class="coming_soon_lg">{{ getSeason(activeSeason).comingSoon }}</p>
            </div>
          </div>
        </transition>

        <!-- はみ出し部分に表示する季節ラベル -->
        <div v-show="!isBoxOpen('box2')" class="peek_labels">
          <div class="peek_season autumn tsukushi bold" @click="openSeason('autumn')">秋</div>
          <div class="peek_season winter tsukushi bold" @click="openSeason('winter')">冬</div>
        </div>
      </div>

    </div>

    <!-- ローディング / エラー -->
    <div v-if="isLoading" class="loading_wrapper">
      <p class="loading_text">画像を読み込んでいます...</p>
    </div>
    <div v-else-if="loadError" class="error_wrapper">
      <p class="error_text">{{ loadError }}</p>
      <button class="retry_button" @click="fetchHeritageImages">再読み込み</button>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";

export default Vue.extend({
  data() {
    return {
      activeSeason: null,
      expandingSeason: null,
      seasons: [
        { id: "spring", title: "春", subtitle: "Spring", comingSoon: "2026年6月に公開予定", images: [] },
        { id: "summer", title: "夏", subtitle: "Summer", comingSoon: "2026年9月に公開予定", images: [] },
        { id: "autumn", title: "秋", subtitle: "Autumn", comingSoon: "2026年11月に公開予定", images: [] },
        { id: "winter", title: "冬", subtitle: "Winter", comingSoon: null, images: [] }
      ],
      fallingItemsBySeasonId: { spring: [], summer: [], autumn: [], winter: [] },
      allHeritageImages: [],
      isLoading: true,
      loadError: null
    };
  },
  computed: {},
  created() {
    this.fetchHeritageImages();
  },
  head() {
    return {
      title: "Heritage Trees - 四季の樹木",
      meta: [
        { hid: "og:title", property: "og:title", content: "Heritage Trees - 四季の樹木" },
        { hid: "og:description", property: "og:description", content: "京都府立植物園の歴史的樹木を四季折々の姿でご紹介" },
        { hid: "og:url", property: "og:url", content: process.client ? location.href : "" }
      ]
    };
  },
  methods: {
    getSeason(id) {
      return this.seasons.find(s => s.id === id) || {};
    },
    getImages(id) {
      const s = this.getSeason(id);
      return (s.images || []).slice(0, 3);
    },
    getSeasonTitle(id) {
      const s = this.getSeason(id);
      return s.title || '';
    },
    imgUrl(img) {
      return `https://dbarchive.biosciencedbc.jp/data/togo-pic/image/${img.png}`;
    },
    isInBox(seasonId, boxId) {
      return boxId === 'box1'
        ? seasonId === 'spring' || seasonId === 'summer'
        : seasonId === 'autumn' || seasonId === 'winter';
    },
    isBoxOpen(boxId) {
      return this.activeSeason && this.isInBox(this.activeSeason, boxId);
    },
    getBoxClass(boxId) {
      const cls = {};
      if (this.expandingSeason && this.isInBox(this.expandingSeason, boxId)) cls['is-expanding'] = true;
      if (this.isBoxOpen(boxId)) cls[`is-open-${this.activeSeason}`] = true;
      if (
        (this.expandingSeason && this.isInBox(this.expandingSeason, boxId)) ||
        this.isBoxOpen(boxId)
      ) cls['is-front'] = true;
      return cls;
    },
    openSeason(id) {
      if (this.activeSeason === id) { this.closeSeason(); return; }
      this.activeSeason = null;
      this.expandingSeason = id;
      setTimeout(() => {
        this.expandingSeason = null;
        this.activeSeason = id;
      }, 520);
    },
    closeSeason() {
      this.activeSeason = null;
    },
    async fetchHeritageImages() {
      this.isLoading = true;
      this.loadError = null;
      try {
        const response = await axios.get(
          `https://togotv-api.dbcls.jp/api/search?target=pictures&taxon1=被子植物&rows=100`,
          { timeout: 30000, headers: { 'Accept': 'application/json' } }
        );
        this.allHeritageImages = response.data.data || [];
        this.categorizeImages();
      } catch (error) {
        this.loadError = "画像の読み込みに失敗しました。しばらくしてから再度お試しください。";
        this.allHeritageImages = [];
      } finally {
        this.isLoading = false;
      }
    },
    categorizeImages() {
      if (!this.allHeritageImages.length) return;
      const text = (img) => {
        const tags = Array.isArray(img.other_tags) ? img.other_tags.join(" ") : (img.other_tags || "");
        const kw = Array.isArray(img.keywords) ? img.keywords.join(" ") : (img.keywords || "");
        return `${tags} ${kw} ${img.name || ""} ${img.name_en || ""}`.toLowerCase();
      };
      this.seasons[0].images = this.allHeritageImages.filter(i => { const t = text(i); return t.includes("春") || t.includes("spring"); });
      this.seasons[1].images = this.allHeritageImages.filter(i => { const t = text(i); return t.includes("夏") || t.includes("summer"); });
      this.seasons[2].images = this.allHeritageImages.filter(i => { const t = text(i); return t.includes("秋") || t.includes("autumn") || t.includes("fall"); });
      this.seasons[3].images = this.allHeritageImages;

      // 各季節のストリップ内落下アイテム生成
      const baseUrl = 'https://dbarchive.biosciencedbc.jp/data/togo-pic/image/';
      this.seasons.forEach(season => {
        if (!season.images.length) return;
        const items = [];
        for (let i = 0; i < 7; i++) {
          const img = season.images[i % season.images.length];
          const size = 36 + Math.random() * 28;
          items.push({
            src: `${baseUrl}${img.png}`,
            name: img.name,
            style: {
              left: `${Math.random() * 88}%`,
              width: `${size}px`,
              height: `${size}px`,
              animationDuration: `${9 + Math.random() * 10}s`,
              animationDelay: `${Math.random() * 14}s`,
              '--rotate': `${Math.random() * 360}deg`
            }
          });
        }
        this.fallingItemsBySeasonId[season.id] = items;
      });
    },
    handleNavigation(event, path) {
      event.preventDefault();
      this.$router.push({ path: this.localePath(path), query: { from_ht: 'true' } });
    }
  }
});
</script>

<style lang="sass" scoped>
@keyframes falling
  0%
    transform: translateY(-120px) rotate(0deg)
    opacity: 0
  8%
    opacity: 0.75
  90%
    opacity: 0.75
  100%
    transform: translateY(105vh) rotate(var(--rotate, 180deg))
    opacity: 0

@keyframes expand-fill
  0%
    transform: scale(0.15)
    opacity: 0.9
    border-radius: 50%
  50%
    transform: scale(1.05)
    opacity: 1
    border-radius: 0
  100%
    transform: scale(1)
    opacity: 0
    border-radius: 0


.section_heading_center
  font-size: 56px
  text-align: center
  width: 100%
  display: block
  padding: 40px $VIEW_PADDING 24px
  line-height: 1.3

.heritage_trees_develop_wrapper
  min-height: 100vh
  position: relative

  &::before
    content: ''
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    background-image: url('~@/assets/img/test_wall.jpg')
    background-size: cover
    background-position: center
    background-repeat: no-repeat
    background-attachment: fixed
    opacity: 0.15
    z-index: -1

  &::after
    content: ''
    position: absolute
    bottom: 0
    left: 0
    width: 60vw
    height: 120vh
    background-image: url('~@/assets/img/heritage-trees/bg_tree.png')
    background-size: 100% auto
    background-position: left bottom
    background-repeat: no-repeat
    opacity: 0.35
    z-index: -1
    pointer-events: none

  // トップ画像（上段・中央寄せ）
  > .top_image_panel
    display: flex
    justify-content: center
    padding: 0 $VIEW_PADDING
    > img
      max-height: 800px
      width: auto
      max-width: 900px
      object-fit: contain

  // 四季ボックスレイアウト（重ね合わせ・センター）
  > .main_layout
    position: relative
    width: 1800px
    max-width: calc(100% - #{$VIEW_PADDING} * 2)
    height: 960px
    margin: 12px auto 0

    // 季節ボックス共通
    > .season_box
      position: absolute
      overflow: hidden
      border-radius: 4px
      transition: box-shadow 0.3s ease
      // デフォルトはBox1が前面（:first-childで設定）
      &:first-child
        top: 0
        left: 0
        width: calc(100% - 160px)
        height: 800px
        z-index: 2
        box-shadow: 6px 6px 24px rgba(0, 0, 0, 0.18)
      &:last-child
        top: 160px
        left: 160px
        width: calc(100% - 160px)
        height: 800px
        z-index: 1
        box-shadow: 3px 3px 12px rgba(0, 0, 0, 0.12)
      &.is-front
        z-index: 3

      // 拡大アニメーションオーバーレイ
      > .expand_overlay
        position: absolute
        inset: 0
        z-index: 20
        pointer-events: none
        animation: expand-fill 0.52s ease forwards
        &.spring
          background: rgba(255, 183, 197, 0.85)
        &.summer
          background: rgba(144, 238, 144, 0.85)
        &.autumn
          background: rgba(255, 215, 0, 0.85)
        &.winter
          background: rgba(176, 224, 230, 0.85)

      // 対角レイアウト
      > .diagonal_layout
        display: flex
        flex-direction: column
        height: 100%

        > .season_strip
          flex: 1
          display: flex
          flex-direction: row
          align-items: center
          cursor: pointer
          transition: filter 0.25s ease
          padding: 12px
          gap: 10px
          backdrop-filter: blur(4px)
          -webkit-backdrop-filter: blur(4px)
          position: relative
          overflow: hidden

          > .strip_falling_overlay
            position: absolute
            inset: 0
            pointer-events: none
            z-index: 0
            overflow: hidden
            > .strip_falling_item
              position: absolute
              top: -50px
              border-radius: 6px
              overflow: hidden
              animation: falling linear infinite
              box-shadow: 0 2px 6px rgba(0, 0, 0, 0.18)
              opacity: 0.7
              > img
                width: 100%
                height: 100%
                object-fit: cover

          > .strip_tab,
          > .strip_images
            position: relative
            z-index: 1

          &:hover
            filter: brightness(1.08)

          // 春
          &.spring
            background: linear-gradient(135deg, #FFB7C5, #FF9FB0)
            clip-path: polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)

          // 夏
          &.summer
            background: linear-gradient(135deg, #90EE90, #76D776)
            clip-path: polygon(20px 0, 100% 0, 100% 100%, 0 100%, 0 20px)

          // 秋
          &.autumn
            background: linear-gradient(135deg, #FFD700, #FFC700)
            clip-path: polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)

          // 冬（右下）
          &.winter
            background: linear-gradient(135deg, #B0E0E6, #9ACFDB)
            clip-path: polygon(20px 0, 100% 0, 100% 100%, 0 100%, 0 20px)

          > .strip_tab
            flex: 0 0 64px
            display: flex
            flex-direction: column
            align-items: center
            justify-content: center
            > h3
              font-size: 42px
              writing-mode: vertical-rl
              text-orientation: upright
              letter-spacing: 4px
              color: #fff
              text-shadow: 1px 1px 3px rgba(0,0,0,0.3)
              margin: 0
            > span
              font-size: 13px
              writing-mode: vertical-rl
              color: rgba(255,255,255,0.85)
              letter-spacing: 1px
              margin-top: 6px

          > .strip_images
            flex: 1
            display: flex
            flex-direction: row
            gap: 8px
            align-items: center
            overflow: hidden

            &.reverse
              justify-content: flex-end

            > .thumb
              flex: 0 0 auto
              width: calc(33% - 6px)
              aspect-ratio: 1
              border-radius: 6px
              overflow: hidden
              box-shadow: 0 2px 8px rgba(0,0,0,0.15)
              > img
                width: 100%
                height: 100%
                object-fit: cover
                transition: transform 0.3s ease
              &:hover > img
                transform: scale(1.08)

            > .coming_soon
              font-size: 13px
              color: rgba(255,255,255,0.9)
              font-weight: 600
              text-shadow: 0 1px 3px rgba(0,0,0,0.3)

      // はみ出し季節ラベル（Box2右端の露出エリア）
      > .peek_labels
        position: absolute
        right: 0
        top: 0
        width: 160px
        height: 100%
        display: flex
        flex-direction: column
        z-index: 5
        > .peek_season
          flex: 1
          display: flex
          align-items: center
          justify-content: center
          writing-mode: vertical-rl
          text-orientation: upright
          font-size: 42px
          color: #fff
          text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.35)
          cursor: pointer
          transition: filter 0.2s ease
          letter-spacing: 4px
          &:hover
            filter: brightness(1.12)
          &.autumn
            background: #FFD700
          &.winter
            background: #B0E0E6

      // オープン表示
      > .open_layout
        position: absolute
        inset: 0
        display: block
        z-index: 10

        &.spring
          background: rgba(255,183,197,0.95)
          backdrop-filter: blur(6px)
          -webkit-backdrop-filter: blur(6px)
        &.summer
          background: rgba(144,238,144,0.95)
          backdrop-filter: blur(6px)
          -webkit-backdrop-filter: blur(6px)
        &.autumn
          background: rgba(255,215,0,0.95)
          backdrop-filter: blur(6px)
          -webkit-backdrop-filter: blur(6px)
        &.winter
          background: rgba(176,224,230,0.95)
          backdrop-filter: blur(6px)
          -webkit-backdrop-filter: blur(6px)

        // 閉じるボタン（左上オーバーレイ）
        > .open_tab
          position: absolute
          top: 12px
          left: 12px
          z-index: 2
          display: flex
          flex-direction: row
          align-items: center
          gap: 16px
          cursor: pointer
          background: rgba(0,0,0,0.18)
          border-radius: 40px
          padding: 12px 28px 12px 20px
          transition: background 0.2s ease
          &:hover
            background: rgba(0,0,0,0.32)
          > h3
            font-size: 40px
            color: #fff
            text-shadow: 1px 1px 3px rgba(0,0,0,0.4)
            margin: 0
          > .close_hint
            font-size: 28px
            color: rgba(255,255,255,0.95)

        // 画像はボックス全体を使う
        > .open_content
          position: absolute
          inset: 0
          display: flex
          flex-direction: row
          gap: 16px
          padding: 60px 20px 20px
          overflow-x: auto
          align-items: center
          -webkit-overflow-scrolling: touch

          &::-webkit-scrollbar
            height: 6px
          &::-webkit-scrollbar-track
            background: rgba(255,255,255,0.3)
            border-radius: 3px
          &::-webkit-scrollbar-thumb
            background: rgba(255,255,255,0.6)
            border-radius: 3px

          > .open_card
            flex: 0 0 auto
            width: calc(33% - 16px)
            cursor: pointer
            > .open_img_wrap
              width: 100%
              aspect-ratio: 1
              border-radius: 8px
              overflow: hidden
              box-shadow: 0 4px 16px rgba(0,0,0,0.2)
              background: rgba(255,255,255,0.3)
              > img
                width: 100%
                height: 100%
                object-fit: contain
                transition: transform 0.3s ease
              &:hover > img
                transform: scale(1.05)
            > .img_name
              font-size: 13px
              color: #fff
              text-shadow: 0 1px 3px rgba(0,0,0,0.4)
              margin-top: 6px
              text-align: center
              line-height: 1.4

          > .coming_soon_lg
            font-size: 18px
            color: #fff
            text-shadow: 0 1px 4px rgba(0,0,0,0.3)
            font-weight: 600
            padding: 20px

  // オープントランジション（左からスライドイン）
  .season-open-enter-active
    animation: slide-in-left 0.4s ease
  .season-open-leave-active
    animation: slide-in-left 0.3s ease reverse

  @keyframes slide-in-left
    from
      transform: translateX(-100%)
      opacity: 0
    to
      transform: translateX(0)
      opacity: 1

  // テキストエリア
  > .hero_text
    max-width: 926px
    margin: 0 auto
    padding: 32px 0
    font-size: 28px
    line-height: 48px
    color: #444
    > p
      margin: 0 0 12px 0
    > .heritage_link
      font-weight: 600
      > a
        color: $MAIN_COLOR

  > .loading_wrapper,
  > .error_wrapper
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center
    min-height: 200px
    padding: 40px
    > .loading_text,
    > .error_text
      font-size: 18px
      color: #666
      margin-bottom: 20px
    > .retry_button
      padding: 12px 24px
      background-color: $MAIN_COLOR
      color: #fff
      border: none
      border-radius: 6px
      font-size: 16px
      cursor: pointer
      &:hover
        background-color: darken($MAIN_COLOR, 10%)

@media screen and (max-width: 1024px)
  .section_heading_center
    font-size: 28px
    padding: 24px $VIEW_PADDING_SP 16px

  .heritage_trees_develop_wrapper
    > .top_image_panel
      max-height: 220px

    > .main_layout
      height: 660px
      > .season_box
        &:first-child
          height: 640px
        &:last-child
          height: 640px
    > .hero_text
      padding: 20px $VIEW_PADDING_SP
      font-size: 15px
      line-height: 26px
</style>
