<template>
  <button
    type="button"
    :class="['like_button', size, { popped: popped }]"
    :disabled="!id || busy"
    title="このワークフローにいいねする"
    @click.stop.prevent="onClick"
  >
    <svg class="like_icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
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
    size: { type: String, default: "normal" }
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
  },
  beforeDestroy() {
    window.removeEventListener(LIKE_EVENT, this.onLikeEvent);
  },
  methods: {
    // 同じワークフローの別のボタンが押されたら、件数を合わせる
    onLikeEvent(event) {
      const detail = event.detail || {};
      if (detail.id !== this.id || this.busy) return;
      if (this.count !== null && detail.count !== null) this.count = detail.count;
    },
    async onClick() {
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
