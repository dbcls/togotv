<template>
  <div class="result_wrapper">
    <div class="facet_wrapper">
      <p class="facet_title filter tsukushi bold">{{ $t('filter_search') }}</p>
      <p class="clear_btn" @click="clearFilter">{{ $t('clear_filter') }}</p>
      <!-- <div class="facet_small_section">
        <p class="facet_small_title video tsukushi bold">
          {{ $t('program_type') }}
          <span
            :class="['toggle_btn', facets_toggle_state.type ? '' : 'close']"
            @click="facets_toggle_state.type = !facets_toggle_state.type"
          ></span>
        </p>
        <div :class="['checkbox_wrapper', facets_toggle_state.type ? '' : 'close']">
          <ul>
            <li>
              <input type="checkbox" id="demonstration" :value="$t('video_manual')" v-model="filters.type">
              <label for="demonstration">
                <span>{{ $t('video_manual') }}</span>
              </label>
            </li>
            <li>
              <input type="checkbox" id="lecture" value="講演" v-model="filters.type">
              <label for="lecture">
                <span>{{ $t('ajacs_lecture') }}</span>
              </label>
            </li>
            <li>
              <input type="checkbox" id="handson" value="実習" v-model="filters.type">
              <label for="handson">
                <span>{{ $t('hands_on') }}</span>
              </label>
            </li>
          </ul>
        </div>
      </div> -->
      <div class="facet_small_section">
        <p class="facet_small_title calender tsukushi bold">
          {{ $t('publish_date') }}
          <span class="clear_btn" @click="filters.uploadDate = [0, 4]">{{ $t('clear') }}</span>
        </p>
        <vue-slider :marks="upload_date_range" :max="4" :minRange="1" v-model="filters.uploadDate" :tooltip="'none'"></vue-slider>
      </div>
      <div class="facet_small_section">
        <p class="facet_small_title tag tsukushi bold">
          {{ $t('tags') }}
          <span
            :class="['toggle_btn', facets_toggle_state.tags ? '' : 'close']"
            @click="facets_toggle_state.tags = !facets_toggle_state.tags"
          ></span>
        </p>
        <div :class="['checkbox_wrapper', facets_toggle_state.tags ? '' : 'close']">
          <ul>
            <li v-for="(tag, index) in tag_list" :key="index">
              <input type="checkbox" :id="tag.key" :value="tag.key" v-model="filters.tags">
              <label :for="tag.key">
                <span>{{ tag.key }}</span>
              </label>
            </li>
          </ul>
        </div>
      </div>
      <div class="facet_small_section">
        <p class="facet_small_title language tsukushi bold">
          {{ $t('language') }}
          <span
            :class="['toggle_btn', facets_toggle_state.lang ? '' : 'close']"
            @click="facets_toggle_state.lang = !facets_toggle_state.lang"
          ></span>
        </p>
        <div :class="['checkbox_wrapper', facets_toggle_state.lang ? '' : 'close']">
          <ul>
            <li>
              <input type="checkbox" id="ja" value="ja" v-model="filters.lang">
              <label for="ja">
                <span>{{ $t('ja') }}</span>
              </label>
            </li>
            <li>
              <input type="checkbox" id="en" value="en" v-model="filters.lang">
              <label for="en">
                <span>{{ $t('en') }}</span>
              </label>
            </li>
          </ul>
        </div>
      </div>
      <div class="facet_small_section">
        <p class="facet_small_title time tsukushi bold">
          {{ $t('duration') }}
          <span class="clear_btn" @click="filters['duration(ISO 8601)'] = [0, 4]">{{ $t('clear') }}</span>
        </p>
        <vue-slider :marks="duration_range" :max="4" :minRange="1" v-model="filters['duration(ISO 8601)']" :tooltip="'none'"></vue-slider>
      </div>
    </div>
    <div class="video_section">
      <div class="video_section_header">
        <h2 class="page_title tsukushi bold">
          <span v-if="$i18n.locale === 'en'">{{ $t('results_of') }}</span>
          <span>「{{ $route.query.query.trim() }}」</span>
          <span v-if="$i18n.locale === 'ja'" >{{ $t('results_of') }}</span>
        </h2>
        <ul class="display_icon_wrapper">
          <li>
            <img v-if="$store.state.display === 'card'" @click="toggleDisplay" src="~/assets/img/icon/icon_list_off.svg" alt="リスト表示">
            <img v-if="$store.state.display === 'list'" src="~/assets/img/icon/icon_list.svg" alt="リスト表示">
          </li>
          <li>
            <img v-if="$store.state.display === 'list'" @click="toggleDisplay" src="~/assets/img/icon/icon_card_off.svg" alt="カード表示">
            <img v-if="$store.state.display === 'card'" src="~/assets/img/icon/icon_card.svg" alt="カード表示">
          </li>
        </ul>
      </div>
      <ul class="span_tab_wrapper">
        <li @click="switchTypeTab('動画マニュアル')" :class="['span_tab', 'tsukushi', 'bold', $route.query.type === '動画マニュアル' ? 'active' : '']">{{ $t('video_manual') }}</li>
        <li @click="switchTypeTab('講演')" :class="['span_tab', 'tsukushi', 'bold', $route.query.type === '講演' ? 'active' : '']">{{ $t('ajacs_lecture') }}</li>
        <li @click="switchTypeTab('実習')" :class="['span_tab', 'tsukushi', 'bold', $route.query.type === '実習' ? 'active' : '']">{{ $t('hands_on') }}</li>
      </ul>
      <VideoListCard v-if="$store.state.display === 'card' && !is_loading" :video_info_array="result_list"/>
      <VideoList v-if="$store.state.display === 'list' && !is_loading" :video_info_array="result_list"/>
      <div v-if="is_loading" class="loader">Loading...</div>
      <Pagination ref="pagination" :props="{lastpage: lastpage, is_null: result_list.length === 0}" @fetchData="fetchData" />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import VideoListCard from '~/components/VideoListCard.vue'
