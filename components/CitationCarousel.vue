<template>
  <div
    :class="[
      'citation_list_wrapper',
      btn_state.left ? '' : 'left_hide',
      btn_state.right ? '' : 'right_hide',
    ]"
    @mouseenter="pauseAutoScroll"
    @mouseleave="resumeAutoScroll"
  >
    <ScrollBtn
      @toggleBtn="toggleBtn"
      :props="{ id: 'citation-right', direction: 'left' }"
    />
    <ul class="citation_list scroll-horizontal">
      <li
        class="citation_card"
        v-for="(paper, index) in citations"
        :key="paper.doi || index"
      >
        <a
          :href="paper.doi ? `https://doi.org/${paper.doi}` : '#'"
          target="_blank"
          rel="noopener noreferrer"
          class="card_link"
        >
          <span class="new_badge" v-if="paper.isNew">New citation this week!</span>
          <p class="paper_title">{{ paper.title }}</p>
          <p class="paper_authors">{{ truncateAuthors(paper.authors) }}</p>
          <div class="paper_meta">
            <span class="journal_name">{{ paper.journal }}</span>
            <span class="paper_year mont bold" v-if="paper.year">{{ paper.year }}</span>
          </div>
          <p class="paper_doi mont" v-if="paper.doi">DOI: {{ paper.doi }}</p>
          <p class="paper_cited mont" v-if="paper.citedByCount > 0">
            Cited by {{ paper.citedByCount }}
          </p>
        </a>
      </li>
    </ul>
    <ScrollBtn
      @toggleBtn="toggleBtn"
      :props="{ id: 'citation-left', direction: 'right' }"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ScrollBtn from '~/components/ScrollBtn.vue'

export default Vue.extend({
  props: {
    citations: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      btn_state: {
        left: false,
        right: true,
      },
      autoScrollTimer: null as ReturnType<typeof setInterval> | null,
      autoScrollInterval: 4000,
      isAnimating: false,
    }
  },
  components: {
    ScrollBtn,
  },
  mounted() {
    this.startAutoScroll()
  },
  beforeDestroy() {
    this.stopAutoScroll()
  },
  methods: {
    toggleBtn(command: string) {
      // Suppress btn_state updates during auto-scroll animation to avoid Safari flicker
      if (this.isAnimating) return
      if (command === 'hide_left') {
        this.btn_state.left = false
      } else if (command === 'hide_right') {
        this.btn_state.right = false
      } else if (command === 'open_both') {
        this.btn_state.right = true
        this.btn_state.left = true
      }
    },
    truncateAuthors(authors: string): string {
      if (!authors) return ''
      const authorList = authors.split(', ')
      if (authorList.length <= 3) return authors
      return `${authorList.slice(0, 3).join(', ')} et al.`
    },
    getScrollContainer(): HTMLElement | null {
      const wrapper = this.$el as HTMLElement
      if (!wrapper) return null
      return wrapper.querySelector('.scroll-horizontal') as HTMLElement
    },
    // Manual smooth scroll using requestAnimationFrame (Safari-safe)
    smoothScrollTo(container: HTMLElement, targetLeft: number, duration: number) {
      if (this.isAnimating) return
      this.isAnimating = true
      const startLeft = container.scrollLeft
      const distance = targetLeft - startLeft
      const startTime = performance.now()

      const step = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        // easeInOutCubic
        const ease = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2
        container.scrollLeft = startLeft + distance * ease
        if (progress < 1) {
          requestAnimationFrame(step)
        } else {
          this.isAnimating = false
        }
      }
      requestAnimationFrame(step)
    },
    autoScrollStep() {
      const container = this.getScrollContainer()
      if (!container || this.isAnimating) return
      const maxScroll = container.scrollWidth - container.clientWidth
      if (container.scrollLeft >= maxScroll - 1) {
        this.smoothScrollTo(container, 0, 600)
      } else {
        const targetLeft = Math.min(container.scrollLeft + 292, maxScroll)
        this.smoothScrollTo(container, targetLeft, 600)
      }
    },
    startAutoScroll() {
      if (this.autoScrollTimer) return
      this.autoScrollTimer = setInterval(() => {
        this.autoScrollStep()
      }, this.autoScrollInterval)
    },
    stopAutoScroll() {
      if (this.autoScrollTimer) {
        clearInterval(this.autoScrollTimer)
        this.autoScrollTimer = null
      }
    },
    pauseAutoScroll() {
      this.stopAutoScroll()
    },
    resumeAutoScroll() {
      this.startAutoScroll()
    },
  },
})
</script>

