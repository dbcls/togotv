<template>
  <div class="workflow_wrapper">
    <h2 class="page_title tsukushi bold">難病を、名前から遺伝子と症例へ</h2>
    <p class="workflow_subtitle">日本の指定難病を起点に、原因遺伝子・表現型・関連遺伝子の候補へとたどる</p>

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
        "日本の難病は、指定難病や小児慢性特定疾病といった国の制度にもとづく名前で呼ばれます。一方、海外のデータベースでは、同じ病気が希少疾患や遺伝性疾患として別の名前・別の分類で登録されていて、国内の疾患名からそのまま海外の情報にたどり着くのは簡単ではありません。このワークフローでは、日本の難病を整理した NanbyoData を起点に、OMIM で原因遺伝子を確かめ、DECIPHER と PubCaseFinder で表現型（症状）の側から疾患を見直し、最後に TogoDX/Human で関連遺伝子の候補を広げます。",
      steps: [
        {
          no: 1,
          tool: "NanbyoData",
          action: "日本の難病を調べる",
          heading: "難病名から、その疾患に関する情報をまとめて調べる",
          story:
            "NanbyoData は、指定難病と小児慢性特定疾病の対象疾患を整理した難病語彙集 NANDO（Nanbyo Disease Ontology）をもとに、疾患ごとの関連情報をまとめて公開しているポータルサイトです。難病名や NANDO ID、別名で検索すると、診断基準などの公的な資料に加えて、疾患関連遺伝子（厚生労働省の公文書にもとづく国内基準と、OMIM・Orphanet などの国際リソース由来）、OMIM・Orphanet・MONDO などの海外データベースの ID、HPO で表された臨床的特徴、バリアントや文献まで、1つのページからたどれます。以降のステップは、ここで得た遺伝子や症状を手がかりに進めます。",
          videoTitle: "NanbyoDataをつかって、日本の希少難病疾患を検索する",
          url: "https://togotv.dbcls.jp/20251226.html",
          youtube: "vyd_qz-zfqA",
          duration: "10:23"
        },
        {
          no: 2,
          tool: "OMIM",
          action: "原因遺伝子を確かめる",
          heading: "その疾患の原因遺伝子とバリアントの報告を確かめる",
          story:
            "NanbyoData の概要ページには、対応する OMIM の ID へのリンクがあります。OMIM はヒトの遺伝性疾患と、その原因遺伝子・バリアントを網羅的にまとめたカタログで、遺伝形式や、どの遺伝子のどのような変異でどのような症状が出るのかといった報告を、文献とともに確認できます。国内の疾患名を海外の知識につなぐ最初のステップです。",
          videoTitle: "OMIMを使ってヒトの遺伝性疾患とそれに関連する遺伝子･バリアントを調べる",
          url: "https://togotv.dbcls.jp/20220627.html",
          youtube: "BpAUFhfFzh4",
          duration: "9:46"
        },
        {
          no: 3,
          tool: "DECIPHER",
          action: "表現型から見る",
          heading: "同じような表現型をもつ患者の、バリアントを見る",
          story:
            "同じ疾患と診断されても、患者さんごとに現れる症状は大きく異なります。DECIPHER は、表現型（症状）とゲノムのバリアントを結びつけた患者データを収載しているデータベースです。Phenotype browser では、登録された3万例以上の患者の表現型異常が HPO で整理されていて、表現型の分類から関連するバリアントを探せます。NanbyoData で確認した臨床的特徴（HPO）と見比べながら、遺伝子の側からではなく、症状の側から疾患を見直します。",
          videoTitle: "DECIPHER Phenotype browserを使って表現型以上の分類からバリアントを調べる",
          url: "https://togotv.dbcls.jp/20220719.html",
          youtube: "7aIHRdmhWb0",
          duration: "7:50"
        },
        {
          no: 4,
          tool: "PubCaseFinder（講演）",
          action: "症状から疾患を探す",
          heading: "症状の組み合わせから、候補となる疾患を探す",
          story:
            "希少疾患は1万近くあり、同じ疾患でも症状が患者さんごとに違うため、診断は簡単ではありません。PubCaseFinder は、入力した症状を HPO に対応づけ、各疾患の症状のセットとの類似度を計算して、候補となる疾患を順位づけして示すシステムです。HPO の階層構造を使い、症状どうしの近さも考慮してスコアをつけています。ここでは講演のうち、PubCaseFinder の仕組みと精度、国内での利用状況を紹介する部分を再生します。",
          videoTitle: "生命科学分野におけるオントロジーの活用事例: NANDO と PubCaseFinder @ データ解析講習会：AJACS「生命科学分野におけるナレッジグラフとオントロジーを知って・学んで・使う」",
          url: "https://togotv.dbcls.jp/20250802.html",
          youtube: "bZCZW2tVRn8",
          duration: "29:41",
          start: "21:20",
          end: "26:49"
        },
        {
          no: 5,
          tool: "TogoDX/Human",
          action: "関連遺伝子の候補を広げる",
          heading: "既知の原因遺伝子の特徴から、新たな候補遺伝子を探す",
          story:
            "原因遺伝子がすでに分かっている疾患でも、まだ見つかっていない関連遺伝子があるかもしれません。TogoDX/Human は、ヒトに関する国内外のデータベースから集めた情報を統合して探索できるウェブサービスです。希少疾患編では、鰓耳腎症候群を例に、既知の原因遺伝子群がもつ特徴（発現する組織や関連する疾患など）を条件として組み合わせ、ほかの関連遺伝子の候補を探す方法を紹介しています。",
          videoTitle: "TogoDX/Human v1.2を使ってヒトのデータベースを統合的に探索､俯瞰､抽出する (希少疾患編)",
          url: "https://togotv.dbcls.jp/20240802.html",
          youtube: "DFS-qx9oclw",
          duration: "8:40"
        }
      ],
      outro:
        "日本の難病を調べる → 原因遺伝子を確かめる → 表現型から見る → 症状から疾患を探す → 関連遺伝子の候補を広げる。国内の制度にもとづく疾患名と、海外のデータベースの疾患名や遺伝子・症状の情報は、NANDO や HPO といったオントロジーを介してつながっています。疾患名・遺伝子・症状のどこからでも行き来できるようになると、1つの難病について得られる情報の幅が大きく広がります。",
      extras: [
        {
          videoTitle: "TogoVarを使って疾患に関連したバリアントの集団における頻度を調べる（2026年版）",
          url: "https://togotv.dbcls.jp/20261008.html",
          duration: "9:16",
          note: "NanbyoData のバリアント情報の元になっている TogoVar で、疾患に関連したバリアントの日本人集団での頻度や臨床的意義を調べる。"
        },
        {
          videoTitle: "ClinVar を使って疾患に関連するバリアントを検索する",
          url: "https://togotv.dbcls.jp/20210405.html",
          duration: "9:21",
          note: "見つかったバリアントが、病原性ありとして報告されているかを確かめる。"
        },
        {
          videoTitle: "gnomAD v2.1.1 を使ってヒトバリアントの集団中のアレル頻度を調べる",
          url: "https://togotv.dbcls.jp/20210823.html",
          duration: "11:27",
          note: "世界の集団でのアレル頻度を調べ、まれなバリアントかどうかを判断する。"
        },
        {
          videoTitle: "DECIPHER Genome Viewerを使ってバリアント検索をする",
          url: "https://togotv.dbcls.jp/20220511.html",
          duration: "10:57",
          note: "コピー数の変化（CNV）などの構造バリアントを、ゲノム上の位置から調べたいときに。"
        },
        {
          videoTitle: "PubCaseFinder: CaseSharingの新機能「症例マッチング」の紹介",
          url: "https://togotv.dbcls.jp/20260826.html",
          duration: "1:08",
          note: "医師・研究者が症例を登録し、似た症例をもつ人どうしをつなぐ新機能のショート動画。"
        }
      ],
      lectures: [
        {
          title: "生命科学分野におけるオントロジーの活用事例: NANDO と PubCaseFinder @ AJACS「生命科学分野におけるナレッジグラフとオントロジーを知って・学んで・使う」",
          url: "https://togotv.dbcls.jp/20250802.html",
          thumbnail: "https://dbarchive.biosciencedbc.jp/data/togotv/movie/thumbnail/20250802_0.jpg",
          duration: "29:41",
          date: "2025-08-02"
        },
        {
          title: "疾患・表現型解析 (PubCaseFinder、HPO、NANDOなど) ＠ AJACSオンライン5",
          url: "https://togotv.dbcls.jp/20210205.html",
          thumbnail: "https://dbarchive.biosciencedbc.jp/data/togotv/movie/thumbnail/20210205_0.jpg",
          duration: "54:20",
          date: "2021-02-05"
        },
        {
          title: "表現型と遺伝子型のデータを共有および比較する @ AJACSオンライン9",
          url: "https://togotv.dbcls.jp/20220106.html",
          thumbnail: "https://dbarchive.biosciencedbc.jp/data/togotv/movie/thumbnail/20220106_0.jpg",
          duration: "59:25",
          date: "2022-01-06"
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
    const title = "難病を、名前から遺伝子と症例へ | 動画でワークフロー";
    const description =
      "NanbyoData・OMIM・DECIPHER・PubCaseFinder・TogoDX/Human をつなぎ、日本の指定難病を起点に原因遺伝子・表現型・関連遺伝子の候補へとたどるワークフローです。";
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
