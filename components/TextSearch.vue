<template>
  <div :class="['input_wrapper', props]">
    <input
      type="text"
      :placeholder="$t('search_videos_by_keyword')"
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
      if (type === "enter") {
        if (!this.canMessageSubmit) {
          return;
        }
        let query = { name: 'result', query: { query: this.keyword, type: '動画マニュアル', page: "1" } }
        if(this.keyword === '') {
          delete query.query.query
        }
        if(this.$i18n.locale === 'ja') {
          this.$router.push(this.localePath(query))
        } else if (this.$i18n.locale === 'en') {
          query.query.lang = "en"
          this.$router.push(this.localePath(query))
        }
      } else if (type === "click") {
        this.$router.push(this.localePath(query))
        if(this.$i18n.locale === 'ja') {
          this.$router.push(this.localePath(query))
        } else if (this.$i18n.locale === 'en') {
          query.query.lang = "en"
          this.$router.push(this.localePath(query))
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

@media screen and (max-width: 896px)
  div.input_wrapper
    > input
      width:  80vw
    &.index
      > input
        width: 80%
      > button
        right: 42px
</style>
