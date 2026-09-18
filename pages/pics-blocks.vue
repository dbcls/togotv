<template>
  <div class="blocks_wrapper">
    <div class="blocks_bg" aria-hidden="true">
      <img
        v-for="(d, i) in bgDecors"
        :key="i"
        class="bg_leaf"
        :src="imgUrl(d.png)"
        :style="d.style"
        alt=""
      />
    </div>
    <h1 class="blocks_title mont bold">Togo Picture block-kuzushi</h1>
    <p class="blocks_subtitle">Togo picture gallery のイラストを落とすブロックくずしです</p>

    <div v-if="loading" class="loading_box">
      <div class="loading_spinner"></div>
      <p>イラストを読み込んで分類中…</p>
    </div>

    <div v-else class="blocks_main">
      <div class="board_panel">
        <div
          class="board"
          :style="{ width: COLS * CELL + 'px', height: ROWS * CELL + 'px' }"
        >
          <div
            v-for="(row, r) in displayGrid"
            :key="r"
            class="board_row"
          >
            <div
              v-for="(cell, c) in row"
              :key="c"
              :class="['board_cell', { filled: !!cell, erasing: isErasing(r, c) }]"
              :style="cellStyle(cell)"
            ></div>
          </div>

          <!-- ブロックくずし(4ライン同時消し)演出: カエルが左から右へピョンピョン跳ねて消していく -->
          <img
            v-if="blocksClear.active"
            class="frog_sprite"
            :class="{ hop: frogHop }"
            :src="FROG_PNG"
            :style="frogStyle"
            alt="frog"
          />
          <div v-if="blocksClear.active" class="blocks_banner tsukushi bold">んなぁ〜。ふわっふわのぬぐるみだよぉ〜</div>

          <div v-if="gameOver" class="game_over_overlay">
            <p class="go_title mont bold">GAME OVER</p>
            <p class="go_score">Score: {{ score }} (Lv.{{ level }})</p>
            <template v-if="!justSaved">
              <p v-if="$auth.loggedIn" class="go_login_hint">{{ userName }} として登録します</p>
              <input
                v-else
                v-model="playerName"
                class="go_name_input"
                type="text"
                placeholder="お名前（ニックネーム）"
                maxlength="20"
                @keydown.stop
              />
              <input
                v-model="playerEmail"
                class="go_email_input"
                type="email"
                placeholder="連絡先メール（任意・賞品連絡用）"
                maxlength="60"
                @keydown.stop
              />
              <button class="go_save" :disabled="saving" @click="saveScore">
                {{ saving ? '登録中…' : 'ランキングに登録' }}
              </button>
              <p class="go_login_hint_small">
                {{ $auth.loggedIn ? 'メールは賞品連絡のみに使用します' : 'ログイン不要。メールは賞品連絡のみに使用します' }}
              </p>
              <p v-if="saveError" class="go_save_error">{{ saveError }}</p>
            </template>
            <p v-else class="go_saved">登録しました！</p>
            <button class="go_restart" @click="restart">もう一度遊ぶ</button>
          </div>
          <div v-if="!isRunning && !gameOver" class="start_overlay" @click="start">
            <p>クリックしてスタート</p>
          </div>
        </div>
      </div>

      <div class="side_panel">
        <div class="side_col">
          <div class="score_box">
            <p class="score_label">SCORE</p>
            <p class="score_value mont">{{ score }}</p>
            <p class="score_label">LEVEL</p>
            <p class="score_value mont">{{ level }} <span class="level_max">/ {{ MAX_LEVEL }}</span></p>
            <p class="score_label">LINES</p>
            <p class="score_value mont">{{ linesCleared }}</p>
          </div>

          <div class="next_box">
            <p class="next_label">NEXT</p>
            <div class="next_preview">
              <img v-if="nextQueue[0]" :src="imgUrl(nextQueue[0].png)" :alt="nextQueue[0].name" />
              <span v-if="nextQueue[0]" class="next_type">{{ nextQueue[0].type }}</span>
            </div>
          </div>

          <div class="current_box" v-if="current">
            <p class="next_label">NOW FALLING</p>
            <p class="current_name tsukushi">{{ current.name }}</p>
          </div>

          <div class="promo_box">
            <p class="promo_head tsukushi bold">🐸 トーゴーの日 SPECIAL</p>
            <div class="promo_catch_wrap">
              <img class="promo_frog" :src="FROG_PNG" alt="カエル" />
              <p class="promo_catch tsukushi">
                ハイスコアの優勝者にはトーゴーの日のTogoTVポスターにお越しいただくと、編集長から素敵じゃない景品をお渡しします✨
              </p>
            </div>
            <p class="promo_deadline mont bold">登録は 9/24 まで！</p>
            <div class="promo_event">
              <p><span class="promo_label">名称</span><a href="https://biosciencedbc.jp/event/symposium/togo2026/" target="_blank" rel="noopener">トーゴーの日シンポジウム2026</a></p>
              <p><span class="promo_label">日時</span>2026年10月5日 (月) 09:30〜17:10</p>
              <p><span class="promo_label">会場</span>品川ザ・グランドホール (東京都港区港南2-16-4)</p>
              <p><span class="promo_label">参加費</span>無料 (※意見交換会は要参加費)</p>
            </div>
            <p class="promo_disclaimer">※このプロモーションは非公式です。カエル氏が独断で行うものです。</p>
          </div>
        </div>

        <div class="side_col">
          <div class="auth_box">
            <template v-if="$auth.loggedIn">
              <img v-if="userPicture" class="auth_icon" :src="userPicture" :alt="userName" />
              <span class="auth_name tsukushi">{{ userName }}</span>
            </template>
            <template v-else>
              <p class="auth_hint">スコア登録はログイン不要。ログインするとGoogleの名前で登録できます（任意）</p>
              <button class="auth_login" @click="login">Google でログイン</button>
            </template>
          </div>

          <div class="bgm_box">
            <p class="next_label">サウンド</p>
            <button class="bgm_toggle" @click="toggleMute">
              <span class="bgm_icon">{{ muted ? '🔇' : '🔊' }}</span>
              {{ muted ? '無音' : 'ON' }}
            </button>
          </div>

          <div class="controls_box">
            <p class="controls_title">操作方法</p>
            <ul>
              <li>← → : 移動</li>
              <li>↓ : ソフトドロップ</li>
              <li>↑ : 一気に落とす</li>
              <li>Space : 回転</li>
            </ul>
          </div>

          <div class="ranking_box" v-if="rankings.length || rankingLoading">
            <p class="next_label">RANKING <span class="rk_top">TOP 10</span></p>
            <p v-if="rankingLoading" class="ranking_status">読み込み中…</p>
            <ol class="ranking_list" v-else>
              <li v-for="(rk, i) in rankings.slice(0, 10)" :key="i" :class="{ rk_win: i === 0 }">
                <div class="rk_main">
                  <span class="rk_no">{{ i + 1 }}</span>
                  <span class="rk_name tsukushi">{{ rk.name }}</span>
                  <span class="rk_score mont">{{ rk.score }}</span>
                </div>
                <div class="rk_date" v-if="rk.date">{{ formatDate(rk.date) }}</div>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>

    <p v-if="!loading" class="blocks_credit">
      イラスト: Togo picture gallery © DBCLS TogoTV（<a href="https://creativecommons.org/licenses/by/4.0/deed.ja" target="_blank" rel="noopener">CC BY 4.0</a>）
    </p>
    <p v-if="!loading" class="blocks_credit">
      Music: Original song by Masaki Suimye Morioka / Off-vocal version generated by DeevidAI / Final track down by Masaki Suimye Morioka
    </p>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'

