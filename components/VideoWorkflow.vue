<template>
  <div class="wf_body">
    <!-- リード文 -->
    <p class="wf_lead">{{ lead }}</p>

    <!-- ワークフロー図 -->
    <div class="wf_diagram_wrapper">
      <p class="wf_diagram_title tsukushi bold">ワークフロー</p>
      <div class="wf_diagram">
        <template v-for="(step, i) in steps">
          <a
            :class="['wf_node', { is_outdated: step.outdated }]"
            :href="`#step${step.no}`"
            :key="`node_${step.no}`"
          >
            <span class="wf_node_no mont bold">STEP {{ step.no }}</span>
            <span class="wf_node_tool tsukushi bold">{{ step.tool }}</span>
            <span class="wf_node_action">{{ step.action }}</span>
            <span v-if="step.outdated" class="wf_node_flag">更新予定</span>
          </a>
          <span
            v-if="i < steps.length - 1"
            class="wf_arrow"
            :key="`arrow_${step.no}`"
            aria-hidden="true"
          ></span>
        </template>
      </div>
      <p v-if="hasOutdated" class="wf_diagram_note">
        <span class="wf_note_swatch" aria-hidden="true"></span>
        公開から年数が経っている動画です。ツールの画面や手順が現行版と異なる場合があります（更新予定）。
      </p>
    </div>

    <!-- 各ステップ -->
    <ol class="wf_steps">
      <li v-for="step in steps" :key="step.no" :id="`step${step.no}`" class="wf_step">
        <div class="wf_step_head">
          <span class="wf_step_no mont bold">{{ step.no }}</span>
          <div class="wf_step_headtext">
            <p class="wf_step_tool mont bold">{{ step.tool }}</p>
            <h3 class="wf_step_title tsukushi bold">{{ step.heading }}</h3>
          </div>
        </div>

        <p class="wf_step_story">{{ step.story }}</p>

        <div class="wf_video">
          <div class="wf_video_inner">
            <iframe
              :src="`https://www.youtube.com/embed/${step.youtube}`"
              :title="step.videoTitle"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            ></iframe>
          </div>
        </div>

        <p class="wf_video_meta">
          <a class="wf_video_link" :href="step.url" target="_blank" rel="noopener noreferrer">{{ step.videoTitle }}</a>
          <span class="wf_video_time mont">{{ step.duration }}</span>
        </p>
      </li>
    </ol>

    <!-- まとめ -->
    <div v-if="outro" class="wf_outro">
      <p class="wf_outro_title tsukushi bold">まとめ</p>
      <p class="wf_outro_text">{{ outro }}</p>
    </div>

    <!-- 発展 -->
    <div v-if="extras && extras.length" class="wf_extra">
      <p class="wf_extra_title tsukushi bold">さらに学ぶ</p>
      <ul class="wf_extra_list">
        <li v-for="extra in extras" :key="extra.url">
          <a :href="extra.url" target="_blank" rel="noopener noreferrer">{{ extra.videoTitle }}</a>
          <span class="wf_video_time mont">{{ extra.duration }}</span>
          <span class="wf_extra_note">{{ extra.note }}</span>
        </li>
      </ul>
    </div>

    <!-- 関連講演動画（横スクロール） -->
    <div v-if="lectures && lectures.length" class="wf_lectures">
      <p class="wf_lectures_title tsukushi bold">関連講演動画</p>
      <p class="wf_lectures_note">
        このテーマを、講習会やシンポジウムの講演でより深く学べます。
      </p>
      <ul class="wf_lecture_list scroll-horizontal">
        <li v-for="lec in lectures" :key="lec.url" class="wf_lecture_item">
          <a :href="lec.url" target="_blank" rel="noopener noreferrer" class="wf_lecture_card">
            <span class="wf_lecture_thumb">
              <img :src="lec.thumbnail" :alt="lec.title" loading="lazy" />
              <span class="wf_lecture_duration mont">{{ lec.duration }}</span>
            </span>
            <span class="wf_lecture_title">{{ lec.title }}</span>
            <span class="wf_lecture_date mont">{{ lec.date }}</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  name: "VideoWorkflow",
  props: {
    lead: { type: String, default: "" },
    steps: { type: Array, default: () => [] },
    outro: { type: String, default: "" },
    extras: { type: Array, default: () => [] },
    lectures: { type: Array, default: () => [] }
  },
  computed: {
    hasOutdated() {
      return this.steps.some(step => step.outdated);
    }
  }
});
</script>

