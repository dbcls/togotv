<template>
  <div class="corner_like">
    <WorkflowLikeButton
      :id="CORNER_LIKE_ID"
      title="動画でワークフローにいいねする"
      rapid
      icon="star"
      :poll-ms="POLL_MS"
      @change="celebrate"
    />

    <!-- 押すたびにカエル氏が画面の下を横切る（1回目は右から左、2回目は左から右、以降交互） -->
    <div
      v-for="frog in frogs"
      :key="frog.key"
      :class="['corner_frog', frog.direction]"
      aria-hidden="true"
      @animationend.self="removeFrog(frog.key)"
    >
      <div class="corner_frog_body">
        <span class="corner_frog_say tsukushi bold">ケロケロ</span>
        <img class="corner_frog_img" :src="FROG_PNG" alt="" />
      </div>
    </div>

    <!-- ときどき、クラッカーの紙ふぶきが花火のように画面に散る -->
    <canvas v-if="fireworksOn" ref="fireworks" class="corner_fireworks" aria-hidden="true"></canvas>
  </div>
</template>

<script>
import Vue from "vue";
import WorkflowLikeButton from "~/components/WorkflowLikeButton.vue";

// コーナー全体（動画でワークフロー）へのいいね。件数はワークフローごとのいいねと同じ保存先に入る
const CORNER_LIKE_ID = "workflow-all";
// ブロックくずし（pics-blocks）と同じカエル氏
const FROG_PNG = "/img/blocks_frog.png";
// 紙ふぶきが出る確率
const FIREWORKS_CHANCE = 0.25;
// ほかの人が押した分も反映するため、件数を取り直す間隔
const POLL_MS = 10000;
// 同時に画面を横切るカエル氏の上限（連打しても重くならないように）
const MAX_FROGS = 8;
const FIREWORKS_COLORS = ["#048998", "#fdd365", "#e0607e", "#5bc0eb", "#9bc53d", "#ff8c42", "#ffffff"];

export default Vue.extend({
  components: { WorkflowLikeButton },
  data() {
    return {
      CORNER_LIKE_ID,
      FROG_PNG,
      POLL_MS,
      frogs: [],
      frogSerial: 0,
      fireworksOn: false
    };
  },
  beforeDestroy() {
    if (this.fireworksFrame) cancelAnimationFrame(this.fireworksFrame);
  },
  methods: {
    celebrate() {
      this.sayKeroKero();
      // 動きを減らす設定の人には、カエル氏も紙ふぶきも出さない
      if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (this.frogs.length >= MAX_FROGS) this.frogs.shift();
      this.frogSerial += 1;
      this.frogs.push({
        key: this.frogSerial,
        direction: this.frogSerial % 2 === 1 ? "rtl" : "ltr"
      });
      if (!this.fireworksOn && Math.random() < FIREWORKS_CHANCE) this.launchFireworks();
    },
    // ブラウザの読み上げ機能で「ケロケロ」と言う（使えないブラウザでは何もしない）
    sayKeroKero() {
      if (!window.speechSynthesis || typeof SpeechSynthesisUtterance === "undefined") return;
      // 連打したときに声が溜まらないよう、前の声を止めてから言う
      window.speechSynthesis.cancel();
      const voice = new SpeechSynthesisUtterance("ケロケロ");
      voice.lang = "ja-JP";
      voice.pitch = 2;
      voice.rate = 1.4;
      window.speechSynthesis.speak(voice);
    },
    removeFrog(key) {
      this.frogs = this.frogs.filter(frog => frog.key !== key);
    },
    async launchFireworks() {
      this.fireworksOn = true;
      await this.$nextTick();
      const canvas = this.$refs.fireworks;
      const ctx = canvas.getContext("2d");
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      // 画面のあちこちで、時間をずらして5発はじける
      const particles = [];
      const bursts = 5;
      for (let b = 0; b < bursts; b++) {
        const cx = width * (0.15 + Math.random() * 0.7);
        const cy = height * (0.15 + Math.random() * 0.45);
        const delay = b * 18 + Math.random() * 10;
        for (let i = 0; i < 70; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 2 + Math.random() * 6;
          particles.push({
            x: cx,
            y: cy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1.5,
            delay: delay,
            life: 70 + Math.random() * 50,
            size: 3 + Math.random() * 4,
            spin: Math.random() * Math.PI,
            spinSpeed: (Math.random() - 0.5) * 0.4,
            color: FIREWORKS_COLORS[Math.floor(Math.random() * FIREWORKS_COLORS.length)]
          });
        }
      }

      let frame = 0;
      const step = () => {
        frame += 1;
        ctx.clearRect(0, 0, width, height);
        let alive = 0;
        particles.forEach(p => {
          const t = frame - p.delay;
          if (t < 0) {
            alive += 1;
            return;
          }
          if (t > p.life) return;
          alive += 1;
          p.vx *= 0.97;
          p.vy = p.vy * 0.97 + 0.12;
          p.x += p.vx;
          p.y += p.vy;
          p.spin += p.spinSpeed;
          ctx.globalAlpha = Math.max(0, 1 - t / p.life);
          ctx.fillStyle = p.color;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.spin);
          // 紙ふぶきらしく細長い四角にする
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
          ctx.restore();
        });
        ctx.globalAlpha = 1;
        if (alive > 0) {
          this.fireworksFrame = requestAnimationFrame(step);
        } else {
          this.fireworksFrame = null;
          this.fireworksOn = false;
        }
      };
      this.fireworksFrame = requestAnimationFrame(step);
    }
  }
});
</script>

<style lang="sass" scoped>
.corner_like
  display: inline-block

// カエル氏は画面の下を横切る。外側の要素が横に進み、内側の画像が跳ねる
.corner_frog
  position: fixed
  bottom: 12px
  left: 0
  width: 96px
  z-index: 1000
  pointer-events: none
  animation-duration: 2.6s
  animation-timing-function: linear
  animation-fill-mode: forwards
  &.rtl
    animation-name: frog_run_rtl
  &.ltr
    animation-name: frog_run_ltr

.corner_frog_body
  position: relative
  animation: frog_hop .32s ease-in-out infinite alternate

.corner_frog_img
  display: block
  width: 100%

// 吹き出し
.corner_frog_say
  position: absolute
  bottom: 100%
  left: 50%
  transform: translate(-50%, -6px)
  white-space: nowrap
  font-size: 15px
  color: #2f7d32
  background-color: #ffffff
  border: 2px solid #4caf50
  border-radius: 100px
  padding: 3px 10px
  box-shadow: 0 2px 6px rgba(0, 0, 0, .12)

.corner_fireworks
  position: fixed
  inset: 0
  width: 100vw
  height: 100vh
  z-index: 1001
  pointer-events: none

@keyframes frog_run_rtl
  from
    transform: translateX(100vw)
  to
    transform: translateX(-110px)

@keyframes frog_run_ltr
  from
    transform: translateX(-110px)
  to
    transform: translateX(100vw)

@keyframes frog_hop
  from
    transform: translateY(0) rotate(-4deg)
  to
    transform: translateY(-28px) rotate(4deg)
</style>
