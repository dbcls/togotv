<template>
  <div class="facet_wrapper">
    <p class="facet_title filter tsukushi bold">絞り込み検索</p>
    <p class="clear_btn" @click="clearFilter">フィルターをクリア</p>
    <div class="facet_small_section">
      <p class="facet_small_title video tsukushi bold">番組のタイプ</p>
      <div class="checkbox_wrapper">
        <ul>
          <li>
            <input type="checkbox" id="demonstration" value="demonstration" v-model="selected_video_type">
            <label for="demonstration">
              <span>動画講習</span>
            </label>
          </li>
          <li>
            <input type="checkbox" id="lecture" value="lecture" v-model="selected_video_type">
            <label for="lecture">
              <span>講演</span>
            </label>
          </li>
          <li>
            <input type="checkbox" id="handson" value="handson" v-model="selected_video_type">
            <label for="handson">
              <span>ハンズオン講習</span>
            </label>
          </li>
        </ul>
      </div>
    </div>
    <div class="facet_small_section">
      <p class="facet_small_title calender tsukushi bold">公開時期</p>
      <div class="checkbox_wrapper">
        <ul>
          <li>
            <input type="checkbox" id="within1" value="within1" v-model="selected_release_season">
            <label for="within1">
              <span>1年以内</span>
            </label>
          </li>
          <li>
            <input type="checkbox" id="1yearago" value="1yearago" v-model="selected_release_season">
            <label for="1yearago">
              <span>1年前 〜 2年前</span>
            </label>
          </li>
          <li>
            <input type="checkbox" id="2yearago" value="2yearago" v-model="selected_release_season">
            <label for="2yearago">
              <span>2年前 〜 3年前</span>
            </label>
          </li>
          <li>
            <input type="checkbox" id="3yearago" value="3yearago" v-model="selected_release_season">
            <label for="3yearago">
              <span>3年前</span>
            </label>
          </li>
        </ul>
      </div>
    </div>
    <div class="facet_small_section">
      <p class="facet_small_title tag tsukushi bold">タグ</p>
      <div class="checkbox_wrapper">
        <ul>
          <li v-for="(tag, index) in tag_list" :key="index">
            <input type="checkbox" :id="tag.key" :value="tag.key" v-model="selected_tags">
            <label :for="tag.key">
              <span>{{ tag.key }}</span>
            </label>
          </li>
        </ul>
      </div>
    </div>
    <div class="facet_small_section">
      <p class="facet_small_title language tsukushi bold">言語</p>
      <div class="checkbox_wrapper">
        <ul>
          <li>
            <input type="checkbox" id="ja" value="ja" v-model="selected_language">
            <label for="ja">
              <span>日本語</span>
            </label>
          </li>
          <li>
            <input type="checkbox" id="en" value="en" v-model="selected_language">
            <label for="en">
              <span>英語</span>
            </label>
          </li>
        </ul>
      </div>
    </div>
    <div class="facet_small_section">
      <p class="facet_small_title time tsukushi bold">時間</p>
      <div class="select_time_bar">
        <span :class="['tab', 'mont', selected_duration >=  5 ? 'on' : '']" @click="selected_duration = 5"><span class="duration_time">~5<span class="unit">分</span></span></span>
        <span :class="['tab', 'mont', selected_duration  >= 10 ? 'on' : '']" @click="selected_duration = 10"><span class="duration_time">~10<span class="unit">分</span></span></span>
        <span :class="['tab', 'mont', selected_duration  >= 20 ? 'on' : '']" @click="selected_duration = 20"><span class="duration_time">~20<span class="unit">分</span></span></span>
        <span :class="['tab', 'mont', selected_duration  >= 30 ? 'on' : '']" @click="selected_duration = 30"><span class="duration_time">20<span class="unit">分以上</span></span></span>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'

export default Vue.extend({
  data() {
    return {
      selected_video_type: [],
      selected_release_season: [],
      selected_tags: [],
      selected_language: [],
      selected_duration: 0,
      tag_list: []
    }
  },
  mounted() {
    axios
      .get(`http://togotv-api.bhx.jp/api/facets/keywords`)
      .then(data => {
        this.tag_list = data.data.facets
      })
      .catch(error => {
        console.log('error', error)
      })
  },
  methods: {
    clearFilter() {
      this.selected_video_type = []
      this.selected_release_season = []
      this.selected_tags = []
      this.selected_language = []
      this.selected_duration = 0
    }
  }
})
</script>

<style lang="sass" scoped>
.facet_wrapper
  @include facet
  > p.facet_title
    font-size: 18px
    display: flex
    align-items: center
    margin: 30px 0 14px
    &:before
      width: 32px
      height: 32px
    &.search
      &:before
        @include icon('search_color')
    &.filter
      &:before
        @include icon('filter')
  > p.clear_btn
    text-decoration: underline
    font-size: 12px
    display: flex
    align-items: center
    &:before
      width: 18px
      height: 18px
      margin-right: 2px
      margin-left: 3px
      @include icon('clear')
    &:hover
      cursor: pointer
  > .input_wrapper
    @include text_input
    > input
      width: 240px
      height: 28px
    > button
      width: 18px
      height: 18px
  > .facet_small_section
    border-bottom: 1px solid $MAIN_COLOR
    padding-bottom: 26px
    &:last-of-type
      border-bottom: none
    > .facet_small_title
      font-size: 14px
      display: flex
      align-items: center
      &:before
        width: 23px
        height: 23px
        margin-top: -1px
        margin-right: 2px
      &.video
        &:before
          @include icon('video')
      &.calender
        &:before
          @include icon('calender')
      &.tag
        &:before
          @include icon('tag')
      &.language
        &:before
          @include icon('language')
      &.time
        &:before
          @include icon('time')
    > .checkbox_wrapper
      ul
        li
          position: relative
          > label
            > span
              margin-left: 27px
          > input[type=checkbox]
            @include checkbox
            margin-left: 3px
    > .select_time_bar
      position: relative
      display: flex
      justify-content: space-between
      width: 213px
      margin: 26px 0 0 6px
      &:before
        content: ''
        width: 213px
        height: 3px
        background-color: $SUB_COLOR
        position: absolute
        top: 50%
        left: 50%
        transform: translate(-50%, -50%)
      > span.tab
        display: flex
        flex-direction: column
        position: relative
        > .duration_time
          font-size: 14px
          position: absolute
          left: -50%
          top: -19px
          display: flex
          align-items: flex-end
          font-weight: 600
          > span.unit
            font-size: 10px
            white-space: nowrap
            font-weight: 500
        &:after
          content: ''
          width: 11px
          height: 11px
          display: inline-block
          border-radius: 11px
          box-sizing: border-box
          background-color: $SUB_COLOR
        &.on
          &:after
            background-color: $POINT_COLOR
            border: 2px solid $SUB_COLOR
        &:hover
          cursor: pointer
</style>
