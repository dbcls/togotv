<template>
  <div class="workflow_wrapper">
    <h2 class="page_title tsukushi bold">その変異は、がんの変異か、日本人の多型か</h2>
    <p class="workflow_subtitle">TogoVar で生まれつきのバリアントとしての頻度を確かめ、COSMIC と TCGA でがんの体細胞変異を調べる</p>

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
        "がんの研究では、同じ遺伝子に見つかった変異でも、生まれつき持っているバリアント（生殖細胞系列のバリアント）なのか、がん細胞になってから生じた変異（体細胞変異）なのかで、意味がまったく異なります。日本人集団でありふれたバリアントを、がんの原因の変異と取り違えてしまうこともあります。このワークフローでは、肺がんとの関連で知られる EGFR 遺伝子を例に、まず TogoVar で日本人集団での頻度と臨床的意義を確かめ、次に COSMIC でがんで報告されている体細胞変異を調べ、最後に TCGA の公開データを検索・解析するところまでをつなぎます。",
      steps: [
        {
          no: 1,
          tool: "TogoVar",
          action: "日本人での頻度と臨床的意義を確かめる",
          heading: "そのバリアントは、日本人集団でありふれた多型ではないか",
          story: "最初に、そのバリアントが生まれつきのバリアントとして、日本人集団でどのくらい見られるかを確かめます。TogoVar は、複数の国内研究プロジェクトから得られた日本人集団のバリアント頻度と、関連する疾患情報をまとめたデータベースです。ここでは動画のうち、EGFR 遺伝子のミスセンスバリアント（rs2227983、p.Arg521Lys）を例に、日本人集団での頻度、SIFT・PolyPhen-2 による機能予測、ClinVar・MGeND の臨床的意義を総合的に確認する部分を再生します。日本人で高い頻度で見られ、予測でも影響が小さいとされるバリアントは、がんの原因となる変異とは考えにくいことが分かります。",
          videoTitle: "TogoVarを使って疾患に関連したバリアントの集団における頻度を調べる（2026年版）",
          url: "https://togotv.dbcls.jp/20261008.html",
          youtube: "ajErvF53Pq4",
          duration: "9:16",
          start: "6:45"
        },
        {
          no: 2,
          tool: "COSMIC",
          action: "がんの体細胞変異を調べる",
          heading: "その遺伝子では、がんでどのような体細胞変異が報告されているか",
          story: "次に、がん細胞で生じた体細胞変異の側から見ます。COSMIC は、ヒトのがんで報告された体細胞変異を体系的に集約した世界最大級のデータベースです。変異が報告されているかどうかだけでなく、どのがん種に多いか、変異の種類、ゲノム上の位置といった観点から、がんに関連する分子を俯瞰できます。ステップ1で見た日本人の多型と、がんで繰り返し見つかる体細胞変異とを見比べると、両者の違いがはっきりします。",
          videoTitle: "COSMICでがん遺伝子の体細胞変異について調べる（2026年版）",
          url: "https://togotv.dbcls.jp/20261005.html",
          youtube: "zUCtWioTMzE",
          duration: "12:21"
        },
        {
          no: 3,
          tool: "TCGA",
          action: "がんの公開データを探す",
          heading: "がん種ごとの公開データを検索して、手元に取得する",
          story: "COSMIC が文献などから変異を集めたデータベースであるのに対し、TCGA（The Cancer Genome Atlas）は、さまざまな組織のがんについてゲノム・エピゲノム・トランスクリプトーム・バリアントなどの測定データそのものを公開しているプロジェクトです。この動画では、GDC（Genomic Data Commons）Data Portal を使って、収載データを検索する方法、データレコードの見方、公開データのダウンロード方法を紹介しています。",
          videoTitle: "The Cancer Genome Atlas (TCGA) を使って各癌種の公開データを検索・ダウンロードする",
          url: "https://togotv.dbcls.jp/20231227.html",
          youtube: "0WfGzlVTzWs",
          duration: "7:32"
        },
        {
          no: 4,
          tool: "TCGA",
          action: "がんの公開データを解析する",
          heading: "自分で対象集団を作り、ブラウザ上で解析する",
          story: "最後は、データを取得するだけでなく、その場で解析します。2024年に大きく更新された GDC Data Portal では、「コホート（対象集団）中心」のワークフローが採用され、がん種や変異の有無などの条件で自分のケースセットを作り、用意された解析ツールで比較できます。たとえば、ある遺伝子に体細胞変異をもつ患者群ともたない患者群を比べるといった解析を、プログラミングなしで試せます。",
          videoTitle: "The Cancer Genome Atlas (TCGA) を使って各癌種の公開データを解析する",
          url: "https://togotv.dbcls.jp/20240329.html",
          youtube: "v2rYzZUX2oY",
          duration: "6:43"
        }
      ],
      outro:
        "日本人での頻度と臨床的意義を確かめる → がんの体細胞変異を調べる → がんの公開データを探す → 解析する。TogoVar が示すのは「生まれつきのバリアントが集団でどのくらい見られるか」、COSMIC と TCGA が示すのは「がん細胞でどのような変異が生じているか」です。この2つを区別して調べることで、見つかった変異が単なる個人差なのか、がんに関わる変異なのかを見誤らずに済みます。",
      extras: [
        {
          videoTitle: "TogoVarを使って、日本人に特徴的な遺伝性疾患のバリアントの頻度と病原性を調べる（2026年版）",
          url: "https://togotv.dbcls.jp/20261007.html",
          duration: "5:59",
          note: "TogoVar の基本的な使い方（頻度と病原性の調べ方）から確認したいときに。"
        },
        {
          videoTitle: "ClinVar を使って疾患に関連するバリアントを検索する",
          url: "https://togotv.dbcls.jp/20210405.html",
          duration: "9:21",
          note: "生まれつきのバリアントの臨床的意義を、ClinVar の登録内容から詳しく確かめる。"
        },
        {
          videoTitle: "UCSC Xenaを使って公開がんゲノムデータを解析する",
          url: "https://togotv.dbcls.jp/20200313.html",
          duration: "9:52",
          note: "TCGA などのがんゲノムデータを、発現・変異・生存期間などを組み合わせて可視化する（少し古い版の解説です）。"
        },
        {
          videoTitle: "Open Targets を使って疾患に関連する潜在的な創薬ターゲットを可視化し検索する",
          url: "https://togotv.dbcls.jp/20220225.html",
          duration: "9:33",
          note: "がんで変異が見つかった遺伝子が、創薬の標的として検討されているかを調べる。"
        }
      ],
      lectures: [
        {
          title: "TogoVar の活用事例で学ぶバリアントデータベースの使い方 @ データ解析講習会：AJACS「日本人ゲノムバリアント解析ツールを知って・学んで・使う」",
          url: "https://togotv.dbcls.jp/20260209.html",
          thumbnail: "https://dbarchive.biosciencedbc.jp/data/togotv/movie/thumbnail/20260209_0.jpg",
          duration: "51:40",
          date: "2026-02-09"
        },
        {
          title: "TogoVarを使ってヒトゲノムに存在するバリアントに関連する情報を調べる @ AJACSオンライン9",
          url: "https://togotv.dbcls.jp/20220105.html",
          thumbnail: "https://dbarchive.biosciencedbc.jp/data/togotv/movie/thumbnail/20220105_0.jpg",
          duration: "61:43",
          date: "2022-01-05"
        },
        {
          title: "NBDCヒトデータベースのこれまでの10年、これからの10年 @ トーゴーの日シンポジウム2023",
          url: "https://togotv.dbcls.jp/20231026.html",
          thumbnail: "https://dbarchive.biosciencedbc.jp/data/togotv/movie/thumbnail/20231026_0.jpg",
          duration: "17:57",
          date: "2023-10-26"
        }
      ]
    };
  },
  head() {
    const title = "その変異は、がんの変異か、日本人の多型か | 動画でワークフロー";
    const description =
      "TogoVar・COSMIC・TCGA をつなぎ、見つかった変異が日本人集団の多型なのか、がんの体細胞変異なのかを見分けて、がんの公開データの解析まで進むワークフローです。";
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