const COLS = 10
const ROWS = 18
const CELL = 36
const MAX_LEVEL = 9
const LINES_PER_LEVEL = 6
// レベルごとの落下間隔(ms)。level(1..9)で index する。速すぎず「9で高難度」になるよう手調整
const LEVEL_INTERVALS = [820, 820, 660, 530, 420, 340, 270, 210, 160, 120]
// 同時消しライン数ごとの基礎点。4ライン(ブロックくずし)を突出して高くし「綺麗に崩すほど高得点」にする
const LINE_POINTS = [0, 100, 300, 600, 1200]
// レベルが上がるほど、少しだけ消せた時(1〜2ライン)のポイントも伸びるようにする一律加算ボーナス。
// ライン数に依らず (level-1) に比例して加算するので、小さな消しほど相対的に効く。
const LEVEL_CLEAR_BONUS = 60
const PERFECT_CLEAR_BONUS = 3000
// 直線(I)ピースの出現率: レベルが低いほど高く(易しい)、高いほど低い(難しい)
const I_RATE_BASE = 0.24   // レベル1での直線出現率
const I_RATE_STEP = 0.02   // レベルが1上がるごとに減る量
const I_RATE_MIN = 0.06    // 高レベルでの下限
const RANKING_KEY = 'togo_picture_blocks_rankings'
const MUTE_KEY = 'togo_picture_blocks_muted'
const RANKING_MAX = 10

// BGM 音源(あとで差し替え)。static/audio に置くと /audio/... で配信される。
// 音量は控えめ(うるさくならないように)。ファイルが無くてもゲームは動く。
const BGM_SRC = '/audio/blocks_bgm.mp3'
const BGM_VOLUME = 0.2

// ブロックくずし演出で使うカエル(サンタ帽カエル / static/img に配置したオリジナル画像)
const FROG_PNG = '/img/blocks_frog.png'

// Google Apps Script Web App のURL。デプロイ後にここへ貼る。
// 空のあいだは localStorage だけで動作する(共有ランキングは無効)。
// 手順: docs/blocks-ranking-gas.md 参照
const RANKING_ENDPOINT = 'https://script.google.com/macros/s/AKfycbw9yvrVRXu2sBi5--kke9tzdZyjS1IRfYBu012u6gycR31LpUzfBTiTQvAz_0y0Rf1E/exec'

