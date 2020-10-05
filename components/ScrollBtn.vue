<template>
  <button @click="scrollHorizontally" :id="props.id" :class="['btn_scroll_next', props.direction, checkXScroll()]"></button>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    props: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      btn_state: {
        left: false,
        right: true
      }
    }
  },
  mounted() {
    let doc: any = document
    let parent: any = doc.getElementById(this.props.id).parentNode
    let target_section: HTMLElement = parent.getElementsByClassName('scroll-horizontal')[0]
    target_section.addEventListener('scroll', this.throttle())
    target_section.addEventListener('scroll', this.debounce())
  },
  methods: {
    throttle() {
      const delay: number = 1000
      let time = Date.now()
      return () => {
        if((time + delay - Date.now()) < 0) {
          this.toggleBtn()
          time = Date.now()
        }
      }
    },
    debounce() {
      let timer: any
      const interval: number = 10
      return () => {
        clearTimeout(timer)
        timer = setTimeout(() => {
          this.toggleBtn()
        }, interval)
      }
    },
    checkXScroll() {
      if(this.props.direction === 'left' && !this.btn_state.left) {
        return 'hide'
      } else if (this.props.direction === 'right' && !this.btn_state.right) {
        return 'hide'
      } else {
        return ''
      }
    },
    scrollHorizontally (e: any) {
      let parent = e.target.parentNode
      let target_section: HTMLElement = parent.getElementsByClassName('scroll-horizontal')[0]
      let target_section_width: number = target_section.clientWidth
      let x_distance: number
      if(this.props.direction === "right") {
        x_distance = target_section_width
      } else {
        x_distance = -target_section_width
      }

      target_section.scrollBy({
        behavior: "smooth",
        left: x_distance,
        top: 0
      })
    },
    toggleBtn () {
      let doc: any = document
      let parent: any = doc.getElementById(this.props.id).parentNode
      let target_section = parent.getElementsByClassName('scroll-horizontal')[0]
      let current_position_x: number = target_section.scrollLeft
      const child_width = target_section.children[1].getBoundingClientRect().width//子要素の幅
      const num_of_element = target_section.childElementCount//要素数
      let substraction: number = 0
      if(document.body.clientWidth > 897) {
        substraction = document.body.clientWidth - 160
      } else {
        substraction = document.body.clientWidth - 40
      }
      if (this.props.id.indexOf('video') !== -1) {
        substraction += 10
      }
      // console.log('current_position_x', current_position_x)
      // console.log(Math.ceil(child_width * num_of_element - substraction))
      if(current_position_x === 0) {
        this.btn_state.left = false
        this.$emit('toggleBtn', 'hide_left')
      } else if (current_position_x === Math.ceil(child_width * num_of_element - substraction)) {
        this.btn_state.right = false
        this.$emit('toggleBtn', 'hide_right')
      } else {
        this.btn_state.left = true
        this.btn_state.right = true
        this.$emit('toggleBtn', 'open_both')
      }
    }
  }
})
</script>

<style lang="sass" scoped>
.btn_scroll_next
  width: 41px
  height: 41px
  border-radius: 100px
  background-color: $MAIN_COLOR
  box-shadow: 0 3px 6px rgba(0, 0, 0, .16)
  border: none
  position: absolute
  z-index: $LAYER_1
  transition: opacity .2s
  &.hide
    opacity: 0
  &:focus
    outline: 0
  &:after
    content: ''
    border: 7px solid transparent
    border-left: 10px solid #fff
    position: absolute
    top: 50%
    left: 64%
    transform: translate(-50%, -50%)
  &.right
    right: 65px
  &.left
    transform: rotate(180deg)
    left: 65px

@media screen and (max-width: 896px)
  .btn_scroll_next
    display: none
</style>
