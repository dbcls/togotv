<template>
  <aside class="aside_wrapper">
    <section class="course_wrapper">
      <p class="section_title tsukushi bold">スキル別コースから探す</p>
      <ul>
        <li v-for="course in course" :key="course.id">
          <span>
            <nuxt-link class="tsukushi" :to="{name: 'course', query: {id: course.id}}">{{ course.title }}</nuxt-link>
          </span>
        </li>
      </ul>
    </section>
    <section class="tag_wrapper">
      <p class="section_title tsukushi bold">タグから探す</p>
      <ul>
        <li v-for="tag in tag_list" :key="tag.id">
          <nuxt-link :to="{name: 'tag', query: {name: tag.name}}">{{ tag.name }}</nuxt-link>
        </li>
      </ul>
    </section>
  </aside>
</template>

<script lang="ts">
import Vue from 'vue'
import course from '~/static/json/test/course.json'
import tag_list from '~/static/json/test/tag.json'

export default Vue.extend({
  data () {
    return {
      course: course.courses,
      tag_list: tag_list.tag_list
    }
  },
  methods: {
  }
})
</script>

<style lang="sass" scoped>
.aside_wrapper
  width: 280px
  min-width: 280px
  margin-right: 40px
  margin-top: 36px
  .section_title
    font-size: 18px
  a
    color: $BLACK
    text-decoration: none
    line-height: 24px
  > .course_wrapper
    > ul
      > li
        margin-bottom: 8px
        > span
          display: flex
          align-items: flex-start
          justify-content: flex-start
          &:before
            min-width: 25px
            width: 25px
            height: 25px
            margin-right: 1px
            @include icon('course')
          > a
            font-size: 18px
            &:hover
              text-decoration: underline
  > .tag_wrapper
    margin-top: 28px
    > ul
      > li
        margin-bottom: 9px
        > a
          @include tag
</style>
