<template>
  <button @click="scrollHorizontally" :id="props.id" :class="['btn_scroll_next', props.direction, props.id, checkXScroll()]"></button>
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
      const scroll_distance = target_section_width - this.bodyPadding() + 10;
      if(this.props.direction === "right") {
        x_distance = scroll_distance;
      } else {
        x_distance = -scroll_distance;
      }
      target_section.scrollBy({
        behavior: "smooth",
        left: x_distance,
        top: 0
      })
    },
    bodyPadding() {
      if(document.body.clientWidth > 896) {
        return 160;
      } else {
        return 40;
      }
    },
    childElementNum(): number {
      const clientWidth = document.body.clientWidth;
      const isShort = this.props.id.includes('related_videos')
      let num: number = 0
      if (clientWidth > 1800) num = isShort ? 5 : 6;
      if (clientWidth > 1500 && clientWidth <= 1800) num = isShort ? 4 : 5;
      if (clientWidth > 1200 && clientWidth <= 1500) num = isShort ? 3 : 4;
      if (clientWidth > 896 && clientWidth <= 1200) num = isShort ? 2 : 3;
      if (clientWidth <= 896) num = 2;
      return num;
    },
    toggleBtn () {
      let doc: any = document
      let parent: any = doc.getElementById(this.props.id).parentNode
      let target_section = parent.getElementsByClassName('scroll-horizontal')[0]
      let current_position_x: number = target_section.scrollLeft
      const child_width = target_section.children[1].getBoundingClientRect().width//子要素の幅
      const num_of_element = target_section.childElementCount//要素数
      let substraction: number = 0
      substraction =
        this.props.id.includes('video')
          ? child_width * this.childElementNum()
          : document.body.clientWidth - this.bodyPadding();
      if(current_position_x === 0) {
        this.btn_state.left = false
        this.$emit('toggleBtn', 'hide_left')
      } else if (Math.floor(current_position_x) >= Math.floor(child_width * num_of_element - substraction)) {
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
    left: 65px
    transform: translateY(calc(-50% - 15px)) rotate(180deg)
    &.course-left
      transform: rotate(180deg)

@media screen and (max-width: 896px)
  .btn_scroll_next
    display: none
</style>