<style lang="sass" scoped>
// 幅の基準はページ側の .workflow_wrapper が持つ（中央寄せもそちらで行う）
.wf_body
  width: 100%

.wf_lead
  font-size: 15px
  line-height: 1.9
  margin: 0 0 32px

// ─── ワークフロー図 ───────────────────────────────
.wf_diagram_wrapper
  background-color: #f5fafa
  border-radius: 6px
  padding: 20px
  margin-bottom: 40px
  box-sizing: border-box

.wf_diagram_title
  font-size: 15px
  color: $DEEP_MAIN_COLOR
  margin: 0 0 16px

.wf_diagram
  display: flex
  flex-wrap: wrap
  align-items: stretch
  gap: 8px

  > .wf_node
    // 折り返した行でもカード幅が揃うように上限を設ける
    flex: 1 1 150px
    max-width: 200px
    min-width: 0
    box-sizing: border-box
    display: flex
    flex-direction: column
    background-color: #ffffff
    border: 1px solid #d5e6e8
    border-radius: 5px
    padding: 12px 10px
    text-decoration: none
    color: $BLACK
    transition: border-color .2s, box-shadow .2s
    &:hover
      border-color: $MAIN_COLOR
      box-shadow: 0 2px 8px rgba(4, 137, 152, 0.18)

    // 公開から年数が経っている動画（更新予定）は色を変えて示す
    &.is_outdated
      border-color: #e3c07a
      background-color: #fffdf6
      &:hover
        border-color: #c99a2e
        box-shadow: 0 2px 8px rgba(201, 154, 46, 0.22)
      > .wf_node_no
        color: #a87d1a

  > .wf_arrow
    flex: 0 0 auto
    align-self: center
    width: 14px
    text-align: center
    color: $MAIN_COLOR
    font-size: 13px
    line-height: 1
    &:before
      content: '▶'

.wf_node_no
  font-size: 10px
  letter-spacing: 0.04em
  color: $MAIN_COLOR
  margin-bottom: 5px

.wf_node_tool
  font-size: 14px
  line-height: 1.35
  margin-bottom: 4px
  word-break: break-word

.wf_node_action
  font-size: 12px
  line-height: 1.5
  color: #666666

.wf_node_flag
  display: inline-block
  align-self: flex-start
  margin-top: 7px
  font-size: 10px
  line-height: 1
  color: #8a6414
  background-color: #f6e3b4
  border-radius: 3px
  padding: 3px 6px

.wf_diagram_note
  display: flex
  align-items: flex-start
  font-size: 12px
  line-height: 1.6
  color: #7a6a45
  margin: 14px 0 0

.wf_note_swatch
  flex: 0 0 auto
  width: 11px
  height: 11px
  margin: 3px 7px 0 0
  border: 1px solid #e3c07a
  background-color: #fffdf6
  border-radius: 2px

// ─── 各ステップ ───────────────────────────────────
.wf_steps
  list-style: none
  padding: 0
  margin: 0

.wf_step
  padding-top: 12px
  margin-bottom: 48px
  &:last-child
    margin-bottom: 0

.wf_step_head
  display: flex
  align-items: flex-start
  margin-bottom: 14px

.wf_step_no
  flex: 0 0 auto
  width: 34px
  height: 34px
  border-radius: 50%
  background-color: $MAIN_COLOR
  color: #ffffff
  font-size: 16px
  display: flex
  align-items: center
  justify-content: center
  margin-right: 12px

.wf_step_headtext
  min-width: 0

.wf_step_tool
  font-size: 12px
  color: $MAIN_COLOR
  letter-spacing: 0.04em
  margin: 0 0 3px

.wf_step_title
  font-size: 19px
  line-height: 1.45
  margin: 0
  word-break: break-word

