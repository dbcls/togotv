<template>
  <div class="wf_prompt">
    <p class="wf_prompt_title tsukushi bold">AIと一緒にたどる（プロンプト）</p>
    <p class="wf_prompt_intro">{{ intro }}</p>

    <!-- 推奨のMCP接続 -->
    <div v-if="mcp.length" class="wf_prompt_mcp">
      <p class="wf_prompt_mcp_title tsukushi bold">おすすめの接続（MCP）</p>
      <ul class="wf_prompt_mcp_list">
        <li v-for="item in mcp" :key="item.url">
          <a :href="item.url" target="_blank" rel="noopener noreferrer" class="wf_prompt_mcp_link">{{ item.label }}</a>
          <span class="wf_prompt_mcp_note">{{ item.note }}</span>
        </li>
      </ul>
      <p class="wf_prompt_mcp_foot">
        MCP は、AI からデータベースを直接調べられるようにするしくみです。接続しなくてもプロンプトは使えますが、
        AI が答えを自分で確かめられるぶん、結果の確かさが上がります。
        <nuxt-link :to="localePath('/workflow-ai.html')">接続の手順はこちら</nuxt-link>
      </p>
    </div>

    <!-- プロンプト本体。タブで切り替える -->
    <div class="wf_prompt_tabs" role="tablist">
      <button
        v-for="(prompt, i) in prompts"
        :key="`tab_${i}`"
        type="button"
        role="tab"
        :aria-selected="current === i ? 'true' : 'false'"
        :class="['wf_prompt_tab', { selected: current === i }]"
        @click="current = i"
      >
        {{ prompt.title }}
      </button>
    </div>

    <div v-for="(prompt, i) in prompts" v-show="current === i" :key="`panel_${i}`" class="wf_prompt_panel">
      <p class="wf_prompt_note">{{ prompt.note }}</p>
      <div class="wf_prompt_box">
        <button type="button" class="wf_prompt_copy" @click="copy(prompt.body, i)">
          {{ copyLabel(i) }}
        </button>
        <pre class="wf_prompt_body"><code>{{ prompt.body }}</code></pre>
      </div>
    </div>

    <div class="wf_prompt_caution">
      <span class="wf_prompt_caution_mark" aria-hidden="true">!</span>
      <div class="wf_prompt_caution_text">
        <p>
          こちらでご紹介しているプロンプトは、同じプロンプトでもAIが毎回まったく同じ答えを返す保証はありません。
          「毎回同じ答え」ではなく、「何をどこから取ったかが毎回たどれる」ことを担保に設計しています。
        </p>
        <p>
          AI の答えは誤りを含むことがあります。必ずデータベースの ID と原著論文をたどって、ご自身で確かめてください。
          未公開データ・個人情報・患者さんの情報は入力しないでください。
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  name: "WorkflowPrompt",
  props: {
    // プロンプトの使いどころを一言で
    intro: { type: String, default: "" },
    // [{ label, url, note }]
    mcp: { type: Array, default: () => [] },
    // [{ title, note, body }]
    prompts: { type: Array, default: () => [] }
  },
  data() {
    return {
      current: 0,
      // コピーしたタブの番号（ボタンの表示を一時的に変える）
      copied: null,
      // コピーできなかったタブの番号（手動で選んでもらうよう促す）
      failed: null
    };
  },
  beforeDestroy() {
    clearTimeout(this.copiedTimer);
  },
  methods: {
    copyLabel(index) {
      if (this.copied === index) return "コピーしました";
      if (this.failed === index) return "コピーできません";
      return "コピー";
    },
    // textarea を置いて選択してからコピーする古い方法。
    // navigator.clipboard が使えない（http や権限なし）ときの受け皿
    copyFallback(text) {
      const area = document.createElement("textarea");
      area.value = text;
      area.style.position = "fixed";
      area.style.top = "0";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      let ok = false;
      try {
        ok = document.execCommand("copy");
      } catch (error) {
        ok = false;
      }
      document.body.removeChild(area);
      return ok;
    },
    async copy(text, index) {
      let ok = false;
      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(text);
          ok = true;
        } catch (error) {
          // 権限がないときなどは、下の古い方法でもう一度試す
          ok = false;
        }
      }
      if (!ok) ok = this.copyFallback(text);
      this.copied = ok ? index : null;
      this.failed = ok ? null : index;
      clearTimeout(this.copiedTimer);
      this.copiedTimer = setTimeout(() => {
        this.copied = null;
        this.failed = null;
      }, 2000);
    }
  }
});
</script>

