<template>
  <ul v-if="illustration_list.length !== 0" class="illustration_list_wrapper">
    <li class="single_picture" v-for="picture in illustration_list" :key="picture.TOGOTV_Image_ID">
      <a @click="moveDetailPage(`/${picture.id.split('/').pop()}.html`)">
        <img
          :src="`https://dbarchive.biosciencedbc.jp/data/togo-pic/image/${picture.png}`"
          :alt="picture.name"
          loading="lazy"
        />
      </a>
      <div :class="['description_wrapper', $i18n.locale]">
        <p v-if="$i18n.locale === 'ja'" class="name tsukushi bold">{{ picture.name }}</p>
        <p v-if="$i18n.locale === 'en'" :class="['name_en', 'mont', $i18n.locale === 'en' ? 'name' : '']">{{ picture.name_en }}</p>
      </div>
    </li>
  </ul>
</template>

<script>
import Vue from 'vue'
export default Vue.extend({
  props: {
    illustration_list: {
      type: Array,
      required: true,
    }
  },
  data () {
    return {
    }
  },
  methods: {
    selectPic(pic, e) {
      e.stopPropagation();
      this.$emit('selectPic', pic);
    },
    moveDetailPage(next_page) {
      this.$router.push(this.localePath((next_page)));
    },
  },
})
</script>

<style lang="sass" scoped>
.illustration_list_wrapper
  display: flex
  margin: 0 $VIEW_PADDING
  > li.single_picture
    position: relative
    > a
      display: inline-block
      margin-right: 20px
      margin-bottom: 20px
      position: relative
      > img
        width: 100%
        max-height: 150px
        object-fit: contain
        transition: .3s
        &:hover
          cursor: pointer
          transform: translate(-10px, -4px)
          filter: drop-shadow(15px 8px 0px rgba(253, 211, 101, .8))
    > .description_wrapper
      display: none
      pointer-events: none
      text-align: center
      position: absolute
      z-index: 4
      background-color: $MAIN_COLOR
      border-radius: 9px
      bottom: -40px
      left: 0
      color: #fff
      box-shadow: 0 3px 20px rgba(0, 0, 0, 0.4)
      padding: 2px 11px
      box-sizing: border-box
      min-width: 140px
      max-width: 160px
      &:before
        content: ""
        position: absolute
        top: -18px
        left: 50%
        transform: translateX(-50%)
        border: 10px solid transparent
        border-bottom: 10px solid $MAIN_COLOR
      > p
        font-size: 14px
      > a.button
        @include download_btn
      &.en
        width: 300px
        > p.name
          margin-bottom: 21px
    &:hover
      > .description_wrapper
        display: block

@media screen and (max-width: 896px)
  .illustration_list_wrapper
    margin: 0 $VIEW_PADDING_SP
    > li.single_picture
      > a
        > img
          &:hover
            transform: none
            filter: none
      &:hover
        > .description_wrapper
          display: none

@media screen and (min-width: 1500px) and (max-width: 1800px)
  // .illustration_list_wrapper > li.single_picture:nth-child(n + 10)
  //   display: none
@media screen and (min-width: 1200px) and (max-width: 1500px)
  .illustration_list_wrapper > li.single_picture:nth-child(n + 10)
    display: none
@media screen and (min-width: 896px) and (max-width: 1200px)
  .illustration_list_wrapper > li.single_picture:nth-child(n + 8)
    display: none
@media screen and (min-width: 480px) and (max-width: 896px)
  .illustration_list_wrapper > li.single_picture:nth-child(n + 7)
    display: none
@media screen and (max-width: 480px)
  .illustration_list_wrapper > li.single_picture:nth-child(n + 5)
    display: none
</style>
