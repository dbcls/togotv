<template>
  <div class="pagination_wrapper">
    <span
      v-if="currentpage !== 1"
      @click="fetchPost(1)"
      class="arrow"
    ></span>
    <ul v-if="totalpage <= 5">
      <li
        v-for="index in totalpage"
        :key="index"
        :class="['pagination', isCurrentPage(index)]"
        @click="fetchPost(index)"
      >{{ index }}</li>
    </ul>
    <ul v-else>
      <li
        v-for="index in 5"
        :key="index"
        :class="['pagination', isCurrentPage(currentpageRange[0] - 1 + index)]"
        @click="fetchPost(currentpageRange[0] - 1 + index)"
      >{{ currentpageRange[0] - 1 + index }}</li>
    </ul>
    <span
      v-if="currentpage !== Number(totalpage)"
      @click="fetchPost(totalpage)"
      class="arrow"
    ></span>
  </div>
</template>
​
<script>
const POSTS_PER_PAGE = 10;

export default Vue.extend({
  props: {
    data: {}
  },
  data() {
    return {
      currentpageRange: []
    };
  },
  computed: {
    totalpage() {
      return Math.ceil(this.data.total_entry / POSTS_PER_PAGE);
    },
    currentpage: {
      get() {
        if (this.$route.query.page !== undefined) {
          this.fetchPost(Number(this.$route.query.page));
          return Number(this.$route.query.page);
        }
        return ''
      },
      set(value) {
        this.value = value;
      }
    }
  },
  methods: {
    isCurrentPage(index) {
      if (Number(index) === Number(this.currentpage)) {
        return "active";
      }
    },
    changeCurrentPageRange() {
      if (this.totalpage <= 5) {
        this.currentpageRange = [1, this.totalpage];
      } else if (this.currentpage === 1 || this.currentpage === 2) {
        this.currentpageRange = [1, 5];
      } else if (
        this.currentpage === this.totalpage ||
        this.currentpage === this.totalpage - 1
      ) {
        this.currentpageRange = [this.totalpage - 4, this.totalpage];
      } else {
        this.currentpageRange = [this.currentpage - 2, this.currentpage + 2];
      }
    },
    changeCurrentPage(page) {
      this.currentpage = page;
      this.changeCurrentPageRange();
    },
    fetchPost(page) {
      this.$emit("fetchPost", page);
    }
  }
});
</script>
​
<style lang="sass" scoped>
.pagination_wrapper
  position: absolute
  bottom: 25px
  left: 50%
  transform: translateX(-50%)
  display: flex
  justify-content: center
  align-items: center
  > span.arrow
    font-size: 12px
    color: $MAIN_COLOR
    &:hover
      cursor: pointer
  > ul
    display: flex
    justify-content: center
    margin: 0 20px
    > .pagination
      width: 25px
      height: 25px
      border-radius: 3px
      font-size: 14px
      font-weight: bold
      padding-top: 1px
      color: #999999
      display: flex
      align-items: center
      justify-content: center
      margin-right: 14px
      &.active
        color: $COLOR_5
        border: 1px solid $COLOR_5
      &:hover
        cursor: pointer
        color: #fff
        background-color: $COLOR_5
      &:last-of-type
        margin-right: 0
</style>
