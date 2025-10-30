<template>
  <div class="thumbnail_wrapper">
    <img
      :class="['thumbnail', props.size, { has_aside: props.has_aside }]"
      :src="props.thumbnail"
      :alt="props.title"
      loading="lazy"
    />
    <div class="meta_wrappper">
      <span
        v-if="props.duration && props.duration !== ''"
        class="duration"
        v-html="converSecToHour(props.duration)"
      ></span>
    </div>
  </div>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  props: {
    props: {
      required: true,
    },
  },
  methods: {
    converSecToHour(time) {
      let hour = 0,
        min = 0,
        sec = 0;
      if (String(time).indexOf("PT") !== -1) {
        const reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
        if (reptms.test(time)) {
          const matches = reptms.exec(time);
          if (matches[1]) hour = Number(matches[1]);
          if (matches[2]) min = Number(matches[2]);
          if (matches[3]) sec = Number(matches[3]);
        }
      } else {
        sec = (time % 60) % 60;
        min = Math.floor(time / 60) % 60;
        hour = Math.floor(time / 3600);
      }
      let hour_unit = "";
      let min_unit = "";
      let sec_unit = "";
      if (this.$i18n.locale === "ja") {
        hour_unit = "時間";
        min_unit = "分";
        sec_unit = "秒";
      } else if (this.$i18n.locale === "en") {
        hour_unit = "h";
        min_unit = "min";
        sec_unit = "sec";
      }

      if (hour === 0) {
        return `<span class="time mont bold">${min}</span><span style="font-size: 12px; margin-right: 2px;">${min_unit}</span><span class="time mont bold">${sec}</span><span class="unit">${sec_unit}</span>`;
      } else {
        return `<span class="time mont bold">${hour}</span><span style="font-size: 12px; margin-right: 2px;">${hour_unit}</span><span class="time mont bold">${min}</span><span style="font-size: 12px; margin-right: 2px;">${min_unit}</span><span class="time mont bold">${sec}</span><span clas="unit">${sec_unit}</span>`;
      }
    },
  },
});
</script>

<style lang="sass" scoped>
.thumbnail_wrapper
  position: relative
  > .meta_wrappper
    position: absolute
    right: 0
    bottom: 0
    background-color: #fff
    padding: 0 7px 4px 0px
    border-radius: 2px 0 2px 0
    > .duration
      @include total_time
      color: $BLACK
      font-size: 14px
      &:before
        @include icon('time')
        width: 18px
        height: 18px
  > .thumbnail
    object-fit: cover
    border-radius: 4px
    &.small
      width: 166px
      max-width: 166px
      min-width: 166px
    &.list
      width: 176px
      max-width: 176px
      min-width: 176px
      height: 99px
      max-height: 99px
      min-height: 99px
@media screen and (min-width: 1800px)
  .thumbnail_wrapper
    > .thumbnail
      width: calc((100vw - #{$VIEW_PADDING} * 2 - 50px) / 6)
      height: calc((100vw - #{$VIEW_PADDING} * 2 - 50px) / 6 * 0.56)
      &.has_aside
        width: calc((100vw - #{$VIEW_PADDING} * 2 - 320px) / 5)
        height: calc((100vw - #{$VIEW_PADDING} * 2 - 320px) / 5 * 0.56)
@media screen and (min-width: 1500px) and (max-width: 1800px)
  .thumbnail_wrapper
    > .thumbnail
      width: calc((100vw - #{$VIEW_PADDING} * 2 - 40px) / 5)
      height: calc((100vw - #{$VIEW_PADDING} * 2 - 40px) / 5 * 0.56)
      &.has_aside
        width: calc((100vw - #{$VIEW_PADDING} * 2 - 310px) / 4)
        height: calc((100vw - #{$VIEW_PADDING} * 2 - 310px) / 4 * 0.56)
@media screen and (min-width: 1200px) and (max-width: 1500px)
  .thumbnail_wrapper
    > .thumbnail
      width: calc((100vw - #{$VIEW_PADDING} * 2 - 30px) / 4)
      height: calc((100vw - #{$VIEW_PADDING} * 2 - 30px) / 4 * 0.56)
      &.has_aside
        width: calc((100vw - #{$VIEW_PADDING} * 2 - 300px) / 3)
        height: calc((100vw - #{$VIEW_PADDING} * 2 - 300px) / 3 * 0.56)
@media screen and (min-width: 896px) and (max-width: 1200px)
  .thumbnail_wrapper
    > .thumbnail
      width: calc((100vw - #{$VIEW_PADDING} * 2 - 20px) / 3)
      height: calc((100vw - #{$VIEW_PADDING} * 2 - 20px) / 3 * 0.56)
      &.has_aside
        width: calc((100vw - #{$VIEW_PADDING} * 2 - 290px) / 2)
        height: calc((100vw - #{$VIEW_PADDING} * 2 - 290px) / 2 * 0.56)
@media screen and (max-width: 896px)
  .thumbnail_wrapper
    > .thumbnail
      width: calc((100vw - #{$VIEW_PADDING_SP} * 2 - 10px) / 2)
      height: calc((100vw - #{$VIEW_PADDING_SP} * 2 - 10px) / 2 * 0.56)
      &.has_aside
        width: calc((100vw - #{$VIEW_PADDING_SP} * 2 - 10px) / 2)
        height: calc((100vw - #{$VIEW_PADDING_SP} * 2 - 10px) / 2 * 0.56)
</style>
