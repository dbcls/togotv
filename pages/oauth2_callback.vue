<template>
  <div class="loading_wrapper">
    <div class="loader">Loading...</div>
  </div>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  async middleware(ctx) {
    if (ctx.$auth.loggedIn) {
      await ctx.$router.push("/mypage.html");
    }
  },
});
</script>

<style lang="sass" scoped>
.loading_wrapper
  width: 100%
  height: 200px
  display: flex
  align-items: center
  justify-content: center
  .loader
    @include loader
</style>