<style lang="sass" scoped>
.wf_prompt
  background-color: #f5fafa
  border-radius: 8px
  padding: 24px 24px 20px
  margin: 0 0 48px
  box-sizing: border-box

.wf_prompt_title
  font-size: 18px
  color: $DEEP_MAIN_COLOR
  margin: 0 0 8px

.wf_prompt_intro
  font-size: 14px
  line-height: 1.9
  margin: 0 0 16px

// ── MCP ──
.wf_prompt_mcp
  background-color: #ffffff
  border: 1px solid #d9eaec
  border-radius: 6px
  padding: 12px 16px
  margin-bottom: 18px

.wf_prompt_mcp_title
  font-size: 13px
  color: $DEEP_MAIN_COLOR
  margin: 0 0 6px

.wf_prompt_mcp_list
  list-style: none
  padding: 0
  margin: 0 0 8px

  > li
    font-size: 13px
    line-height: 1.8

.wf_prompt_mcp_link
  color: $MAIN_COLOR
  font-weight: bold
  text-decoration: none
  margin-right: 8px
  &:hover
    text-decoration: underline

.wf_prompt_mcp_note
  color: #666666

.wf_prompt_mcp_foot
  font-size: 12px
  line-height: 1.8
  color: #666666
  margin: 0

  > a
    color: $MAIN_COLOR

// ── タブ ──
.wf_prompt_tabs
  display: flex
  flex-wrap: wrap
  gap: 8px
  margin-bottom: 12px

.wf_prompt_tab
  font-size: 13px
  line-height: 1
  color: $DEEP_MAIN_COLOR
  background-color: #ffffff
  border: 1px solid #cfe3e5
  border-radius: 100px
  padding: 8px 14px
  cursor: pointer
  &:hover
    border-color: $MAIN_COLOR
  &.selected
    background-color: $MAIN_COLOR
    border-color: $MAIN_COLOR
    color: #ffffff

.wf_prompt_note
  font-size: 13px
  line-height: 1.8
  color: #666666
  margin: 0 0 8px

// ── プロンプト本体 ──
.wf_prompt_box
  position: relative

.wf_prompt_copy
  position: absolute
  top: 10px
  right: 10px
  z-index: 1
  font-size: 12px
  line-height: 1
  color: #ffffff
  background-color: $MAIN_COLOR
  border: none
  border-radius: 100px
  padding: 8px 14px
  cursor: pointer
  &:hover
    background-color: $DEEP_MAIN_COLOR

.wf_prompt_body
  // 長いプロンプトは枠の中でスクロールさせる
  max-height: 360px
  overflow: auto
  background-color: #ffffff
  border: 1px solid #d9eaec
  border-radius: 6px
  padding: 16px 16px 16px
  margin: 0
  font-size: 12.5px
  line-height: 1.85
  // 行の折り返しを許して、横スクロールを避ける
  white-space: pre-wrap
  word-break: break-word

  > code
    font-family: "SFMono-Regular", Consolas, "Courier New", monospace

.wf_prompt_caution
  display: flex
  align-items: flex-start
  gap: 8px
  font-size: 12px
  line-height: 1.8
  color: #8a5a00
  background-color: #fff8e6
  border-radius: 6px
  padding: 10px 14px
  margin: 14px 0 0

  // 2つの注意書きのあいだだけ空ける
  > .wf_prompt_caution_text > p + p
    margin-top: 6px

.wf_prompt_caution_mark
  flex: 0 0 auto
  width: 16px
  height: 16px
  margin-top: 2px
  border-radius: 50%
  background-color: #e8a33d
  color: #ffffff
  font-size: 11px
  font-weight: bold
  line-height: 16px
  text-align: center

@media screen and (max-width: 896px)
  .wf_prompt
    padding: 20px 16px 16px

  .wf_prompt_copy
    position: static
    display: block
    margin: 0 0 8px auto
</style>
