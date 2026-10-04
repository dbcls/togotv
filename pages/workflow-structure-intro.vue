<template>
  <div class="workflow_wrapper">
    <h2 class="page_title tsukushi bold">配列から構造へ</h2>
    <p class="workflow_subtitle">はじめてのタンパク質構造比較 ― 5本の動画でたどる入門コース</p>

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
        "アミノ酸配列を調べるところまではできる。でも「構造で調べる」って、どこから手をつければいいのだろう——。このコースは、そんな方のための入門コースです。UniProt で配列と機能情報を調べるところから出発して、構造検索・構造比較・モチーフ検索まで、5本の動画を順番に体験していきます。立体構造解析の専門知識は前提としていません。1本ずつ進めば、最後には「構造で探す」という発想が自分の道具になっているはずです。",
      steps: [
        {
          no: 1,
          tool: "UniProt",
          action: "配列と機能を調べる",
          heading: "すべての出発点 ― まず、そのタンパク質が何者かを知る",
          story:
            "UniProt はタンパク質のアミノ酸配列と機能情報を集めた基本のデータベースで、この先のどのツールを使うときも「入口」になります。アクセッション番号の読み方、配列の取得、機能アノテーションの見方をここで押さえておくと、次のステップ以降がぐっと分かりやすくなります。まずはここから。",
          videoTitle: "UniProtを使って、タンパク質のアミノ酸配列とその機能情報を横断的・網羅的に調べる",
          url: "https://togotv.dbcls.jp/20170912.html",
          youtube: "VqGtn2cDBOk",
          duration: "8:03",
          outdated: true
        },
        {
          no: 2,
          tool: "Foldseek",
          action: "はじめての構造検索",
          heading: "配列が似ていなくても、構造なら見つかる ― を体験する",
          story:
            "構造検索の第一歩です。ここでいきなり新しいサイトを開く必要はありません。ステップ1で使った UniProt のエントリ画面には構造ビューアがあり、そこから 構造検索ツール「Foldseek」を直接呼び出せます。使い慣れた画面の続きとして構造検索を体験できるので、最初の一歩として最適です。「配列相同性では引っかからないのに、構造は似ている」という感覚を、ここで確かめてください。",
          videoTitle: "UniProtからFoldseekを使って高速にタンパク質構造の類似性を検索する",
          url: "https://togotv.dbcls.jp/20260420.html",
          youtube: "LGSzMIHjU1M",
          duration: "11:31"
        },
        {
          no: 3,
          tool: "AFDB Clusters",
          action: "構造の地図を俯瞰する",
          heading: "見つけた類似性は、タンパク質情報の全体の中でどう位置づくのか",
          story:
            "ステップ2で「似た構造が見つかる」ことは分かりました。では、その類似性は特別なものなのでしょうか、それともありふれたものなのでしょうか。AFDB Clusters は約2億1400万件の予測構造を構造ベースでクラスタリングしたもので、いわばタンパク質構造の世界地図です。自分が見つけた類似性が地図のどこに位置するのかが分かると、結果の受け止め方が変わります。個別の検索結果から一歩引いて、興味をもったタンパク質の全体からの位置づけを知りましょう。",
          videoTitle:
            "AlphaFold Protein Structure Database Clustersを使ってタンパク質構造が類似するクラスターを検索する",
          url: "https://togotv.dbcls.jp/20260320.html",
          youtube: "XYI3QRoSisM",
          duration: "13:52"
        },
        {
          no: 4,
          tool: "FoldMason",
          action: "複数の構造を並べて比べる",
          heading: "2つの比較から、たくさんの比較へ",
          story:
            "ここまでは基本的に「1対1」の比較でした。次は複数の構造をまとめて扱います。FoldMason は多数の立体構造を高速に多重構造アライメントできるツールで、系統関係や構造の共通点・相違点を一望できます。並べてみてはじめて「どこがグループ共通で保存されているか」が見えてくる——この感覚が、最後のステップへの橋渡しになります。",
          videoTitle: "FoldMasonを使ってタンパク質構造のマルチプルアライメントを高速に行う (2026版)",
          url: "https://togotv.dbcls.jp/20260626.html",
          youtube: "jACphwV9ReU",
          duration: "11:14"
        },
        {
          no: 5,
          tool: "Folddisco",
          action: "「部分」で探す",
          heading: "全体ではなく、機能を担う一部分に注目するという発想",
          story:
            "コースの締めくくりは、視点の転換です。ここまで扱ってきたのはタンパク質「全体」の構造でした。Folddisco が検索するのは、機能を担う局所的な三次元配置＝モチーフです。全体としては似ていないタンパク質どうしでも、活性部位まわりの数残基の配置だけは共通している——そのような部分的な類似性を掘り出せます。ステップ4で「複数のタンパク質の共通部分が見えてくる」体験をした後だからこそ、この発想の意味がよく分かるはずです。",
          videoTitle: "Folddiscoを使って、タンパク質のモチーフの検索をする（2026年版）",
          url: "https://togotv.dbcls.jp/20260825.html",
          youtube: "R7k0eNnmtq4",
          duration: "10:04"
        }
      ],
      outro:
        "配列 → 構造検索 → 全体像 → 多重比較 → モチーフ、と5本を追いかけてきました。ここまでくれば、「配列だけでは分からないことを構造で調べる」という選択肢が、具体的な手順として頭に入っているはずです。次は自分が扱っているタンパク質で、同じ順路をなぞってみてください。より実践的な流れを見たい方は「タンパク質の構造の“遠縁”を追い詰める」ワークフローへどうぞ。",
      extras: [
        {
          videoTitle: "PyMOLのコマンドを使ってタンパク質の構造を詳細に調べる",
          url: "https://togotv.dbcls.jp/20200325.html",
          duration: "8:04",
          note: "検索で見つけた構造を、自分の手で描画して詳しく観察したくなったら。"
        },
        {
          videoTitle: "AlphaFold DB を使ってAlphaFold2で予測されたタンパク質立体構造を調べる",
          url: "https://togotv.dbcls.jp/20220221.html",
          duration: "7:33",
          note: "このコースの土台となっている AlphaFold の予測構造そのものについて。"
        }
      ],
      lectures: [
        {
          title: "AlphaFold が拓いた次世代のタンパク質構造予測 @ データ解析講習会：AJACS「AlphaFold 等のタンパク質立体構造予測ツールを知って・学んで・使う」",
          url: "https://togotv.dbcls.jp/20250612.html",
          thumbnail: "https://dbarchive.biosciencedbc.jp/data/togotv/movie/thumbnail/20250612_0.jpg",
          duration: "64:57",
          date: "2025-06-12"
        },
        {
          title: "AlphaFold時代のProtein Data Bank @ トーゴーの日シンポジウム2023",
          url: "https://togotv.dbcls.jp/20231024.html",
          thumbnail: "https://dbarchive.biosciencedbc.jp/data/togotv/movie/thumbnail/20231024_0.jpg",
          duration: "15:14",
          date: "2023-10-24"
        },
        {
          title: "PDBjを使ってタンパク質の立体構造データを見る @ AJACSオンライン10",
          url: "https://togotv.dbcls.jp/20220315.html",
          thumbnail: "https://dbarchive.biosciencedbc.jp/data/togotv/movie/thumbnail/20220315_0.jpg",
          duration: "86:50",
          date: "2022-03-15"
        }
      ]
    };
  },
  head() {
    const title = "配列から構造へ | 動画でワークフロー";
    const description =
      "UniProt から Foldseek・AFDB Clusters・FoldMason・Folddisco まで、5本の動画で順番に学ぶタンパク質構造比較の入門コースです。";
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
