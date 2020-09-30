<template>
  <div class="ajacs_list_wrapper">
    <div class="facet_wrapper" v-if="$store.state.display === 'card'">
      <p class="facet_title search tsukushi bold">{{ $t('text_search') }}</p>
      <div class="input_wrapper">
        <input
          type="text"
          :placeholder="$t('search_ajacs_text')"
          v-model="keyword"
          @keyup.enter="searchByText('enter')"
          @keypress="setCanMessageSubmit()"
        />
        <button @click="searchByText('click')"></button>
      </div>
      <p class="facet_title filter tsukushi bold">{{ $t('filter_search') }}</p>
      <p class="clear_btn" @click="clearFilter">{{ $t('clear_filter') }}</p>
      <div class="facet_small_section publish_date">
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
              <input type="checkbox" :id="tag.key" :value="tag.key" v-model="filters.keywords">
              <label :for="tag.key">
                <span>{{ tag.key }}</span>
              </label>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="gallery_wrapper">
      <div class="gallery_section_header">
        <h2 class="page_title tsukushi bold">{{ $t('search_ajacs_text') }}</h2>
      </div>
      <div class="table_wrapper">
        <table class="ajacs_list" v-if="!is_loading">
          <thead>
            <tr>
              <th>{{ $t('ajacs_title') }}</th>
              <th>{{ $t('lecturer') }}</th>
              <th>{{ $t('date') }}</th>
              <th>{{ $t('ajacs') }}</th>
              <th>{{ $t('related_tags') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(ajacs, index) in ajacs_list"
              :key="index"
            >
              <td class="title" @click="moveDetailPage({name: 'ajacs', params: { ajacs: ajacs.id.split('/').pop().replace(/\./g, '') }})">{{ ajacs.name }}</td>
              <td class="author">{{ ajacs.author }}</td>
              <td class="date">{{ ajacs.uploadDate }}</td>
              <td class="AJACS_jp">{{ ajacs.AJACS_jp }}</td>
              <td>
                <span @click="filters.keywords = [tag]" v-for="(tag, tag_index) in ajacs.keywords" :key="tag_index" :class="['tag', tag === '' ? 'hide': '']">{{ tag }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="is_loading" class="loader">Loading...</div>
      <Pagination ref="pagination" :props="{lastpage: lastpage}" @fetchData="fetchData" />
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import Pagination from '~/components/Pagination.vue'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'

export default Vue.extend({
  head() {
    return {
      title: "講習会資料を探す"
    };
  },
  components: {
    Pagination,
    VueSlider
  },
  mounted() {
    if(this.$route.query.page === undefined) {
      this.$router.push(this.localePath({ name: 'ajacs_text', query: { page: 1 } }))
    }
    if (
        this.$route.query.uploadDate !== undefined ||
        this.$route.query.keywords !== undefined ||
        this.$route.query.text !== undefined
    ) {
      if(this.$route.query.text !== undefined) {
        this.keyword = this.$route.query.text
      }
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
      this.fetchDataWithFilter(this.$route.query)
    } else {
      this.fetchData()
    }
    axios
      .get(`http://togotv-api.bhx.jp/api/facets/keywords?target=ajacs-training`)
      .then(data => {
        this.tag_list = data.data.facets
      })
      .catch(error => {
        console.log('error', error)
      })
  },
  data() {
    return {
      is_loading: false,
      keyword: "",
      canMessageSubmit: false,
      current_page: 1,
      lastpage: 0,
      ajacs_list: [],
      loaded_ajacs: [],
      tag_list: [],
      facets: {
        keywords: {
          checked: [],
          is_open: true
        }
      },
      facets_toggle_state: {
        tags: true
      },
      filters: {
        text: "",
        keywords: [],
        uploadDate: [0, 4]
      }
    };
  },
  watchQuery(newQuery) {
    if(newQuery["uploadDate"] !== undefined || newQuery["keywords"] !== undefined || newQuery["text"] !== undefined) {
      Object.keys(this.filters).forEach(key => {
        if (newQuery[key] !== undefined) {
          if (key === "uploadDate") {

          } else {
            this.filters[key] = newQuery[key].split(',')
          }
        }
      })
      this.fetchDataWithFilter(newQuery)
    } else {
      this.clearFilter()
      this.fetchData()
    }
  },
  watch: {
    filters: {
      handler: function(val) {
        setTimeout(() => {
          if (!this.is_filter_on) {
            this.$router.push(this.localePath({ name: 'ajacs_text', query: { page: 1 } }))
            this.$refs.pagination.changeCurrentPage(1)
          } else {
            let param = Object.assign({}, this.filters);
            // 空のプロパティは削除
            Object.keys(param).forEach(key => {
              if(key === "uploadDate") {
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
              } else if (key === "keywords") {
                param["keywords"] = param["keywords"].filter(data => data !== "");
                if (param["keywords"].length === 0) {
                  delete param["keywords"];
                }
              } else if (key === "text") {
                if(param["text"] === "") {
                  delete param["text"];
                }
              }
            });
            
            // 配列を文字列に変換
            Object.keys(param).forEach(key => {
              if (typeof param[key] === "object") {
                param[key] = param[key].join(",");
              }
            });
            param["page"] =  1;
            this.$refs.pagination.changeCurrentPage(1)
            this.$router.push(this.localePath({ name: 'ajacs_text', query: param }))
          }
        }, 0);
      },
      deep: true
    },
    keyword: function(val) {
      if (val === "") {
        this.clearFilter();
      }
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
      if(this.filters["uploadDate"][0] !== 0 || this.filters["uploadDate"][1] !== 4 || this.filters["keywords"].length !== 0 || this.filters["text"] !== "") {
        flag = true;
      }
      return flag;
    }
  },
  methods: {
    fetchData() {
      setTimeout(() => {
        this.is_loading = true
        axios
          .get(
            `http://togotv-api.bhx.jp/api/entries?target=ajacs-training&from=${this.$route.query.page}&rows=40`
          )
          .then(data => {
            this.ajacs_list = data.data.data
            this.lastpage = data.data.last_page
            this.is_loading = false
          })
          .catch(error => {
            console.log("error", error);
          });
      }, 0)
    },
    clearFilter() {
      this.filters.text = ""
      this.filters.uploadDate = [0, 4]
      this.filters.keywords = []
    },
    fetchDataWithFilter(param) {
      this.is_loading = true
      let query = Object.assign({}, param)
      query['rows'] = 20
      query['from'] = param.page
      delete query['query']
      delete query['page']
      axios
        .get("http://togotv-api.bhx.jp/api/bool_search?target=ajacs-training", {
          params: query
        })
        .then(data => {
          this.lastpage = data.data.last_page
          this.ajacs_list = data.data.data
          this.is_loading = false
        })
        .catch(error => {
          console.log("error", error);
        });
    },
    setCanMessageSubmit() {
      this.canMessageSubmit = true;
    },
    searchByText(type) {
      if (this.keyword === "") {
        return;
      }
      if (type === "enter") {
        if (!this.canMessageSubmit) {
          return;
        }
        this.filters.text = this.keyword
        // this.clearFilter();
        // axios
        //   .get(
        //     `http://togotv-api.bhx.jp/api/search?target=ajacs-training&text=${this.keyword}`
        //   )
        //   .then(data => {
        //     this.ajacs = data.data.data;
        //   })
        //   .catch(error => {
        //     console.log("error", error);
        //   });
      }
    },
    moveDetailPage(next_page) {
      this.$router.push(this.localePath(next_page));
    }
  }
});
</script>

<style lang="sass">
.ajacs_list_wrapper
  padding: 0 $VIEW_PADDING
  display: flex
  align-items: flex-start
  > .facet_wrapper
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
      padding-bottom: 14px
      &.publish_date
        padding-bottom: 24px
        margin-top: 20px
      &:last-of-type
        border-bottom: none
      > .facet_small_title
        font-size: 14px
        display: flex
        align-items: center
        &:before
          width: 23px
          height: 23px
        &.tag
          &:before
            @include icon('tag')
        &.calender
          &:before
            @include icon('calender')
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
        > .toggle_btn
          @include toggle_arrow
      > .vue-slider
        @include vue-slider
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
  > .gallery_wrapper
    width: 100%
    > .gallery_section_header
      display: flex
      justify-content: space-between
      > .page_title
        font-weight: 800
        @include page_title('file')
      > .control_wrapper
        margin-top: 22px
        display: flex
        align-items: center
        > .control_btn
          display: inline-block
          font-size: 13px
          border-radius: 100px
          border: none
          padding: 9.5px 25px
          margin-right: 15px
          white-space: nowrap
          transition: .3s
          background-color: $MAIN_COLOR
          color: #ffffff
          &.off
            color: #8e8e8e
            background: #e5e5e5
            pointer-events: none
          &:focus
            outline: none
          &:hover
            cursor: pointer
        > ul.display_icon_wrapper
          display: flex
          > li
            margin-left: 4px
            > img
              width: 27px
              &:hover
                cursor: pointer
    > .table_wrapper
      > table.ajacs_list
        border-collapse: collapse
        > thead
          font-size: 12px
          line-height: 32px
          text-align: left
          > tr
            > th
              border-top: 2px solid $MAIN_COLOR
              border-bottom: 1px solid $MAIN_COLOR
              padding-left: 10px
        > tbody
          font-size: 14px
          > tr
            > td
              padding: 8px 0 8px 10px
              position: relative
              &.date
                white-space: nowrap
              &.AJACS_jp
                min-width: 74px
              &.author
                min-width: 74px
              &:after
                @include dot_border_bottom
              &.title
                &:hover
                  cursor: pointer
                  text-decoration: underline
              > span.tag
                @include tag
                font-size: 12px
                line-height: 26px
                margin-right: 6px
                &.hide
                  display: none
    > .loader
      @include loader

@media screen and (max-width: 480px)
  .ajacs_list_wrapper
    padding: 0 $VIEW_PADDING_SP
    flex-direction: column
    > .facet_wrapper
      display: none
    > .gallery_wrapper
      > .table_wrapper
        width: 100%
        overflow: auto
        > table.ajacs_list
          width: 690px
</style>
