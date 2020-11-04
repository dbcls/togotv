<template>
  <div class="pagination_wrapper">
    <div v-if="!props.is_null" class="pagination_inner">
      <span
        v-if="currentpage !== 1"
        @click="fetchData(1)"
        class="arrow left"
      ></span>
      <span
        v-if="currentpage !== 1"
        @click="fetchData(currentpage - 1)"
        class="single_arrow left"
      ></span>
      <ul v-if="lastpage <= 5 && typeof lastpage === 'number'">
        <li
          v-for="index in lastpage"
          :key="index"
          :class="['pagination', 'mont', isCurrentPage(index)]"
          @click="fetchData(index)"
        >{{ index }}</li>
      </ul>
      <ul v-if="lastpage > 5 && typeof lastpage === 'number'">
        <li
          v-for="index in 5"
          :key="index"
          :class="['pagination', 'mont', isCurrentPage(currentpageRange[0] - 1 + index)]"
          @click="fetchData(currentpageRange[0] - 1 + index)"
        >{{ currentpageRange[0] - 1 + index }}</li>
      </ul>
      <span
        v-if="currentpage !== Number(lastpage)"
        @click="fetchData(currentpage + 1)"
        class="single_arrow right"
      ></span>
      <span
        v-if="currentpage !== Number(lastpage)"
        @click="fetchData(lastpage)"
        class="arrow right"
      ></span>
    </div>
  </div>
</template>
​
<script>
import Vue from 'vue'
const POSTS_PER_PAGE = 10;

export default Vue.extend({
  props: {
    props: {
      type: Object,
      required: true
    }
  },
  computed: {
    lastpage :function() {
      return this.props.lastpage
    }
  },
  data() {
    return {
      currentpageRange: [],
      currentpage: 1,
      is_loaded: false
    };
  },
  mounted() {
    if (this.$route.query.page !== undefined) {
      this.currentpage = Number(this.$route.query.page)
      this.changeCurrentPageRange()
    }
  },
  methods: {
    isCurrentPage(index) {
      if (Number(index) === Number(this.currentpage)) {
        return "active";
      }
    },
    changeCurrentPageRange() {
      if (this.lastpage <= 5) {
        this.currentpageRange = [1, this.lastpage];
      } else if (this.currentpage === 1 || this.currentpage === 2) {
        this.currentpageRange = [1, 5];
      } else if (
        this.currentpage === this.lastpage ||
        this.currentpage === this.lastpage - 1
      ) {
        this.currentpageRange = [this.lastpage - 4, this.lastpage];
      } else {
        this.currentpageRange = [this.currentpage - 2, this.currentpage + 2];
      }
    },
    changeCurrentPage(page) {
      scrollTo(0, 0);
      this.currentpage = page;
      this.changeCurrentPageRange();
    },
    fetchData(page) {
      let query_object = JSON.parse(JSON.stringify(this.$route.query))
      query_object.page = page
      let query_text = ''
      Object.keys(query_object).forEach((key, index) => {
        if(index === 0) {
          query_text += '?'
        } else {
          query_text += '&'
        }
        query_text += `${key}=${query_object[key]}`
      })
      if (this.$route.path.indexOf('result') !== -1) {
        this.changeCurrentPage(page);
        this.$router.push(this.localePath(`/result.html${query_text}`))
      } else if (this.$route.path.indexOf('ajacs') !== -1) {
        this.changeCurrentPage(page);
        this.$router.push(this.localePath(`/ajacs_text.html${query_text}`))
      } else {
        this.$emit("fetchData", page, false);
      }
    }
  }
});
</script>
​
<style lang="sass" scoped>
.pagination_wrapper
  > div.no_data
    text-align: center
    font-size: 20px
  > div.pagination_inner
    display: flex
    justify-content: center
    align-items: center
    margin-top: 30px
    > span.arrow, span.arrow:after, span.single_arrow
      display: inline-block
      width: 8px
      height: 8px
      border-top: 1px solid rgba(51, 51, 51, .5)
      border-right: 1px solid rgba(51, 51, 51, .5)
    > span.single_arrow
      &:hover
        cursor: pointer
    > span.arrow
      &:after
        content: ''
        margin: 0px 0px 3px -4px
      &:hover
        cursor: pointer
    > span.arrow.right,
    > span.single_arrow.right
      transform: rotate(45deg)
      margin-left: 20px
    > span.arrow.left,
    > span.single_arrow.left
      transform: rotate(-135deg)
      margin-right: 20px
    > ul
      display: flex
      justify-content: center
      > .pagination
        width: 35px
        height: 35px
        border-radius: 100px
        font-size: 18px
        font-weight: 600
        color: rgba(51, 51, 51, .5)
        display: flex
        align-items: center
        justify-content: center
        margin-right: 14px
        &.active,
        &:hover
          color: $MAIN_COLOR
          background-color: $POINT_COLOR
          cursor: pointer
        &:last-of-type
          margin-right: 0
</style>