<style lang="sass" scoped>
.citation_list_wrapper
  width: 100%
  position: relative
  overflow: hidden
  &:before, &:after
    content: ''
    display: inline-block
    width: calc(#{$VIEW_PADDING} + 83px)
    height: 100%
    position: absolute
    top: 0
    z-index: $LAYER_2
    opacity: 1
    transition: opacity .2s
  &:before
    background: linear-gradient(to right, #EEF9FA 0%, #EEF9FA $VIEW_PADDING, rgba(235, 247, 249, 0.25) 63%, rgba(255, 255, 255, 0))
    left: 0
  &:after
    background: linear-gradient(to left, #EEF9FA 0%, #EEF9FA $VIEW_PADDING, rgba(235, 247, 249, 0.25) 63%, rgba(255, 255, 255, 0))
    right: 0
  &.left_hide
    &:before
      opacity: 0
  &.right_hide
    &:after
      width: $VIEW_PADDING
      background-color: rgba(235, 247, 249, .67)
  .citation_list
    overflow: hidden
    overflow-x: scroll
    display: flex
    align-items: stretch
    position: relative
    scrollbar-width: none
    padding: 8px 0 16px
    &::-webkit-scrollbar
      display: none
    > .citation_card
      min-width: 280px
      max-width: 280px
      padding-right: 12px
      &:nth-of-type(1)
        margin-left: $VIEW_PADDING
      &:last-of-type
        padding-right: $VIEW_PADDING
      > .card_link
        display: flex
        flex-direction: column
        height: 100%
        background-color: #fff
        border-radius: 6px
        padding: 16px
        box-shadow: 0 2px 8px rgba(0, 0, 0, .08)
        text-decoration: none
        color: $BLACK
        transition: box-shadow .2s, transform .2s
        box-sizing: border-box
        &:hover
          box-shadow: 0 4px 16px rgba(0, 0, 0, .15)
          transform: translateY(-2px)
        > .new_badge
          display: inline-block
          background-color: $DEEP_MAIN_COLOR
          color: #fff
          font-size: 10px
          font-weight: bold
          padding: 2px 8px
          border-radius: 3px
          margin-bottom: 6px
        > .paper_title
          font-size: 13px
          font-weight: bold
          line-height: 1.5
          margin: 0 0 8px
          display: -webkit-box
          -webkit-line-clamp: 3
          -webkit-box-orient: vertical
          overflow: hidden
        > .paper_authors
          font-size: 11px
          color: #666
          line-height: 1.4
          margin: 0 0 8px
          white-space: nowrap
          overflow: hidden
          text-overflow: ellipsis
        > .paper_meta
          margin: 0 0 6px
          display: flex
          align-items: center
          gap: 6px
          flex-wrap: wrap
          > .journal_name
            font-size: 11px
            color: $MAIN_COLOR
            font-weight: bold
            white-space: nowrap
            overflow: hidden
            text-overflow: ellipsis
            max-width: 180px
          > .paper_year
            font-size: 11px
            color: #999
        > .paper_doi
          font-size: 10px
          color: #999
          margin: 0 0 4px
          white-space: nowrap
          overflow: hidden
          text-overflow: ellipsis
        > .paper_cited
          font-size: 10px
          color: $DEEP_MAIN_COLOR
          font-weight: bold
          margin: auto 0 0
  button
    top: 50%
    transform: translateY(-50%)
    z-index: $LAYER_3

@media screen and (max-width: 896px)
  .citation_list_wrapper
    &:before, &:after
      width: calc(#{$VIEW_PADDING_SP} + 25px)
    &:before
      background: linear-gradient(to right, #EEF9FA 0%, #EEF9FA $VIEW_PADDING_SP, rgba(235, 247, 249, 0.25) 75%, rgba(255, 255, 255, 0))
    &:after
      background: linear-gradient(to left, #EEF9FA 0%, #EEF9FA $VIEW_PADDING_SP, rgba(235, 247, 249, 0.25) 75%, rgba(255, 255, 255, 0))
    &.right_hide
      &:after
        width: $VIEW_PADDING_SP
    .citation_list
      > .citation_card
        min-width: 240px
        max-width: 240px
        &:nth-of-type(1)
          margin-left: $VIEW_PADDING_SP
        &:last-of-type
          padding-right: $VIEW_PADDING_SP
</style>