.wf_step_story
  font-size: 15px
  line-height: 1.9
  margin: 0 0 18px

// ─── 動画 ─────────────────────────────────────────
.wf_video
  width: 100%
  max-width: 720px

  // padding-top の % は親要素の幅基準のため、
  // max-width を持つ .wf_video の内側で 16:9 を作る
  > .wf_video_inner
    position: relative
    width: 100%
    height: 0
    padding-top: 56.25%
    border-radius: 5px
    overflow: hidden
    background-color: #000000

    > iframe
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      border: 0

.wf_video_meta
  max-width: 720px
  margin: 10px 0 0
  font-size: 13px
  line-height: 1.7

.wf_video_link
  color: $MAIN_COLOR
  text-decoration: none
  &:hover
    text-decoration: underline

.wf_video_time
  color: #888888
  margin-left: 8px
  white-space: nowrap

// ─── まとめ・発展 ─────────────────────────────────
.wf_outro
  margin-top: 48px
  padding: 20px
  background-color: #f5fafa
  border-radius: 6px
  box-sizing: border-box

.wf_outro_title
  font-size: 15px
  color: $DEEP_MAIN_COLOR
  margin: 0 0 10px

.wf_outro_text
  font-size: 15px
  line-height: 1.9
  margin: 0

.wf_extra
  margin-top: 32px

.wf_extra_title
  font-size: 15px
  color: $DEEP_MAIN_COLOR
  margin: 0 0 10px

.wf_extra_list
  list-style: none
  padding: 0
  margin: 0
  > li
    font-size: 14px
    line-height: 1.8
    margin-bottom: 8px
    > a
      color: $MAIN_COLOR
      text-decoration: none
      &:hover
        text-decoration: underline

.wf_extra_note
  display: block
  font-size: 13px
  color: #666666

// ─── 関連講演動画 ─────────────────────────────────
.wf_lectures
  margin-top: 40px
  padding-top: 28px
  border-top: 1px solid #e4eced

.wf_lectures_title
  font-size: 15px
  color: $DEEP_MAIN_COLOR
  margin: 0 0 6px

.wf_lectures_note
  font-size: 13px
  line-height: 1.7
  color: #666666
  margin: 0 0 16px

.wf_lecture_list
  list-style: none
  padding: 0 0 8px
  margin: 0
  display: flex
  gap: 14px
  overflow-x: auto
  -webkit-overflow-scrolling: touch

.wf_lecture_item
  flex: 0 0 auto
  width: 210px

.wf_lecture_card
  display: block
  text-decoration: none
  color: $BLACK
  &:hover
    .wf_lecture_title
      color: $MAIN_COLOR
    .wf_lecture_thumb
      box-shadow: 0 3px 10px rgba(4, 137, 152, 0.22)

.wf_lecture_thumb
  position: relative
  display: block
  width: 100%
  height: 0
  padding-top: 56.25%
  border-radius: 4px
  overflow: hidden
  background-color: #eef2f3
  transition: box-shadow .2s
  > img
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    object-fit: cover

.wf_lecture_duration
  position: absolute
  right: 5px
  bottom: 5px
  font-size: 10px
  line-height: 1
  color: #ffffff
  background-color: rgba(0, 0, 0, 0.72)
  border-radius: 2px
  padding: 3px 5px

.wf_lecture_title
  display: block
  font-size: 13px
  line-height: 1.55
  margin-top: 8px
  transition: color .2s

.wf_lecture_date
  display: block
  font-size: 11px
  color: #888888
  margin-top: 4px

// タブレット・スマートフォン共通（iPad 縦は横並びの図のまま読める）
@media screen and (max-width: 896px)
  .wf_step_title
    font-size: 17px

  .wf_lead,
  .wf_step_story,
  .wf_outro_text
    font-size: 14px

// スマートフォンのみ：ワークフロー図を縦積みにする
@media screen and (max-width: 599px)
  .wf_diagram
    flex-direction: column
    > .wf_node
      flex: 0 0 auto
      width: 100%
      max-width: none
    > .wf_arrow
      width: 100%
      &:before
        content: '▼'
</style>