// 4x4グリッドで表現したブロック（スポーン時の形）
const SHAPES = {
  I: [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
  O: [[0,0,0,0],[0,1,1,0],[0,1,1,0],[0,0,0,0]],
  T: [[0,0,0,0],[0,1,0,0],[1,1,1,0],[0,0,0,0]],
  S: [[0,0,0,0],[0,1,1,0],[1,1,0,0],[0,0,0,0]],
  Z: [[0,0,0,0],[1,1,0,0],[0,1,1,0],[0,0,0,0]],
  J: [[0,0,0,0],[1,0,0,0],[1,1,1,0],[0,0,0,0]],
  L: [[0,0,0,0],[0,0,1,0],[1,1,1,0],[0,0,0,0]],
}

// ファイル名から安定したハッシュ値(FNV-1a)を作る。
// 同じ画像は毎回同じ形になるが、正方形クラスタを複数の形に振り分けるのに使う。
function hashString(s) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

// 画像の縦横比(幅/高さ)からブロックの種類を分類する。
// Togo picture の実データは縦横比≈1.0(正方形)に大きく偏り、素直に分類すると
// O(四角)ばかりで「形が一緒すぎる」ため、正方形〜中間帯はファイル名ハッシュで
// 凹凸型(S/Z/T)・L型(L/J)へ意図的に散らして変化を増やす。
// (I=線, O=四角 は単調なので控えめにする)
function classifyShape(ratio, png) {
  const h = hashString(png || '')
  const r = (!ratio || isNaN(ratio)) ? 1.0 : ratio
  if (r < 0.42) return 'I'                          // はっきり縦長 → I(線)
  if (r > 2.4) return 'I'                           // はっきり横長 → I(線)
  if (r < 0.62) return ['J', 'L', 'I'][h % 3]       // 縦長 → L型(たまにI:4ライン消し用)
  if (r < 0.86) return ['S', 'Z', 'T', 'S', 'Z', 'T', 'S', 'I'][h % 8] // やや縦 → 凹凸型(一部を直線Iに回して線ピースの種類を増やす)
  if (r <= 1.2) return ['T', 'L', 'J', 'S', 'Z', 'O'][h % 6] // 正方形(最多帯) → 凹凸・L中心に散らす(Oは1/6)
  if (r <= 1.5) return ['T', 'L', 'J'][h % 3]       // やや横 → T/L型
  if (r <= 2.0) return ['S', 'Z'][h % 2]            // 横長 → 凹凸型
  return ['J', 'L', 'I'][h % 3]                     // かなり横長 → L型(たまにI)
}

// 個別の手動補正: ファイル全体の縦横比だと透明余白の影響で誤分類される画像を、
// 実際にトリミングして計測した縦横比・形状で上書きする（アユで検証中）
const MANUAL_OVERRIDES = {
  '202603_Plecoglossus_altivelis_altivelis.png': { type: 'I', ratio: 3.0 }, // アユ: 生ファイルの縦横比は1.41(→Z判定)だが、
                                                                             // 背景除去後の実際の魚体は横長(縦横比3.0)で「I」が正しい
}

function rotateMatrix(mat) {
  const n = mat.length
  const res = Array.from({ length: n }, () => Array(n).fill(0))
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      res[c][n - 1 - r] = mat[r][c]
    }
  }
  return res
}

function filledCells(matrix) {
  const cells = []
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      if (matrix[r][c]) cells.push([r, c])
    }
  }
  return cells
}

function bboxOf(matrix) {
  const cells = filledCells(matrix)
  const rows = cells.map(([r]) => r)
  const cols = cells.map(([, c]) => c)
  return {
    minR: Math.min(...rows),
    maxR: Math.max(...rows),
    minC: Math.min(...cols),
    maxC: Math.max(...cols),
  }
}

// イラストを歪めず・欠けさせずに表示するため、ピースの境界ボックスに
// object-fit:contain 相当で収め、中央寄せしてからセルごとに切り出す
function pieceCellStyles(matrix, png, name, ratio) {
  const { minR, maxR, minC, maxC } = bboxOf(matrix)
  const bboxCols = maxC - minC + 1
  const bboxRows = maxR - minR + 1
  const bboxW = bboxCols * CELL
  const bboxH = bboxRows * CELL
  const safeRatio = ratio && !isNaN(ratio) ? ratio : bboxW / bboxH

  let drawW, drawH
  if (safeRatio >= bboxW / bboxH) {
    drawW = bboxW
    drawH = bboxW / safeRatio
  } else {
    drawH = bboxH
    drawW = bboxH * safeRatio
  }
  const centerOffsetX = (bboxW - drawW) / 2
  const centerOffsetY = (bboxH - drawH) / 2

  const styles = {}
  filledCells(matrix).forEach(([r, c]) => {
    const localC = c - minC
    const localR = r - minR
    styles[`${r},${c}`] = {
      png, name,
      bgW: drawW,
      bgH: drawH,
      offX: localC * CELL - centerOffsetX,
      offY: localR * CELL - centerOffsetY,
    }
  })
  return styles
}