import VideoList from '~/components/VideoList.vue'
import Pagination from '~/components/Pagination.vue'
import axios from 'axios'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'

export default Vue.extend({
  head() {
    return {
      title: `「${this.$route.query.query}」の検索結果`,
      meta: [
        { hid: 'og:title', property: 'og:title', content: `「${this.$route.query.query}」の検索結果` },
        { hid: 'og:url', property: 'og:url', content: location.href },
        { hid: 'og:image', property: 'og:image', content: 'https://raw.githubusercontent.com/dbcls/togotv/master/assets/img/icon/icon_search_color.svg'},
      ]
    }
  },
  components: {
    VideoListCard,
    VideoList,
    Pagination,
    VueSlider
  },
  data () {
    return {
      lastpage: 0,
      result_list: [],
      filters: {
        type: [],
        uploadDate: [0, 4],
        tags: [],
        lang: [],
        'duration(ISO 8601)': [0, 4]
      },
      facets_toggle_state: {
        type: true,
        tags: true,
        lang: true
      },
      duration_range: {
        '0': '0分',
        '1': '5分',
        '2': '10分',
        '3': '20分',
        '4': '20分~',
      },
      tag_list: [],
      is_loading: false
    }
  },
  watchQuery(newQuery) {
    if (!this.is_filter_on) {
      this.fetchData()
    } else {
      this.fetchDataWithFilter(newQuery)
    }
  },
  computed: {
    upload_date_range: function() {
      const this_year  = new Date().getFullYear();
      return {
        '0': '~' + (this_year - 4),
        '1': String(this_year - 3),
        '2': String(this_year - 2),
        '3': String(this_year - 1),
        '4': String(this_year)
      }
    },
    is_filter_on() {
      let flag = false;
      Object.keys(this.filters).forEach(key => {
        if (key === "duration(ISO 8601)" || key === "uploadDate") {
          if (this.filters[key][0] !== 0 || this.filters[key][1] !== 4) {
            flag = true;
          }
        } else if (this.filters[key].length !== 0) {
          flag = true;
        }
      });
      return flag;
    }
  },
  watch: {
    filters: {
      handler: function(val) {
        setTimeout(() => {
          if (!this.is_filter_on) {
            this.$router.push(this.localePath({ name: 'result', query: { query: this.$route.query.query, page: 1 } }))
            this.$refs.pagination.changeCurrentPage(1)
          } else {
            let param = Object.assign({}, this.filters);
            // 空のプロパティは削除
            Object.keys(param).forEach(key => {
              if(key === "duration(ISO 8601)" || key === "uploadDate") {
                if(param[key][0] === 0 && param[key][1] === 4 ) {
                  delete param[key]
                } else if (key === "duration(ISO 8601)") {
                  param[key] = param[key].map(data => {
                    if(this.duration_range[data].indexOf('~') !== -1) {
                      data = 30
                    } else {
                      data = this.duration_range[data].replace('分', '')
                    }
                    return Number(data)
                  })
                  if(param[key][1] === 30) {
                    param[key][1] = 0
                  }
                } else if (key === "uploadDate") {
                  if(param["uploadDate"][0] === 0 && param["uploadDate"][1] === 4 ) {
                    delete param["uploadDate"]
                  } else {
                    if(Number(param["uploadDate"][0]) < 2000) {
                      const this_year  = new Date().getFullYear();
                      param["uploadDate"] = param["uploadDate"].map(data => {
                        data = Number(this_year) - (Number(data) - 4) * -1
                        return data
                      })
                    }
                  }

                  // param[key] = param[key].map(data => {
                  //   data = Number(data) - 4
                  //   if (data < 0) {
                  //     data = -data
                  //   }
                  //   return data
                  // })
                  // if(param[key][0] === 4) {
                  //   param[key][0] = 0
                  // }
                }
              } else {
                param[key] = param[key].filter(data => data !== "");
                if (param[key].length === 0) {
                  delete param[key];
                }
              }
            });
            
            // 配列を文字列に変換
            Object.keys(param).forEach(key => {
              param[key] = param[key].join(",");
            });
            param["page"] =  1;
            param["query"] = this.$route.query.query;
            this.$refs.pagination.changeCurrentPage(1)
            this.$router.push(this.localePath({ name: 'result', query: param }))
            this.fetchDataWithFilter(param)
          }
        }, 0);
      },
      deep: true
    }
  },
  mounted() {
    if (
        this.$route.query.type !== undefined ||
        this.$route.query.uploadDate !== undefined ||
        this.$route.query.tags !== undefined ||
        this.$route.query.lang !== undefined ||
        this.$route.query['duration(ISO 8601)'] !== undefined
    ) {
      Object.keys(this.filters).forEach(key => {
        if (this.$route.query[key] !== undefined) {
          if (key === "uploadDate") {
            let update_year_param = this.$route.query["uploadDate"].split(',')
            const this_year  = Number(new Date().getFullYear());
            let upload_date = []
            upload_date.push(Number(update_year_param[0]) - this_year + 4)
            upload_date.push(Number(update_year_param[1]) - this_year + 4)
            this.filters["uploadDate"] = upload_date
          } else {
          this.filters[key] = this.$route.query[key].split(',')
          }
        }
      })
    } else {
      this.fetchData()
    }

    axios
      .get(`https://togotv-api.dbcls.jp/api/facets/keywords`)
      .then(data => {
        this.tag_list = data.data.facets
      })
      .catch(error => {
        console.log('error', error)
      })
  },
  methods: {
    switchTypeTab(type) {
      this.filters.type = []
      this.filters.type.push(type)
    },
    toggleDisplay() {
      this.$store.commit('toggleDisplay')
    },
    fetchData() {
      setTimeout(() => {
        this.is_loading = true
        if ( !this.is_filter_on ) {
          axios.get(`https://togotv-api.dbcls.jp/api/bool_search?from=${this.$route.query.page}&text=${this.$route.query.query}&rows=20`).then(data => {
            this.lastpage = data.data.last_page
            this.result_list = data.data.data
            this.is_loading = false
          })
        }
      }, 0)
    },
    clearFilter() {
      this.filters.type = ['動画マニュアル']
      this.filters.uploadDate = [0, 4]
      this.filters.tags = []
      this.filters.lang = []
      this.filters['duration(ISO 8601)'] = [0, 4]
    },
    fetchDataWithFilter(param) {
      this.is_loading = true
      let query = Object.assign({}, param)
      query['rows'] = 20
      query["target"] = "movies";
      query['text'] = param.query
      query['from'] = param.page
      delete query['query']
      delete query['page']
      axios
        .get("https://togotv-api.dbcls.jp/api/bool_search", {
          params: query
        })
        .then(data => {
          this.lastpage = data.data.last_page
          this.result_list = data.data.data
          this.is_loading = false
        })
        .catch(error => {
          console.log("error", error);
        });
    }
  }
})
</script>

