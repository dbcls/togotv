<template>
  <button
    type="button"
    :class="['like_button', size, icon, { popped: popped }]"
    :disabled="!id || (busy && !rapid)"
    :title="title"
    @click.stop.prevent="onClick"
  >
    <svg class="like_icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        v-if="icon === 'star'"
        d="M12 2.8l2.8 5.7 6.3.9-4.55 4.45 1.07 6.27L12 17.15l-5.62 2.97 1.07-6.27L2.9 9.4l6.3-.9z"
      />
      <path
        v-else
        d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.8 4.5c2.1 0 3.6 1.1 4.4 2.5h1.6c.8-1.4 2.3-2.5 4.4-2.5 3.8 0 5.9 3.9 4.4 7.3C19.5 16.4 12 21 12 21z"
      />
    </svg>
    <span class="like_label">いいね</span>
    <span v-if="count !== null" class="like_count mont">{{ count }}</span>
  </button>
</template>

<script>
import Vue from "vue";
import { LIKES_ENDPOINT, LIKE_EVENT, fetchLikeCounts, addLike } from "~/assets/js/workflowLikes.js";

// 押したあと次に押せるまでの時間（連打で件数が跳ね上がるのを和らげる）
const COOLDOWN_MS = 1500;

export default Vue.extend({
  name: "WorkflowLikeButton",
  props: {
    // workflowId() で作った ID（例: workflow-variant）
    id: { type: String, default: "" },
    // normal: ワークフローページ用 / small: 一覧カード用
    size: { type: String, default: "normal" },
    title: { type: String, default: "このワークフローにいいねする" },
    // true なら待ち時間なしで何回でも押せる（コーナー全体のいいね用）
    rapid: { type: Boolean, default: false },
    // 0 より大きければ、この間隔（ミリ秒）で件数を取り直し、ほかの人が押した分も反映する
    pollMs: { type: Number, default: 0 },
    // heart: ワークフローごとのいいね / star: コーナー全体のいいね
    icon: { type: String, default: "heart" }
  },
  data() {
    return {
      // 共有の件数。保存先（LIKES_ENDPOINT）が未設定のあいだは表示しない
      count: null,
      busy: false,
      // 押した直後だけハートを塗りつぶして弾ませる
      popped: false
    };
  },
  async mounted() {
    if (!this.id) return;
    window.addEventListener(LIKE_EVENT, this.onLikeEvent);
    if (!LIKES_ENDPOINT) return;
    const counts = await fetchLikeCounts();
    this.count = counts[this.id] || 0;
    if (this.pollMs > 0) this.pollTimer = setInterval(this.refresh, this.pollMs);
  },
  beforeDestroy() {
    window.removeEventListener(LIKE_EVENT, this.onLikeEvent);
    if (this.pollTimer) clearInterval(this.pollTimer);
  },
  methods: {
    // 同じワークフローの別のボタンが押されたら、件数を合わせる
    onLikeEvent(event) {
      const detail = event.detail || {};
      if (detail.id !== this.id || this.busy || this.rapid) return;
      if (this.count !== null && detail.count !== null) this.count = detail.count;
    },
    // 件数を取り直す。押した直後に古い件数へ戻らないよう、減る方向には合わせない
    async refresh() {
      if (document.hidden || this.pending > 0) return;
      const counts = await fetchLikeCounts(true);
      if (this.count !== null && counts[this.id] !== undefined) {
        this.count = Math.max(this.count, counts[this.id]);
      }
    },
    async onClick() {
      if (this.rapid) return this.onRapidClick();
      if (!this.id || this.busy) return;
      this.busy = true;
      this.popped = true;
      // 先に件数を増やして見せ、サーバーの件数が返ってきたらそれで上書きする
      if (this.count !== null) this.count += 1;
      const count = await addLike(this.id);
      if (count !== null) this.count = count;
      this.$emit("change", { id: this.id, count: this.count });
      setTimeout(() => {
        this.busy = false;
        this.popped = false;
      }, COOLDOWN_MS);
    },
    // 何回でも押せるボタン。押すたびにすぐ件数を増やし、送信は裏で続ける
    async onRapidClick() {
      if (!this.id) return;
      this.pending = (this.pending || 0) + 1;
      if (this.count !== null) this.count += 1;
      // ハートの弾みを押すたびにやり直す
      this.popped = false;
      this.$nextTick(() => (this.popped = true));
      clearTimeout(this.popTimer);
      this.popTimer = setTimeout(() => (this.popped = false), 600);
      this.$emit("change", { id: this.id, count: this.count });
      const count = await addLike(this.id);
      this.pending -= 1;
      // 連打中は返ってくる順番が前後するので、大きいほうを残す
      if (count !== null && this.count !== null) this.count = Math.max(this.count, count);
    }
  }
});
</script>

<style lang="sass" scoped>
.like_button
  display: inline-flex
  align-items: center
  gap: 6px
  font-size: 13px
  line-height: 1
  color: $DEEP_MAIN_COLOR
  background-color: #ffffff
  border: 1px solid #cfe3e5
  border-radius: 100px
  padding: 8px 14px
  cursor: pointer
  transition: background-color .15s, border-color .15s, color .15s
  &:hover:not(:disabled)
    border-color: #e0607e
    color: #e0607e
  &:disabled
    cursor: default

  > .like_icon
    width: 16px
    height: 16px
    fill: none
    stroke: currentColor
    stroke-width: 2
    stroke-linejoin: round

  &.popped
    color: #ffffff
    background-color: #e0607e
    border-color: #e0607e
    > .like_icon
      fill: currentColor
      animation: like_pop .4s ease-out

  > .like_count
    font-weight: bold

  // 星は黄色系で見せる
  &.star
    &:hover:not(:disabled)
      border-color: #f2a900
      color: #e09a00
    &.popped
      color: #ffffff
      background-color: #f2a900
      border-color: #f2a900

  // 一覧カード用は小さく、ラベルを省く
  &.small
    font-size: 12px
    padding: 5px 10px
    gap: 4px
    > .like_icon
      width: 14px
      height: 14px
    > .like_label
      display: none

@keyframes like_pop
  0%
    transform: scale(1)
  40%
    transform: scale(1.35)
  100%
    transform: scale(1)
</style>
