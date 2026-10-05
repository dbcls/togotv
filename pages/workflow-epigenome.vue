<template>
  <div class="workflow_wrapper">
    <h2 class="page_title tsukushi bold">転写因子の結合とゲノムの立体構造</h2>
    <p class="workflow_subtitle">転写因子の結合や、ゲノムの立体構造の解析を学び、興味のある転写制御の様子をゲノムブラウザーで可視化する</p>

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
        "遺伝子の発現制御を調べるにはどうするか。転写因子をはじめとする ChIP-seq 情報の網羅的なデータベースであるChIP-Atlasを利用して、興味のある転写因子の標的を探し、さらにはその転写因子がゲノム上のどこに結合しているかを確かめます。結合部位が遺伝子から離れている場合、その結合部位と遺伝子は、核の中でゲノムが折りたたまれることで近づいている可能性があります。そこで、ゲノムの立体構造を調べる Hi-C 解析について、講演動画から原理と公共データの使い方を学びます。最後に、集めたデータをIGV ゲノムブラウザーに読み込み、興味のある領域の転写制御の様子を可視化します。",
      steps: [
        {
          no: 1,
          tool: "ChIP-Atlas",
          action: "転写因子の標的を探す",
          heading: "興味のある転写因子が、どの遺伝子を制御しているかを調べる",
          story:
            "ChIP-Atlas は、公共リポジトリ（NCBI、EMBL-EBI、DDBJ）に登録されたほぼすべての ChIP-seq データを一様に処理し、閲覧・解析できるようにしたデータベースです。Target Genes 機能では、転写因子を選び、転写開始点（TSS）からの距離を指定すると、その転写因子が結合している遺伝子、つまり標的遺伝子の候補を一覧できます。自分で ChIP-seq 実験をしなくても、既報のデータから制御関係の手がかりが得られます。",
          videoTitle: "ChIP-Atlasを使って興味のある転写因子を選択しその標的遺伝子候補を検索する 〜Target Genesの使い方〜",
          url: "https://togotv.dbcls.jp/20180124.html",
          youtube: "jceRQyVe88Y",
          duration: "7:21",
          outdated: true
        },
        {
          no: 2,
          tool: "ChIP-Atlas",
          action: "結合の様子を見る",
          heading: "標的遺伝子の周辺で、どこに結合しているかを確かめる",
          story:
            "標的遺伝子の候補が見つかったら、実際の結合の様子をゲノム上で確かめます。Peak Browser 機能を使うと、転写因子や細胞の種類を指定して、ChIP-seq のピークを IGV 上にまとめて表示できます。プロモーターの近くに結合しているのか、遺伝子から離れた領域（エンハンサーの候補）に結合しているのかを見比べてみましょう。離れた位置の結合部位がどの遺伝子に働きかけているのかは、ChIP-seq だけでは分かりません。そこで次のステップでゲノムの立体構造に目を向けます。",
          videoTitle: "ChIP-Atlasを使って既報のChIP-seqデータをまとめて閲覧する 〜Peak Browserの使い方〜",
          url: "https://togotv.dbcls.jp/20180123.html",
          youtube: "nD5ayKUi-4s",
          duration: "9:40",
          outdated: true
        },
        {
          no: 3,
          tool: "Hi-C 解析（講演）",
          action: "原理と立体構造を学ぶ",
          heading: "離れた結合部位と遺伝子は、立体構造で近づいている",
          story:
            "ゲノム DNA は核の中で折りたたまれていて、配列上は遠く離れた領域どうしが空間的に接していることがあります。Hi-C は、この接触をゲノム全体で網羅的に調べる手法です。ここでは講演のうち、3C から Hi-C に至る実験の原理、解析結果であるコンタクトマップの読み方、ループ・TAD・コンパートメントといった立体構造、TAD の境界が壊れると遺伝子の制御が変わって疾患につながる例までを再生します。",
          videoTitle: "Hi-C解析を知る @ データ解析講習会：AJACS「Hi-C解析を知って・学んで・使う」",
          url: "https://togotv.dbcls.jp/20250208.html",
          youtube: "s_7qB6-1ZbU",
          duration: "58:33",
          start: "5:53",
          end: "41:40"
        },
        {
          no: 4,
          tool: "Hi-C 解析（講演）",
          action: "公共データを使う",
          heading: "公開されている Hi-C データを入手して、表示する",
          story:
            "Hi-C も ChIP-seq と同じく、論文で公開されたデータを使えます。ここでは講演のうち、ENCODE などの公共データの入手先、.hic と .cool という2つのデータ形式、HiGlass や Juicebox を使った表示、pyGenomeTracks でほかのデータと並べて図にする方法までを再生します。生データからの処理（マッピング、正規化、TAD・ループの検出）まで知りたい場合は、全編をご覧ください。",
          videoTitle: "Hi-Cデータを使う @ データ解析講習会：AJACS「Hi-C解析を知って・学んで・使う」",
          url: "https://togotv.dbcls.jp/20250209.html",
          youtube: "eJuzrCEXDVg",
          duration: "43:58",
          end: "11:49"
        },
        {
          no: 5,
          tool: "IGV",
          action: "転写制御の様子を可視化する",
          heading: "ChIP-seq と Hi-C のデータを、IGV で重ねて表示する",
          story:
            "最後に、ここまでのデータを IGV（Integrative Genomics Viewer）で可視化します。IGV は自分の PC 上でもブラウザ上でも動くゲノムブラウザーで、ChIP-Atlas からダウンロードしたピーク（BED 形式）やシグナル（bigWig 形式）、Hi-C から得られるループなどの相互作用データを、トラックとして同じ座標の上に並べられます。この動画では、インストールからデータの読み込み、表示の切り替えまでの基本操作を紹介しています。転写因子の結合部位と、それが接触している遺伝子を1つの画面で確認してみましょう。",
          videoTitle: "Integrative Genomics Viewer (IGV) を使ってゲノムデータを可視化する",
          url: "https://togotv.dbcls.jp/20240704.html",
          youtube: "fdrrq6j9Y1w",
          duration: "11:09"
        }
      ],
      outro:
        "標的を探す → 結合の様子を見る → 立体構造を学ぶ → 公共データを使う → IGV で可視化する。ChIP-seq からは「転写因子がどこに結合しているか」が、Hi-C からは「その領域がどこと接しているか」が分かります。遺伝子から離れた結合部位がどの遺伝子を制御しているのかは、どちらか一方のデータだけでは決められません。両方を同じゲノム座標の上に重ねることで、興味のある遺伝子の転写制御の様子が見えてきます。",
      extras: [
        {
          videoTitle: "WashU Epigenome Browser でゲノムとエピゲノムを可視化する",
          url: "https://togotv.dbcls.jp/20250416.html",
          duration: "7:48",
          note: "DNA メチル化などのエピゲノムの状態もあわせて見たいときに。"
        },
        {
          videoTitle: "ChIP-Atlasを使って興味ある遺伝子リストを制御する可能性の高い転写因子を調べる 〜Enrichment Analysisの使い方〜",
          url: "https://togotv.dbcls.jp/20190105.html",
          duration: "8:21",
          note: "ステップ1とは逆に、手元の遺伝子リストから、それらを制御する転写因子の候補を探したいときに。"
        },
        {
          videoTitle: "ChIP-Atlasを使って共局在タンパク質を探す 〜Colocalizationの使い方〜",
          url: "https://togotv.dbcls.jp/20180128.html",
          duration: "6:11",
          note: "興味のある転写因子と、ゲノム上の同じ場所に結合している転写因子を探す。"
        },
        {
          videoTitle: "TEENAを使ってChIP-seqデータからトランスポゾンのエンリッチメント解析を行う",
          url: "https://togotv.dbcls.jp/20240909.html",
          duration: "7:35",
          note: "ピークがトランスポゾン由来の配列に偏っていないかを確かめる。"
        },
        {
          videoTitle: "Integrative Genomics Viewer IGVを使い倒す 〜マッピングデータを可視化する〜",
          url: "https://togotv.dbcls.jp/20140716.html",
          duration: "9:02",
          note: "自分でマッピングした BAM ファイルを IGV に読み込みたいときに（少し古い版の解説です）。"
        }
      ],
      lectures: [
        {
          title: "HiC1Dmetricsを用いたゲノム立体構造解析 @ Bio”Pack”athon2024#10",
          url: "https://togotv.dbcls.jp/20241016.html",
          thumbnail: "https://dbarchive.biosciencedbc.jp/data/togotv/movie/thumbnail/20241016_0.jpg",
          duration: "57:57",
          date: "2024-10-16"
        },
        {
          title: "4Dゲノム状態の理解と可視化を支援するデータベースの構築 @ トーゴーの日シンポジウム2025",
          url: "https://togotv.dbcls.jp/20251208.html",
          thumbnail: "https://dbarchive.biosciencedbc.jp/data/togotv/movie/thumbnail/20251208_0.jpg",
          duration: "10:17",
          date: "2025-12-08"
        },
        {
          title: "統合的な転写制御データ基盤の構築 ～ChIP-Atlas update: Bisulfite-seq と ATAC-seq データを統合しエピゲノム制御の全貌に迫る～ @ MBSJ2022",
          url: "https://togotv.dbcls.jp/20221218.html",
          thumbnail: "https://dbarchive.biosciencedbc.jp/data/togotv/movie/thumbnail/20221218_0.jpg",
          duration: "11:38",
          date: "2022-12-18"
        },
        {
          title: "ChIP-Atlas: 既報のChIP-seqデータをフル活用できる ＠ AJACS町田",
          url: "https://togotv.dbcls.jp/20190113.html",
          thumbnail: "https://dbarchive.biosciencedbc.jp/data/togotv/movie/thumbnail/20190113_0.jpg",
          duration: "78:41",
          date: "2019-01-13"
        }
      ]
    };
  },
  head() {
    const title = "転写因子の結合とゲノムの立体構造 | 動画でワークフロー";
    const description =
      "ChIP-Atlas で転写因子の標的と結合部位を調べ、Hi-C 解析の講演でゲノムの立体構造を学び、IGV ゲノムブラウザーで転写制御の様子を可視化するワークフローです。";
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