export default Vue.extend({
  head() {
    return { title: 'Togo Picture block-kuzushi' }
  },
  data() {
    return {
      COLS,
      ROWS,
      CELL,
      MAX_LEVEL,
      FROG_PNG,
      // 背景を彩る Heritage Trees(京都府立植物園/KBG) のイラスト。淡く散らす。
      bgDecors: [
        { png: '202608_cerasus_itosakura_f._itosakura_flower.png', style: 'top: 2%; right: 2%; width: 200px; transform: rotate(-8deg)' },
        { png: '202607_cornus_florida_flower.png', style: 'top: 34%; right: 0.5%; width: 150px; transform: rotate(9deg)' },
        { png: '202603_metasequoia_glyptostroboides_fallen_leaves.png', style: 'bottom: 5%; right: 6%; width: 175px; transform: rotate(6deg)' },
        { png: '202603_liquidambar_formosana_fallen_leaves.png', style: 'bottom: 3%; left: 1.5%; width: 165px; transform: rotate(-11deg)' },
        { png: '202606_hamamelis_mollis_flower.png', style: 'top: 16%; left: 0.5%; width: 130px; transform: rotate(8deg)' },
        { png: '202603_sequoia_sempervirens_leaves.png', style: 'bottom: 32%; left: 1.5%; width: 140px; transform: rotate(-5deg)' },
      ],
      loading: true,
      isRunning: false,
      gameOver: false,
      board: Array.from({ length: ROWS }, () => Array(COLS).fill(null)),
      current: null,
      nextQueue: [],
      imagePool: [],
      score: 0,
      linesCleared: 0,
      level: 1,
      dropInterval: LEVEL_INTERVALS[1],
      timerId: null,
      rankings: [],
      rankingLoading: false,
      justSaved: false,
      saving: false,
      saveError: '',
      playerName: '',
      playerEmail: '',
      muted: false,
      // ブロックくずし(4ライン)演出用の状態。erased = 左から消えた列数(0..COLS)
      blocksClear: { active: false, rows: [], erased: 0 },
      frogHop: false,
    }
  },
  computed: {
    userName() {
      const u = this.$auth && this.$auth.user
      return (u && (u.name || u.email)) || 'プレイヤー'
    },
    userPicture() {
      const u = this.$auth && this.$auth.user
      return (u && u.picture) || ''
    },
    frogStyle() {
      const rows = this.blocksClear.rows
      const minR = rows.length ? Math.min(...rows) : 0
      return {
        top: (minR * CELL - CELL * 0.9) + 'px',
        left: (this.blocksClear.erased * CELL - CELL * 0.8) + 'px',
      }
    },
    displayGrid() {
      const grid = this.board.map(row => row.slice())
      if (this.current) {
        const { matrix, row, col, png, name, ratio } = this.current
        const styles = pieceCellStyles(matrix, png, name, ratio)
        filledCells(matrix).forEach(([r, c]) => {
          const br = row + r
          const bc = col + c
          if (br >= 0 && br < ROWS && bc >= 0 && bc < COLS) {
            grid[br][bc] = styles[`${r},${c}`]
          }
        })
      }
      return grid
    },
  },
  async mounted() {
    window.addEventListener('keydown', this.handleKey)
    this.initBgm()
    if (this.$auth && this.$auth.loggedIn && !(this.$auth.user && this.$auth.user.name)) {
      // autoFetch: false のため、ログイン済みでも user 未取得のことがある
      try { await this.$auth.fetchUser() } catch (e) { /* ignore */ }
    }
    await this.fetchRanking()
    await this.loadImagePool()
    this.loading = false
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.handleKey)
    if (this.timerId) clearInterval(this.timerId)
    if (this._bgm) {
      this._bgm.pause()
      this._bgm = null
    }
    if (this._sfxCtx) {
      try { this._sfxCtx.close() } catch (e) { /* ignore */ }
      this._sfxCtx = null
    }
  },
  methods: {
    imgUrl(png) {
      return `https://dbarchive.biosciencedbc.jp/data/togo-pic/image/${png}`
    },
    cellStyle(cell) {
      if (!cell) return {}
      const style = {
        backgroundImage: `url(${this.imgUrl(cell.png)})`,
        backgroundSize: `${cell.bgW}px ${cell.bgH}px`,
        backgroundPosition: `${-cell.offX}px ${-cell.offY}px`,
      }
      // 積み上げて固定されたブロックは背景を白くして「着地済み」を分かりやすくする
      if (cell.locked) style.backgroundColor = '#ffffff'
      return style
    },
    isErasing(r, c) {
      const t = this.blocksClear
      return t.active && t.rows.indexOf(r) >= 0 && c < t.erased
    },

    // ---------- BGM ----------
    initBgm() {
      try {
        this.muted = window.localStorage.getItem(MUTE_KEY) === '1'
      } catch (e) { this.muted = false }
      try {
        this._bgm = new Audio(BGM_SRC)
        this._bgm.loop = true
        this._bgm.volume = BGM_VOLUME
        this._bgm.muted = this.muted
      } catch (e) {
        this._bgm = null
      }
    },
    playBgm() {
      if (!this._bgm || this.muted) return
      // start(クリック)というユーザー操作起点なので自動再生ポリシー的にOK。
      // 音源未配置などで失敗しても握りつぶす。
      const p = this._bgm.play()
      if (p && p.catch) p.catch(() => {})
    },
    toggleMute() {
      this.muted = !this.muted
      try { window.localStorage.setItem(MUTE_KEY, this.muted ? '1' : '0') } catch (e) { /* ignore */ }
      if (this._bgm) {
        this._bgm.muted = this.muted
        if (!this.muted && this.isRunning) this.playBgm()
      }
    },
    // ライン消し時の効果音「キョロロン」。Web Audio APIで軽いベル音を数個鳴らす(外部ファイル不要)。
    // 無音モード中は鳴らさない。
    playClearSfx() {
      if (this.muted) return
      try {
        const AC = window.AudioContext || window.webkitAudioContext
        if (!AC) return
        if (!this._sfxCtx) this._sfxCtx = new AC()
        const ctx = this._sfxCtx
        if (ctx.state === 'suspended') ctx.resume()
        const now = ctx.currentTime
        // 「キョ・ロ・ロン」= 明るいベルが軽く転がる感じ(下→上の小さな揺れ)
        const notes = [1318.5, 1046.5, 1318.5, 1568.0] // E6, C6, E6, G6
        notes.forEach((f, i) => {
          const t = now + i * 0.07
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = 'triangle'
          osc.frequency.setValueAtTime(f, t)
          gain.gain.setValueAtTime(0.0001, t)
          gain.gain.exponentialRampToValueAtTime(0.22, t + 0.006)
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.19)
          osc.connect(gain).connect(ctx.destination)
          osc.start(t)
          osc.stop(t + 0.22)
        })
      } catch (e) { /* ignore audio errors */ }
    },

    // ---------- 認証 ----------
    login() {
      if (this.$auth) this.$auth.loginWith('google')
    },

    // ---------- 画像プール ----------
    async loadImagePool() {
      try {
        const res = await axios.get('https://togotv-api.dbcls.jp/api/entries', {
          params: { target: 'pictures', from: 1, rows: 60 },
        })
        const items = (res.data && res.data.data) || []
        const loaded = await Promise.all(items.map(item => this.classifyOne(item)))
        this.imagePool = loaded.filter(Boolean)
      } catch (e) {
        console.log('image pool load error', e)
        this.imagePool = []
      }
      if (this.imagePool.length === 0) {
        // フォールバック: 分類できなくてもOピースだけで遊べるようにする
        this.imagePool = [{ png: null, name: 'no image', type: 'O' }]
      }
      this.refillQueue()
    },
    classifyOne(item) {
      return new Promise(resolve => {
        if (!item.png || item.png === '-') {
          resolve(null)
          return
        }
        const img = new Image()
        const override = MANUAL_OVERRIDES[item.png]
        const done = ratio => {
          const finalRatio = override ? override.ratio : ratio
          resolve({
            png: item.png,
            name: item.name || item.name_en || '',
            type: override ? override.type : classifyShape(ratio, item.png),
            ratio: finalRatio,
            _tall: finalRatio < 1,
          })
        }
        const timer = setTimeout(() => done(NaN), 4000)
        img.onload = () => {
          clearTimeout(timer)
          done(img.naturalWidth / img.naturalHeight)
        }
        img.onerror = () => {
          clearTimeout(timer)
          resolve(null)
        }
        img.src = this.imgUrl(item.png)
      })
    },
    refillQueue() {
      while (this.nextQueue.length < 3) {
        this.nextQueue.push(this.pickWeighted())
      }
    },
    // ピースを1つ選ぶ。直線(I)は現在のレベルに応じた確率で優先的に出す
    // (低レベル=多め/易しい、高レベル=少なめ/難しい)。それ以外は均等抽選。
    pickWeighted() {
      const pool = this.imagePool
      if (!pool.length) return null
      const iPieces = pool.filter(p => p && p.type === 'I')
      const others = pool.filter(p => p && p.type !== 'I')
      const pI = Math.max(I_RATE_MIN, I_RATE_BASE - (this.level - 1) * I_RATE_STEP)
      if (iPieces.length && others.length && Math.random() < pI) {
        return iPieces[Math.floor(Math.random() * iPieces.length)]
      }
      const src = others.length ? others : pool
      return src[Math.floor(Math.random() * src.length)]
    },
    spawnPiece() {
      this.refillQueue()
      const picked = this.nextQueue.shift()
      let matrix = SHAPES[picked.type].map(row => row.slice())
      // 縦長I/横長Iは見た目の向きに合わせてスポーン時から回転させる
      if (picked.type === 'I' && picked._tall) {
        matrix = rotateMatrix(matrix)
      }
      const piece = {
        type: picked.type,
        matrix,
        png: picked.png,
        name: picked.name,
        ratio: picked.ratio,
        // row -1 でスポーンし、埋まったセル(行1-2)を最上段(row 0)から積めるようにする
        row: -1,
        col: Math.floor(COLS / 2) - 2,
      }
      if (!this.canPlace(piece.matrix, piece.row, piece.col)) {
        this.endGame()
        return
      }
      this.current = piece
    },
    canPlace(matrix, row, col) {
      return filledCells(matrix).every(([r, c]) => {
        const br = row + r
        const bc = col + c
        if (bc < 0 || bc >= COLS || br >= ROWS) return false
        if (br < 0) return true
        return !this.board[br][bc]
      })
    },
    start() {
      if (this.gameOver) this.restart()
      this.isRunning = true
      if (!this.current) this.spawnPiece()
      if (this.timerId) clearInterval(this.timerId)
      this.timerId = setInterval(this.tick, this.dropInterval)
      this.playBgm()
    },
    restart() {
      this.board = Array.from({ length: ROWS }, () => Array(COLS).fill(null))
      this.current = null
      this.score = 0
      this.linesCleared = 0
      this.level = 1
      this.gameOver = false
      this.justSaved = false
      this.saving = false
      this.saveError = ''
      this.blocksClear = { active: false, rows: [], erased: 0 }
      this.frogHop = false
      this.dropInterval = LEVEL_INTERVALS[1]
      this.start()
    },
    endGame() {
      this.gameOver = true
      this.isRunning = false
      if (this.timerId) clearInterval(this.timerId)
      if (this._bgm) this._bgm.pause()
      // ログイン済みなら連絡先メールにGoogleのメールを初期表示(編集可)
      const u = this.$auth && this.$auth.user
      if (u && u.email && !this.playerEmail) this.playerEmail = u.email
    },
    tick() {
      if (!this.isRunning || this.gameOver || !this.current) return
      this.moveDown()
    },
    moveDown() {
      if (!this.current) return
      const { matrix, row, col } = this.current
      if (this.canPlace(matrix, row + 1, col)) {
        this.current.row += 1
      } else {
        this.lockPiece()
      }
    },
    async lockPiece() {
      const { matrix, row, col, png, name, ratio } = this.current
      const styles = pieceCellStyles(matrix, png, name, ratio)
      filledCells(matrix).forEach(([r, c]) => {
        const br = row + r
        const bc = col + c
        if (br >= 0 && br < ROWS && bc >= 0 && bc < COLS) {
          // locked: true を付けて「積み上げ済み(背景白)」として描画する
          this.board[br][bc] = { ...styles[`${r},${c}`], locked: true }
        }
      })
      // 箱の最上階(row 0)を超えて上にはみ出したセルがあれば = 超えた → ゲームオーバー
      const overflowed = filledCells(matrix).some(([r]) => row + r < 0)
      this.current = null

      const fullRows = this.getFullRows()
      if (fullRows.length > 0) this.playClearSfx() // 消した瞬間に「キョロロン」
      if (fullRows.length === 4) {
        // ブロックくずし: カエル演出のあいだ盤面を保持して見せてから崩す
        await this.runBlocksClear(fullRows)
      }
      this.collapseRows(fullRows)

      if (overflowed) {
        this.endGame()
        return
      }
      this.spawnPiece()
    },
    getFullRows() {
      const rows = []
      for (let r = 0; r < ROWS; r++) {
        if (this.board[r].every(cell => !!cell)) rows.push(r)
      }
      return rows
    },
    runBlocksClear(fullRows) {
      return new Promise(resolve => {
        this.blocksClear = { active: true, rows: fullRows.slice(), erased: 0 }
        this.frogHop = true
        const stepMs = 80
        const iv = setInterval(() => {
          this.blocksClear.erased += 1
          if (this.blocksClear.erased >= COLS) {
            clearInterval(iv)
            setTimeout(() => {
              this.frogHop = false
              this.blocksClear = { active: false, rows: [], erased: 0 }
              resolve()
            }, 240)
          }
        }, stepMs)
      })
    },
    collapseRows(fullRows) {
      const cleared = fullRows.length
      if (cleared === 0) return
      const fullSet = new Set(fullRows)
      const remaining = this.board.filter((row, r) => !fullSet.has(r))
      const newRows = Array.from({ length: cleared }, () => Array(COLS).fill(null))
      this.board = newRows.concat(remaining)

      this.linesCleared += cleared
      // 基礎点×レベル に加え、レベル依存の一律ボーナスを足す。
      // 一律ボーナスは消したライン数に依らないので、少しだけ消せた時(1〜2ライン)ほど
      // 相対的に効いて、高レベルでは小さな消しでもポイントが伸びる。
      this.score += LINE_POINTS[Math.min(cleared, 4)] * this.level + LEVEL_CLEAR_BONUS * (this.level - 1)
      // パーフェクトクリア(盤面が空になった)ボーナス = 綺麗に崩せた最上位のご褒美
      if (this.board.every(row => row.every(cell => !cell))) {
        this.score += PERFECT_CLEAR_BONUS * this.level
      }
      this.updateLevel()
    },
    updateLevel() {
      // 消したライン数でレベルアップ(9で頭打ち)。レベルごとに落下が速くなる
      const newLevel = Math.min(MAX_LEVEL, Math.floor(this.linesCleared / LINES_PER_LEVEL) + 1)
      if (newLevel === this.level) return
      this.level = newLevel
      this.dropInterval = LEVEL_INTERVALS[newLevel]
      if (this.timerId) {
        clearInterval(this.timerId)
        this.timerId = setInterval(this.tick, this.dropInterval)
      }
    },

    // ---------- ランキング ----------
    async fetchRanking() {
      if (RANKING_ENDPOINT) {
        this.rankingLoading = true
        try {
          const controller = new AbortController()
          const to = setTimeout(() => controller.abort(), 8000)
          const res = await fetch(`${RANKING_ENDPOINT}?action=list`, { signal: controller.signal })
          clearTimeout(to)
          const json = await res.json()
          const list = Array.isArray(json) ? json : (json.data || [])
          this.rankings = list
            .map(r => ({ name: r.name || '名無し', score: Number(r.score) || 0, date: r.date || '' }))
            .sort((a, b) => b.score - a.score)
            .slice(0, RANKING_MAX)
          this.rankingLoading = false
          return
        } catch (e) {
          console.log('ranking fetch error, fallback to local', e)
          this.rankingLoading = false
        }
      }
      this.loadLocalRanking()
    },
    loadLocalRanking() {
      try {
        const raw = window.localStorage.getItem(RANKING_KEY)
        const list = raw ? JSON.parse(raw) : []
        this.rankings = list.sort((a, b) => b.score - a.score).slice(0, RANKING_MAX)
      } catch (e) {
        this.rankings = []
      }
    },
    saveLocalRanking(entry) {
      let list = []
      try {
        const raw = window.localStorage.getItem(RANKING_KEY)
        list = raw ? JSON.parse(raw) : []
      } catch (e) { list = [] }
      list.push(entry)
      list.sort((a, b) => b.score - a.score)
      list = list.slice(0, RANKING_MAX)
      try { window.localStorage.setItem(RANKING_KEY, JSON.stringify(list)) } catch (e) { /* ignore */ }
      this.rankings = list
    },
    formatDate(iso) {
      if (!iso) return ''
      const d = new Date(iso)
      if (isNaN(d.getTime())) return ''
      const p = n => String(n).padStart(2, '0')
      return `${d.getFullYear()}/${p(d.getMonth() + 1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
    },
    async saveScore() {
      if (this.saving) return
      // ログイン済みならGoogleの名前、未ログインなら入力したニックネームで登録(ログイン任意)
      const name = this.$auth && this.$auth.loggedIn
        ? this.userName
        : (this.playerName.trim() || '名無し')
      const entry = {
        name,
        score: this.score,
        level: this.level,
        lines: this.linesCleared,
        email: this.playerEmail.trim(), // 賞品連絡用(公開ランキングには出さない)
        date: new Date().toISOString(),
      }
      this.saving = true
      this.saveError = ''

      if (RANKING_ENDPOINT) {
        try {
          const controller = new AbortController()
          const to = setTimeout(() => controller.abort(), 8000)
          await fetch(RANKING_ENDPOINT, {
            method: 'POST',
            // text/plain にして CORS プリフライトを避ける(GAS Web App の定番)
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(entry),
            signal: controller.signal,
          })
          clearTimeout(to)
          await this.fetchRanking()
          this.justSaved = true
        } catch (e) {
          console.log('score save error', e)
          // 送信失敗時もローカルには残す
          this.saveLocalRanking(entry)
          this.saveError = 'サーバー登録に失敗したため、この端末にのみ保存しました'
          this.justSaved = true
        }
      } else {
        // エンドポイント未設定: ローカル保存のみ
        this.saveLocalRanking(entry)
        this.justSaved = true
      }
      this.saving = false
    },

    // ---------- 操作 ----------
    moveHorizontal(dir) {
      if (!this.current || this.gameOver || !this.isRunning) return
      const { matrix, row, col } = this.current
      if (this.canPlace(matrix, row, col + dir)) {
        this.current.col += dir
      }
    },
    rotate() {
      if (!this.current || this.gameOver || !this.isRunning) return
      const rotated = rotateMatrix(this.current.matrix)
      const { row, col } = this.current
      // 簡易ウォールキック: そのまま／左に1／右に1／上に1 の順で試す
      const kicks = [[0, 0], [0, -1], [0, 1], [-1, 0]]
      for (const [dr, dc] of kicks) {
        if (this.canPlace(rotated, row + dr, col + dc)) {
          this.current.matrix = rotated
          this.current.row = row + dr
          this.current.col = col + dc
          return
        }
      }
    },
    hardDrop() {
      if (!this.current || this.gameOver || !this.isRunning) return
      const { matrix, col } = this.current
      let row = this.current.row
      while (this.canPlace(matrix, row + 1, col)) row += 1
      this.current.row = row
      this.lockPiece()
    },
    handleKey(e) {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space'].includes(e.code)) {
        e.preventDefault()
      }
      if (e.code === 'ArrowLeft') this.moveHorizontal(-1)
      else if (e.code === 'ArrowRight') this.moveHorizontal(1)
      else if (e.code === 'ArrowDown') this.moveDown()
      else if (e.code === 'ArrowUp') this.hardDrop()
      else if (e.code === 'Space') this.rotate()
    },
  },
})
</script>

<style lang="sass">
.blocks_wrapper
  padding: 40px $VIEW_PADDING 80px
  position: relative
  overflow: hidden
  // 背景装飾(HTイラスト)レイヤー: コンテンツの後ろに淡く敷く
  > .blocks_bg
    position: absolute
    inset: 0
    z-index: 0
    overflow: hidden
    pointer-events: none
    > .bg_leaf
      position: absolute
      height: auto
      opacity: 0.14
      filter: saturate(0.85)
  // コンテンツは背景装飾より前面に
  > .blocks_title,
  > .blocks_subtitle,
  > .blocks_main,
  > .blocks_credit,
  > .loading_box
    position: relative
    z-index: 1
  > .blocks_title
    font-size: 32px
    color: $MAIN_COLOR
    margin: 0 0 8px
  > .blocks_subtitle
    font-size: 14px
    color: #666
    margin: 0 0 24px

  > .loading_box
    display: flex
    flex-direction: column
    align-items: center
    padding: 80px 0
    > .loading_spinner
      width: 40px
      height: 40px
      border: 4px solid rgba(0, 153, 153, 0.2)
      border-top-color: #009999
      border-radius: 50%
      animation: blocks-spin 0.75s linear infinite
      margin-bottom: 12px

  > .blocks_main
    display: flex
    gap: 32px
    align-items: flex-start
    justify-content: center
    max-width: 1100px
    margin: 0 auto

  > .blocks_credit
    margin: 20px 0 0
    font-size: 11px
    color: #999
    a
      color: #009999
    & + .blocks_credit
      margin-top: 4px

  .board_panel
    flex: 0 0 auto

  .board
    position: relative
    background: #1a1a2e
    border: 3px solid #444
    box-sizing: border-box

  .board_row
    display: flex

  .board_cell
    width: 36px
    height: 36px
    box-sizing: border-box
    border: 1px solid rgba(255, 255, 255, 0.05)
    background-color: transparent
    background-repeat: no-repeat
    &.filled
      border: 1px dashed rgba(255, 255, 255, 0.65)
    &.erasing
      opacity: 0
      transform: scale(0.4) rotate(15deg)
      transition: opacity 0.25s ease, transform 0.25s ease

  .frog_sprite
    position: absolute
    width: 54px
    height: auto
    z-index: 5
    pointer-events: none
    transition: left 0.08s linear
    filter: drop-shadow(0 3px 3px rgba(0, 0, 0, 0.4))
    &.hop
      animation: frog-hop 0.16s ease-in-out infinite alternate

  .blocks_banner
    position: absolute
    top: 10px
    left: 50%
    transform: translateX(-50%)
    z-index: 6
    width: 244px
    max-width: 90%
    box-sizing: border-box
    padding: 8px 14px
    background: rgba(255, 255, 255, 0.96)
    color: #e6537a
    font-size: 15px
    line-height: 1.4
    text-align: center
    border-radius: 16px
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.45)
    animation: blocks-banner-pop 0.3s ease
    pointer-events: none

  .game_over_overlay,
  .start_overlay
    position: absolute
    inset: 0
    display: flex
    flex-direction: column
    align-items: center
    justify-content: center
    background: rgba(0, 0, 0, 0.75)
    color: #fff
    text-align: center
    cursor: pointer
    z-index: 10

  .go_title
    font-size: 28px
    color: #ff5555
    margin: 0 0 8px
  .go_score
    font-size: 16px
    margin: 0 0 16px
  .go_login_hint
    font-size: 12px
    color: #ccc
    margin: 0 0 8px
  .go_login_hint_small
    font-size: 10px
    color: #999
    margin: 0 0 6px
  .go_name_input, .go_email_input
    width: 220px
    max-width: 84%
    padding: 7px 10px
    margin: 0 0 8px
    border: 1px solid #ccc
    border-radius: 4px
    font-size: 14px
    text-align: center
    box-sizing: border-box
  .go_save
    padding: 8px 20px
    background: #ffd93b
    color: #333
    border: none
    border-radius: 4px
    cursor: pointer
    font-size: 14px
    font-weight: bold
    margin-bottom: 10px
    &:disabled
      opacity: 0.6
      cursor: default
  .go_save_error
    font-size: 11px
    color: #ff9d9d
    margin: 0 0 8px
  .go_saved
    font-size: 15px
    color: #7fffb0
    margin: 0 0 12px
  .go_restart
    padding: 8px 20px
    background: $MAIN_COLOR
    color: #fff
    border: none
    border-radius: 4px
    cursor: pointer
    font-size: 14px

  // 情報パネルは明示的な2列。左列=ゲーム情報+告知、右列=アカウント+ランキング(伸びる)
  .side_panel
    flex: 0 0 472px
    display: flex
    gap: 18px
    align-items: flex-start
    > .side_col
      flex: 1 1 0
      min-width: 0
      display: flex
      flex-direction: column
      gap: 18px

  .score_box, .next_box, .current_box, .controls_box, .auth_box, .bgm_box, .ranking_box
    background: #f5f5f5
    border-radius: 6px
    padding: 14px 16px

  .score_label, .next_label, .controls_title
    font-size: 11px
    color: #999
    letter-spacing: 0.05em
    margin: 0 0 2px
  .score_value
    font-size: 26px
    font-weight: bold
    color: $MAIN_COLOR
    margin: 0 0 10px
    &:last-child
      margin-bottom: 0
    > .level_max
      font-size: 14px
      color: #aaa

  .auth_box
    display: flex
    align-items: center
    gap: 8px
    flex-wrap: wrap
    > .auth_icon
      width: 28px
      height: 28px
      border-radius: 50%
    > .auth_name
      font-size: 13px
      color: $DEEP_MAIN_COLOR
    > .auth_hint
      font-size: 12px
      color: #666
      margin: 0
      flex: 1 1 100%
    > .auth_login
      padding: 6px 14px
      background: $MAIN_COLOR
      color: #fff
      border: none
      border-radius: 4px
      cursor: pointer
      font-size: 12px

  .bgm_box
    display: flex
    align-items: center
    justify-content: space-between
    > .bgm_toggle
      padding: 6px 14px
      background: #fff
      border: 1px solid #ccc
      border-radius: 20px
      cursor: pointer
      font-size: 13px
      display: flex
      align-items: center
      gap: 6px
      > .bgm_icon
        font-size: 16px

  .ranking_status
    font-size: 12px
    color: #999
    margin: 6px 0 0
  .ranking_list
    list-style: none
    margin: 8px 0 0
    padding: 0
    counter-reset: none
    li
      padding: 5px 0
      border-bottom: 1px solid #e8e8e8
      font-size: 13px
      &:last-child
        border-bottom: none
    .rk_main
      display: flex
      align-items: center
      gap: 6px
    .rk_no
      width: 18px
      color: #999
      font-size: 12px
      text-align: right
    .rk_name
      flex: 1
      overflow: hidden
      text-overflow: ellipsis
      white-space: nowrap
      color: #333
    .rk_score
      font-weight: bold
      color: $MAIN_COLOR
    .rk_date
      margin: 1px 0 0 24px
      font-size: 10px
      color: #aaa
    li.rk_win
      .rk_no
        color: #e0a400
      .rk_name
        font-weight: bold
        color: #b5820a
      .rk_score
        color: #e0a400

  .rk_top
    font-size: 10px
    color: #e0a400
    font-weight: bold
    margin-left: 4px

  .promo_box
    background: linear-gradient(180deg, #fff7e6 0%, #ffeef4 100%)
    border: 1px solid #ffd98a
    border-radius: 8px
    padding: 12px 14px
    > .promo_head
      font-size: 13px
      color: #e0537a
      margin: 0 0 8px
    > .promo_catch_wrap
      display: flex
      gap: 8px
      align-items: flex-start
      > .promo_frog
        width: 34px
        height: 34px
        flex: 0 0 auto
        object-fit: contain
      > .promo_catch
        margin: 0
        font-size: 12px
        line-height: 1.5
        color: #444
    > .promo_deadline
      margin: 10px 0 8px
      padding: 4px 8px
      background: #e0537a
      color: #fff
      border-radius: 4px
      text-align: center
      font-size: 13px
    > .promo_event
      margin: 0
      > p
        margin: 0 0 5px
        font-size: 11px
        line-height: 1.45
        color: #555
        &:last-child
          margin-bottom: 0
      .promo_label
        display: inline-block
        min-width: 34px
        margin-right: 4px
        padding: 0 4px
        background: #ffe1b0
        color: #8a5a00
        border-radius: 3px
        font-size: 10px
        text-align: center
      a
        color: $MAIN_COLOR
        font-weight: bold
        word-break: break-all
    > .promo_disclaimer
      margin: 10px 0 0
      padding-top: 8px
      border-top: 1px dashed #e0b98a
      font-size: 10px
      line-height: 1.4
      color: #a07a4a

  .next_preview
    position: relative
    width: 100%
    height: 100px
    display: flex
    align-items: center
    justify-content: center
    background: #fff
    border-radius: 4px
    margin-top: 6px
    > img
      max-width: 90%
      max-height: 90%
      object-fit: contain
    > .next_type
      position: absolute
      top: 4px
      right: 6px
      font-size: 11px
      color: #aaa
      font-weight: bold

  .current_name
    font-size: 13px
    color: $DEEP_MAIN_COLOR
    margin-top: 4px
    word-break: break-all

  .controls_box
    ul
      margin: 6px 0 0
      padding-left: 18px
      font-size: 12px
      color: #555
      li
        margin-bottom: 4px

@keyframes blocks-spin
  to
    transform: rotate(360deg)

@keyframes frog-hop
  from
    transform: translateY(0)
  to
    transform: translateY(-12px)

@keyframes blocks-banner-pop
  0%
    transform: translateX(-50%) scale(0.4)
    opacity: 0
  100%
    transform: translateX(-50%) scale(1)
    opacity: 1

@media screen and (max-width: 768px)
  .blocks_wrapper
    > .blocks_main
      flex-direction: column
      align-items: center
    .side_panel
      flex: 1 1 auto
      width: 100%
      max-width: 360px
      flex-direction: column
  .blocks_wrapper > .blocks_bg > .bg_leaf
    opacity: 0.1
</style>
