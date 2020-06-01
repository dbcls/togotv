<template>
  <div class="staff_wrapper">
    <h2 class="page_title tsukushi bold">スタッフ</h2>
    <div class="main_members">
      <div class="single_role_wrapper">
        <h3 class="role tsukushi bold">創始者</h3>
        <div class="main_members_info multiple">
          <div class="main_member">
            <img src="~/assets/img/member/bono.png" class="main_member_photo" alt="">
            <a href="https://home.hiroshima-u.ac.jp/bonohu/" target="_blank" class="main_member_name">坊農 秀雄</a>
          </div>
          <div class="main_member">
            <img src="~/assets/img/member/kawano.png" class="main_member_photo" alt="">
            <p class="main_member_name">河野 信</p>
          </div>
        </div>
      </div>
      <div class="single_role_wrapper">
        <h3 class="role tsukushi bold">編集主幹</h3>
        <div class="main_members_info">
          <div class="main_member">
            <img src="~/assets/img/member/ono.png" class="main_member_photo" alt="">
            <p class="main_member_name">小野 浩雅</p>
          </div>
        </div>
      </div>
      <div class="single_role_wrapper">
        <h3 class="role tsukushi bold">編集</h3>
        <div class="main_members_info">
          <div class="main_member">
            <img src="~/assets/img/member/ikeda.png" class="main_member_photo" alt="">
            <p class="main_member_name">池田 秀也</p>
          </div>
        </div>
      </div>
    </div>
    <h3 class="tsukushi bold">コンテンツ制作(OB & OG含む)</h3>
    <p class="staff_name">坊農 秀雅、河野 信、小野 浩雅、五十嵐 惇、池田 秀也、伊藤 真和吏、大村 蓉子、大石 晶一朗、奥田 裕樹、小野 智央、小田 雄貴、糟谷 豪、久保 奈月、今 俊介、坂田 隼人、水津 珠世、高橋 弘樹、高橋 文緒、武田 英之、武本 瑞貴、多田 圭佑、乳井 昌道、千葉 温子、内藤 一洋、中島 一、西村 隆太郎、根来 哲也、橋本 拓也、畑中 恵茉、森川 諒介、山田 恭央、山口 瑤子、横山 貴央、若林 優太、小野 英理、比留川 治子、大田 達郎、熊谷 雄介、森田 一生、森田 純子、高山 悠、古屋 典子、渡来 直生、石川 昌和、川野 哲郎、萩原 純也、藤枝　香、恩田 美紀、山田 佐知子、永野 朗夫、渡瀬 絵美、坂本 真唯、篠崎 夏子、西子 まあや、永田 祥平、伊藤 光平、千葉 拓也、近藤 勇介、齋藤 元文、萩原 玲子、依田 真一、藤村 由希、佐々木 和香菜、比嘉 真鈴、渡邊 和代、井内 仁志、神谷 健、松崎 光孝、瀬川 和磨、鈴木 拓真、山本 楠、Su Yuting、那日蘇、山本 健太郎、山谷 恭</p>
    <h3 class="tsukushi bold">ウェブサイト構築</h3>
    <p class="staff_name">Dogrun 大石 直哉、PENQE 永野 朗夫、平原 麗夏</p>
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
  > h3
    font-size: 22px
    margin: 35px 0 8px
  > p
    margin: 0
    font-size: 14px
    line-height: 25px
</style>
