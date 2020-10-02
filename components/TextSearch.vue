<template>
  <div :class="['input_wrapper', props]">
    <input
      type="text"
      :placeholder="$t('search_videos')"
      v-model="keyword"
      @keyup.enter="submit('enter')"
      @keypress="setCanMessageSubmit()"
    />
    <button @click="submit('click')"></button>
  </div>
</template>

<script>
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
    submit(type) {
      if(this.keyword === '') {
        return;
      }
      if (type === "enter") {
        if (!this.canMessageSubmit) {
          return;
        }
        if(this.$i18n.locale === 'ja') {
          this.$router.push(this.localePath({ name: 'result', query: { query: this.keyword, page: "1" } }))
        } else if (this.$i18n.locale === 'en') {
          this.$router.push(this.localePath({ name: 'result', query: { query: this.keyword, page: "1", lang: "en" } }))
        }
      } else if (type === "click") {
        this.$router.push(this.localePath({ name: 'result', query: { query: this.keyword, page: "1" } }))
        if(this.$i18n.locale === 'ja') {
          this.$router.push(this.localePath({ name: 'result', query: { query: this.keyword, page: "1" } }))
        } else if (this.$i18n.locale === 'en') {
          this.$router.push(this.localePath({ name: 'result', query: { query: this.keyword, page: "1", lang: "en" } }))
        }
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
    > button
      top: 49%
      right: 15px
      &:hover
        cursor: pointer
</style>
