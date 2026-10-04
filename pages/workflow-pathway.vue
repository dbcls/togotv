<template>
  <div class="workflow_wrapper">
    <h2 class="page_title tsukushi bold">パスウェイ図を読む・描く・公開する</h2>
    <p class="workflow_subtitle">読む側から、描いて共有する側へ</p>

    <nuxt-link class="back_link" :to="localePath('/workflows.html')">← 動画でワークフロー 一覧へ</nuxt-link>

    <VideoWorkflow :lead="lead" :steps="steps" :outro="outro" :extras="extras" :lectures="lectures" />
  </div>
</template>

<script>
import Vue from "vue";
import VideoWorkflow from "~/components/VideoWorkflow.vue";

export default Vue.extend({
  components: { VideoWorkflow },
  data() {
    return {
      lead:
        "パスウェイ図は、論文で眺めるだけのものだと思われがちです。しかし公開データベースの図は検索でき、自分の解析結果を重ねることができ、さらに自分で描いて世界に公開することもできます。このワークフローは、既存の図を調べるところから始めて、解析データを載せ、最終的に自分で描いて公開するまで、パスウェイ図との付き合い方を段階的に引き上げていきます。",
      steps: [
        {
          no: 1,
          tool: "WikiPathways",
          action: "既存の図を調べる",
          heading: "出発点 ― 誰でも使えるパスウェイ図を手に入れる",
          story:
            "まず、すでにあるものを探します。WikiPathways はコミュニティが作成・維持している生物学的パスウェイ図のデータベースで、ライセンス的にも自由に使えるのが大きな利点です。論文中の図をそのまま流用するのは権利上の問題がありますが、ここの図なら発表資料にも安心して使えます。自分の興味ある経路がすでに描かれていないか、まずは確認しましょう。",
          videoTitle: "WikiPathways を使って誰でも自由に使える生物学的パスウェイ図を調べる",
          url: "https://togotv.dbcls.jp/20230921.html",
          youtube: "oSyoDU2r4Q0",
          duration: "10:11"
        },
        {
          no: 2,
          tool: "Reactome",
          action: "精緻な経路データを引く",
          heading: "キュレーションされた経路を、構造として読む",
          story:
            "WikiPathways がコミュニティ主導なのに対し、Reactome は専門家が文献に基づいて精緻にキュレーションした経路データベースです。反応の階層構造をたどりながら、どの分子がどの反応に関与しているかを厳密に追えます。まずは基本操作編で、経路の探し方と図の読み方を身につけます。次のステップの土台になります。",
          videoTitle: "Reactome を使ってパスウェイ情報を検索する〜基本操作編〜",
          url: "https://togotv.dbcls.jp/20230625.html",
          youtube: "fOGuipHjcb0",
          duration: "7:47"
        },
        {
          no: 3,
          tool: "Reactome",
          action: "自分のデータを載せる",
          heading: "図が「自分の実験の話」になる瞬間",
          story:
            "ここが転換点です。Reactome には自分の解析結果、たとえば発現変動遺伝子のリストを経路図の上にマッピングする機能があります。一般的な経路図が、自分のデータで色づけされた図に変わります。「経路のどこが動いていて、どこが静かなのか」が視覚的に分かるので、結果の解釈が一気に進みます。RNA-seq のワークフローとつながる部分でもあります。",
          videoTitle: "Reactome を使ってパスウェイ情報を検索する〜解析データのマッピング〜",
          url: "https://togotv.dbcls.jp/20231110.html",
          youtube: "z_pwUeZeIdE",
          duration: "6:53"
        },
        {
          no: 4,
          tool: "PathVisio",
          action: "自分で描く",
          heading: "既存の図で足りないなら、描いてしまう",
          story:
            "既存の経路図に、自分が見つけた分子が載っていない。よくあることです。PathVisio はパスウェイ図を自分で描画・編集できるツールで、既存の図を下敷きにした改変もできます。しかも描いた図は WikiPathways へ公開して、他の研究者に使ってもらうこともできます。読む側から描く側へ回る、このワークフローの中心となる回です。",
          videoTitle: "PathVisio を使って生物学的パスウェイ図を描画・編集・公開する （2025年度版）",
          url: "https://togotv.dbcls.jp/20260121.html",
          youtube: "YHjiQ2jwLj4",
          duration: "13:55"
        },
        {
          no: 5,
          tool: "Pathway Figure OCR",
          action: "論文中の図を探す",
          heading: "最後に ― 論文の図そのものを検索対象にする",
          story:
            "締めくくりは、少し変わった道具です。膨大な論文に載っているパスウェイ図は、これまで検索できない情報でした。Pathway Figure OCR は論文中の図を画像解析して分子名を抽出し、検索可能にする試みです。「この遺伝子が描かれている図を含む論文」を直接探せます。データベース化されていない知識にアクセスする、新しい入口です。",
          videoTitle: "Pathway Figure OCR を使って論文中の生物学的パスウェイ図を検索する",
          url: "https://togotv.dbcls.jp/20240214.html",
          youtube: "8XRS_dTX-eM",
          duration: "6:28"
        }
      ],
      outro:
        "調べる → 精緻に読む → 自分のデータを載せる → 自分で描く → 論文の図まで探す。パスウェイ図との距離が、順に縮まっていく構成になっています。とくにステップ4まで進むと、「この経路の図がないから作った」と言えるようになり、それ自体が研究コミュニティへの貢献になります。解析結果を載せたい方は、先に「公共RNA-seqデータを再解析する」を通ってくると噛み合いがよくなります。",
      extras: [],
      lectures: [
        {
          title: "パスウェイデータベースを使ってゲノムを理解する @ AJACSオンライン12",
          url: "https://togotv.dbcls.jp/20220830.html",
          thumbnail: "https://dbarchive.biosciencedbc.jp/data/togotv/movie/thumbnail/20220830_0.jpg",
          duration: "57:11",
          date: "2022-08-30"
        },
        {
          title: "パスウェイデータベース @ AJACSオンライン3",
          url: "https://togotv.dbcls.jp/20201213.html",
          thumbnail: "https://dbarchive.biosciencedbc.jp/data/togotv/movie/thumbnail/20201213_0.jpg",
          duration: "57:47",
          date: "2020-12-13"
        },
        {
          title: "トランスオミクス解析のための多階層パスウェイ可視化の自動化 @ 第6回質量分析インフォマティクス研究会ワークショップ",
          url: "https://togotv.dbcls.jp/20210806.html",
          thumbnail: "https://dbarchive.biosciencedbc.jp/data/togotv/movie/thumbnail/20210806_0.jpg",
          duration: "14:27",
          date: "2021-08-06"
        }
      ]
    };
  },
  head() {
    const title = "パスウェイ図を読む・描く・公開する | 動画でワークフロー";
    const description =
      "WikiPathways・Reactome・PathVisio・Pathway Figure OCR をつなぎ、パスウェイ図を調べる段階から自分で描いて公開する段階まで進むワークフローです。";
    return {
      title: title,
      meta: [
        { hid: "description", name: "description", content: description },
        { hid: "og:title", property: "og:title", content: title },
        { hid: "og:description", property: "og:description", content: description }
      ]
    };
  }
});
</script>

<style lang="sass" scoped>
.workflow_wrapper
  // 中央寄せ。max-width + margin auto は幅の基準が1か所に決まるので崩れにくい
  max-width: 860px
  margin: 0 auto
  padding: 0 $VIEW_PADDING 80px
  box-sizing: border-box

  > .page_title
    @include page_title('relation')
    margin-left: -10px

.workflow_subtitle
  font-size: 15px
  color: #666666
  line-height: 1.7
  margin: 0 0 16px

.back_link
  display: inline-block
  font-size: 13px
  color: $MAIN_COLOR
  text-decoration: none
  margin-bottom: 28px
  &:hover
    text-decoration: underline

@media screen and (max-width: 896px)
  .workflow_wrapper
    padding: 0 $VIEW_PADDING_SP 60px

  .workflow_subtitle
    font-size: 14px
</style>
