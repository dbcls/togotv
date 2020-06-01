<template>
  <div :class="['input_wrapper', props]">
    <input
      type="text"
      placeholder="動画を検索"
      v-model="keyword"
      @keyup.enter="submit('enter')"
      @keypress="setCanMessageSubmit()"
    />
    <button @click="submit('click')"></button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    props: {
      required: true
    }
  },
  data() {
    return {
      keyword: '',
      canMessageSubmit: false
    }
  },
  methods: {
    setCanMessageSubmit() {
      this.canMessageSubmit = true;
    },
    submit(type: string) {
      if(this.keyword === '') {
        return;
      }
      if (type === "enter") {
        if (!this.canMessageSubmit) {
          return;
        }
        this.$router.push({ name: 'result', query: { query: this.keyword } })
      } else if (type === "click") {
        this.$router.push({ name: 'result', query: { query: this.keyword } })
      }
    }
  }
})
</script>

<style lang="sass" scoped>
div.input_wrapper
  @include text_input
  > input
    width: 281px
    height: 33px
  > button
    width: 25px
    height: 25px
  &.index
    margin-top: 15px
    width: 334px
    > input
      width: 334px
      height: 36px
      border: none
      background-color: #F6F5F5
    > button
      top: 49%
      right: 15px
      &:hover
        cursor: pointer
</style>
