<template>
  <div>
    <Header />
    <nuxt />
    <Footer />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'
import '~/assets/js/font.js'

export default Vue.extend({
  components: {
    Header,
    Footer
  }
})
</script>

<style lang="sass">
html
  font-family: "游ゴシック", "Yu Gothic", "游ゴシック体", YuGothic, sans-serif
  color: $BLACK
  box-sizing: border-box
  padding-top: 78.88px

ul,ol
  list-style: none
  margin: 0
  padding: 0

.tsukushi
  font-family: fot-tsukuardgothic-std, sans-serif
  font-weight: 400
  font-style: normal
  &.bold
    font-weight: 600

.mont
  font-family: montserrat, sans-serif
  font-weight: 500
  font-style: normal
  &.bold
    font-weight: 700
    letter-spacing: 1px

.bg_blue
  background-color: rgba(235, 247, 249, .67)

.scroll-horizontal
  overscroll-behavior-x: contain
</style>
