<template>
  <aside class="aside_wrapper">
    <section class="course_wrapper">
      <p class="section_title tsukushi bold"><nuxt-link :to="localePath({ name: 'courses' })">{{ $t("search_for_courses") }}</nuxt-link></p>
      <ul>
        <li v-for="course in course_list" :key="course.id">
          <span>
            <nuxt-link class="tsukushi" :to="localePath({name: 'course', query: {id: course.id}})">{{ course.title }}</nuxt-link>
          </span>
        </li>
      </ul>
    </section>
    <section class="tag_wrapper">
      <p class="section_title tsukushi bold">{{ $t("search_for_tags") }}</p>
      <ul>
        <li v-for="(tag, index) in tag_list" :key="index">
          <nuxt-link :to="localePath({name: 'tag', query: {name: tag.key}})">{{ tag.key }}</nuxt-link>
        </li>
      </ul>
    </section>
  </aside>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'

export default Vue.extend({
  data() {
    return {
      course_list: [],
      tag_list: []
    }
  },
  mounted() {
    axios
      .get(`https://togotv-api.dbcls.jp/api/skillset`)
      .then(data => {
        this.course_list = data.data.cources
      })
      .catch(error => {
        console.log('error', error)
      })

    axios
      .get(`https://togotv-api.dbcls.jp/api/facets/keywords`)
      .then(data => {
        this.tag_list = data.data.facets
      })
      .catch(error => {
        console.log('error', error)
      })
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
    > a
      &:hover
        color: $MAIN_COLOR
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