<style lang="sass">
.result_wrapper
  padding: 0 $VIEW_PADDING
  display: flex
  align-items: flex-start
  justify-content: flex-start
  > .facet_wrapper
    @include facet
    > p.facet_title
      font-size: 18px
      display: flex
      align-items: center
      margin: 30px 0 14px -3px
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
        > .toggle_btn
          @include toggle_arrow
        > span.clear_btn
          font-family: "游ゴシック", "Yu Gothic", "游ゴシック体", YuGothic, sans-serif
          font-weight: 500
          font-size: 12px
          text-decoration: underline
          margin-left: 7px
          &:hover
            cursor: pointer
      > .checkbox_wrapper
        transition: .5s
        max-height: 100vh
        &.close
          max-height: 0
          overflow: hidden
        ul
          li
            position: relative
            > label
              > span
                margin-left: 27px
                padding-top: 1px
            > input[type=checkbox]
              @include checkbox
              margin-left: 3px
      > .vue-slider
        @include vue-slider
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
          white-space: nowrap
          > .duration_time
            font-size: 14px
            position: absolute
            left: -90%
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
  > .video_section
    > .video_section_header
      display: flex
      justify-content: space-between
      min-width: 60vw
      > .page_title
        @include page_title('search_color')
        &:before
          margin-right: -8px
      > ul.display_icon_wrapper
        display: flex
        margin-top: 55px
        > li
          margin-left: 4px
          > img
            width: 27px
            &:hover
              cursor: pointer
    > .span_tab_wrapper
      display: flex
      margin-bottom: 8px
      > .span_tab
        font-size: 18px
        margin-right: 40px
        padding: 0 10px 22px
        &:hover
          cursor: pointer
        &.active
          @include blue_underline
          background-position: 10px 26px
    > .loader
      @include loader

@media screen and (max-width: 480px)
  .result_wrapper
    padding: 0 $VIEW_PADDING_SP
    flex-direction: column-reverse
    > .video_section
      > .video_section_header
        flex-wrap: wrap
        flex-direction: column
        > ul.display_icon_wrapper
          margin: 0 0 10px auto
        > .page_title
          margin-bottom: 5px

</style>
