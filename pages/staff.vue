<template>
  <div class="staff_wrapper">
    <h2 class="page_title tsukushi bold">{{ $t('スタッフ') }}</h2>
    <div class="main_members">
      <div class="single_role_wrapper">
        <h3 class="role tsukushi bold">{{ $t('founder') }}</h3>
        <div class="main_members_info multiple">
          <div class="main_member">
            <img src="~/assets/img/member/bono.png" class="main_member_photo" alt="">
            <a href="https://home.hiroshima-u.ac.jp/bonohu/" target="_blank" class="main_member_name">{{ $t('bono') }}</a>
          </div>
          <div class="main_member">
            <img src="~/assets/img/member/kawano.png" class="main_member_photo" alt="">
            <p class="main_member_name">{{ $t('kono') }}</p>
          </div>
        </div>
      </div>
      <div class="single_role_wrapper">
        <h3 class="role tsukushi bold">{{ $t('main_editor') }}</h3>
        <div class="main_members_info">
          <div class="main_member">
            <img src="~/assets/img/member/ono.png" class="main_member_photo" alt="">
            <p class="main_member_name">{{ $t('ono') }}</p>
          </div>
        </div>
      </div>
      <div class="single_role_wrapper">
        <h3 class="role tsukushi bold">{{ $t('editor') }}</h3>
        <div class="main_members_info">
          <div class="main_member">
            <img src="~/assets/img/member/ikeda.png" class="main_member_photo" alt="">
            <p class="main_member_name">{{ $t('ikeda') }}</p>
          </div>
        </div>
      </div>
    </div>
    <h3 class="tsukushi bold">{{ $t('contents_creator') }}</h3>
    <p class="staff_name">{{ $t('staff_member_list') }}</p>
    <h3 class="tsukushi bold">{{ $t('develop_site') }}</h3>
    <p class="staff_name">{{ $t('develop_site_member_list') }}</p>
    <div class="recruit_wrapper">
      <h3 class="tsukushi bold" v-html="$t('recruit_title')"></h3>
      <p>作業内容は相談の上、決定します。内容に応じて謝金をお支払いします。<br>RA採用 (柏勤務) のほか、遠隔地の場合は在宅作業による外部発注方式も対応可能です。<br>納期は自由に設定できます。DB・ウェブツールについて詳しくなくても、勉強しながらでOK。「本業優先」がポリシーです。<br>動画・静止画の作成が未経験の方でもサポートします。作業用PCも貸与可能です。<br>動画制作の実際は、<nuxt-link :to="localePath({name: 'video', query: {id: '4G4xM9A7pOA'}})" >「画面録画/編集ソフトウェア Camtasia 2019 を使って統合TVの動画を作成する」</nuxt-link>をご覧ください。<br>静止画制作の実際は、<nuxt-link :to="localePath({name: 'video', query: {id: 'yDN-rEB5VEo'}})" >「ライフサイエンス分野のイラスト集を作る仕事@AJACS本郷8」</nuxt-link>をご覧ください。<br>詳細についてご興味ある方は、<a href="https://dbcls.rois.ac.jp/contact" target="_blank">DBCLSのお問い合わせフォーム</a> からご連絡いただくか、担当 小野 hono@dbcls.rois.ac.jp まで ご連絡ください。</p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  head() {
    return {
      title: 'スタッフ'
    }
  },
  data () {
    return {

    }
  },
  methods: {

  }
})
</script>

<style lang="sass" scoped>
.staff_wrapper
  padding: 0 $VIEW_PADDING
  > .page_title
    @include page_title('people')
    margin-bottom: 21px
  > .main_members
    display: flex
    margin-top: -6px
    > .single_role_wrapper
      text-align: center
      margin-left: 52px
      &:first-of-type
        margin-left: 0
      > h3.role
        font-size: 22px
        margin-bottom: 18px
        @include blue_underline
        background-position: 10px 26px
      > .main_members_info
        &.multiple
          display: flex
          justify-content: center
        > .main_member
          text-align: center
          margin-left: 20px
          margin-top: 14px
          &:first-of-type
            margin-left: 0px
          > img.main_member_photo
            width: 100px
            height: 100px
            border-radius: 100px
          > .main_member_name
            font-size: 14px
            display: block
            margin-top: 10px
  > .recruit_wrapper
    background-color: #FFF8E3
    border-radius: 20px
    padding: 41px 54px
    margin-top: 44px
    > h3
      color: $MAIN_COLOR
      font-size: 28px
      margin: 0
    > p
      font-size: 14px
      line-height: 25px
      margin: 14px 0 0 0
  > h3
    font-size: 22px
    margin: 35px 0 8px
  > p
    margin: 0
    font-size: 14px
    line-height: 25px

@media screen and (max-width: 480px)
  .staff_wrapper
    padding: 0 $VIEW_PADDING_SP
    > .main_members
      flex-wrap: wrap
      > .single_role_wrapper
        margin: 0
        width: 50%
        &:first-of-type
          width: 100%
          margin-bottom: 18px
    > .recruit_wrapper
      padding: 30px 40px
      > h3
        font-size: 24px
</style>
