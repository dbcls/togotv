<template>
  <div class="workflow_wrapper">
    <h2 class="page_title tsukushi bold">配列から系統樹を描く</h2>
    <p class="workflow_subtitle">似た配列を集めて、並べて、進化の道筋を復元する</p>

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
        "「この遺伝子は他の生物にもあるのか」「いつ枝分かれしたのか」——分子系統解析は、配列という文字列から進化の歴史を読み解く手法です。手順そのものは数十年変わっていません。相同な配列を集め、対応する位置を揃え、そこから系統樹を推定する。このワークフローは、その古典的で確実な流れを5本でたどります。使うツールは変わっても、この考え方は変わりません。",
      steps: [
        {
          no: 1,
          tool: "NCBI BLAST",
          action: "相同な配列を集める",
          heading: "出発点 ― 比較する相手を見つけてくる",
          story:
            "系統樹を描くには、まず比べる配列が要ります。手元の1本を出発点に、BLAST で配列類似性検索をかけ、他の生物がもつ相同な配列を集めます。ここで重要なのは集める範囲の判断です。近すぎる配列ばかりでは枝分かれが見えず、遠すぎる配列を混ぜるとアラインメントが破綻します。E値やカバー率を見ながら、扱える範囲に収めるのがコツです。",
          videoTitle: "NCBI BLASTを使って配列類似性検索をする",
          url: "https://togotv.dbcls.jp/20240626.html",
          youtube: "I8raMMAePK8",
          duration: "8:55"
        },
        {
          no: 2,
          tool: "Clustal Omega",
          action: "配列を揃える",
          heading: "同じ由来の位置どうしを、縦に並べる",
          story:
            "集めた配列は長さもバラバラです。マルチプルアラインメントは、進化的に対応する位置が縦に揃うように挿入・欠失を補って並べる作業で、系統解析の品質を決める最重要工程です。ここが崩れていると、その後どんな高度な手法を使っても正しい木にはなりません。Clustal Omega は多数の配列を扱える定番ツールです。",
          videoTitle: "Clustal Omega を使ってマルチプルアラインメントを行う",
          url: "https://togotv.dbcls.jp/20231226.html",
          youtube: "rxhRwAigpwY",
          duration: "11:27"
        },
        {
          no: 3,
          tool: "Jalview",
          action: "目で確かめて整える",
          heading: "自動の結果を、そのまま信じない",
          story:
            "アラインメントは自動で出ますが、そのまま使ってよいとは限りません。末端がガタついている、明らかに変な位置にギャップが入っている——こうした箇所は目で見れば分かります。Jalview はアラインメントを可視化・編集でき、そのまま簡易的な系統樹まで描けるツールです。まずここで木の概形を掴んでおくと、次の本格的な解析結果が妥当かどうかを判断できます。",
          videoTitle: "Jalviewを使って配列解析･系統樹解析をする",
          url: "https://togotv.dbcls.jp/20220520.html",
          youtube: "Ny8QlQ8tVMU",
          duration: "8:44"
        },
        {
          no: 4,
          tool: "MAFFT / RAxML / FigTree",
          action: "本格的に推定して描画する",
          heading: "アラインメントから、統計的に確からしい木へ",
          story:
            "発表や論文に使う系統樹なら、最尤法などの統計的な推定が必要です。MAFFT で精度の高いアラインメントを作り、RAxML で最尤系統樹を推定し、FigTree で整形して図にする。3つのツールを受け渡していく、古典的で王道の組み合わせです。ブートストラップ値を付けて枝の信頼度も示せます。",
          videoTitle: "MAFFT・RAxML・FigTreeを組み合わせて分子系統解析を行う",
          url: "https://togotv.dbcls.jp/20180403.html",
          youtube: "iPuMEpNXVVc",
          duration: "10:52",
          outdated: true
        },
        {
          no: 5,
          tool: "DoMosaics",
          action: "ドメイン構造と重ねて見る",
          heading: "最後に ― 木の枝と、タンパク質の中身を並べる",
          story:
            "系統樹だけでは「いつ分かれたか」しか分かりません。各配列がどんなドメイン構成をもつかを木と並べて表示すると、「この枝でドメインが1つ増えている」といった、機能の獲得・喪失の歴史が見えてきます。DoMosaics はドメイン構造と系統樹を組み合わせて可視化するツールで、進化の話を機能の話につなげる回です。",
          videoTitle: "DoMosaicsを使ってドメイン構造と系統樹を可視化する",
          url: "https://togotv.dbcls.jp/20210516.html",
          youtube: "5VCYcgJ7unI",
          duration: "9:50",
          outdated: true
        }
      ],
      outro:
        "集める → 並べる → 目で整える → 統計的に推定する → 機能と重ねる。分子系統解析の骨格はこの5段階です。とくにステップ2〜3のアラインメントに手間をかけるかどうかが、結果の質を大きく左右します。理論的な背景をきちんと学びたい方は、下の講習会シリーズへ進んでください。",
      extras: [
        {
          videoTitle: "MEGA X を用いた分子系統解析 @ 分子系統樹推定法:理論と応用 ワークショップ",
          url: "https://togotv.dbcls.jp/20191206.html",
          duration: "52:33",
          note: "GUI で一通りを完結させたい方へ。講習会形式でじっくり解説。"
        },
        {
          videoTitle: "分子系統学演習 - データセットの作成から仮説検定まで",
          url: "https://togotv.dbcls.jp/20191208.html",
          duration: "202:39",
          note: "3時間超の本格的な演習。仮説検定まで踏み込みたい方向け。"
        },
        {
          videoTitle: "PSI-BLASTを使って、タンパク質の遠い系統的関連性を発見する",
          url: "https://togotv.dbcls.jp/20170623.html",
          duration: "5:17",
          note: "ステップ1で遠縁の配列が拾えないときに。構造で探す道もあります。"
        }
      ],
      lectures: [
        {
          title: "系統樹と進化学 @ 第5回木村資生記念進化学セミナー",
          url: "https://togotv.dbcls.jp/20250206.html",
          thumbnail: "https://dbarchive.biosciencedbc.jp/data/togotv/movie/thumbnail/20250206_0.jpg",
          duration: "35:08",
          date: "2025-02-06"
        },
        {
          title: "研究がつなぐ未来 バイオインフォマティクスの役割 @ 「分子系統樹をつくろう」特別授業",
          url: "https://togotv.dbcls.jp/20231117.html",
          thumbnail: "https://dbarchive.biosciencedbc.jp/data/togotv/movie/thumbnail/20231117_0.jpg",
          duration: "37:48",
          date: "2023-11-17"
        },
        {
          title: "進化ゲノム学と系統推定 @ 分子系統樹推定法:理論と応用 ワークショップ",
          url: "https://togotv.dbcls.jp/20191205.html",
          thumbnail: "https://dbarchive.biosciencedbc.jp/data/togotv/movie/thumbnail/20191205_0.jpg",
          duration: "82:52",
          date: "2019-12-05"
        }
      ]
    };
  },
  head() {
    const title = "配列から系統樹を描く | 動画でワークフロー";
    const description =
      "NCBI BLAST・Clustal Omega・Jalview・MAFFT/RAxML/FigTree・DoMosaics をつなぎ、相同配列の収集から系統樹の推定・描画までをたどる分子系統解析のワークフローです。";
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
