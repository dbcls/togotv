<template>
  <div class="workflow_wrapper">
    <h2 class="page_title tsukushi bold">タンパク質構造の“遠縁”を追い詰める</h2>
    <p class="workflow_subtitle">配列では見つからない相手を、立体構造で探し出す実践ワークフロー</p>

    <nuxt-link class="back_link" :to="localePath('/workflows.html')">← 動画でワークフロー 一覧へ</nuxt-link>

    <VideoWorkflow :lead="lead" :steps="steps" :outro="outro" :lectures="lectures" />
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
        "アミノ酸配列を比べても引っかからない。でも立体構造を見ると、驚くほどよく似ている——そんな「遠縁のタンパク質」を掘り当てるのが構造検索ツールの真骨頂です。AlphaFold の登場で予測構造は2億件を超え、いまや構造から探すことが現実的な選択肢になりました。このワークフローでは、俯瞰する → 探す → 並べる → 絞り込む、の4ステップで解像度を上げながら目的のタンパク質に迫っていきます。",
      steps: [
        {
          no: 1,
          tool: "AFDB Clusters",
          action: "構造空間を俯瞰する",
          heading: "まず、自分のタンパク質が“どのあたり”にいるのかを知る",
          story:
            "いきなり検索を始める前に、地図を見ておきます。AlphaFold Protein Structure Database（AFDB）には約2億1400万件の予測構造が登録されており、AFDB Clusters はそれを構造ベースでクラスタリングしたものです。自分の興味あるタンパク質がどんな仲間に囲まれているかが分かると、この先どの方向を掘るべきかの当たりがつきます。動画ではメチシリン耐性黄色ブドウ球菌（MRSA）の耐性遺伝子 mecA がコードする PBP2a を例に、耐性の鍵となる構造がどのクラスターに属するのかを追っていきます。",
          videoTitle:
            "AlphaFold Protein Structure Database Clustersを使ってタンパク質構造が類似するクラスターを検索する",
          url: "https://togotv.dbcls.jp/20260320.html",
          youtube: "XYI3QRoSisM",
          duration: "13:52"
        },
        {
          no: 2,
          tool: "Foldseek",
          action: "類似構造を高速に検索する",
          heading: "方向が見えたら、1つの構造を軸に候補を集める",
          story:
            "地図で当たりをつけたら、次は具体的な候補リストをつくります。Foldseek は立体構造を「3Di 構造アルファベット」という文字列に変換することで、構造検索を配列検索なみの速度で実行できるツールです。UniProt の構造ビューアから直接呼び出せる連携機能があるので、気になるタンパク質のエントリを開いたその場で類似構造検索まで進めます。ステップ1で見えた方向性が、ここで「比較すべきタンパク質のリスト」という具体的な形になります。",
          videoTitle: "UniProtからFoldseekを使って高速にタンパク質構造の類似性を検索する",
          url: "https://togotv.dbcls.jp/20260420.html",
          youtube: "LGSzMIHjU1M",
          duration: "11:31"
        },
        {
          no: 3,
          tool: "FoldMason",
          action: "候補をまとめて並べる",
          heading: "1対1では見えないものを、多重構造アライメントで浮かび上がらせる",
          story:
            "候補が集まったら、2つずつ見比べるのはやめて一気に並べます。FoldMason は多数の立体構造を高速に多重構造アライメント（MSTA: multiple structural alignment）し、系統関係や構造類似性をまとめて可視化できるツールです。集めた候補が本当に一つのファミリーなのか、それともいくつかのグループに分かれるのかがここで判断できます。同時に「どの部分がグループ共通で保存されているか」も見えてきます——これが次のステップの検索キーになります。動画では緑膿菌のリパーゼとその触媒トライアド（触媒反応に関与する3つのアミノ酸残基からなる構造）を例に解説しています。",
          videoTitle: "FoldMasonを使ってタンパク質構造のマルチプルアライメントを高速に行う (2026版)",
          url: "https://togotv.dbcls.jp/20260626.html",
          youtube: "jACphwV9ReU",
          duration: "11:14"
        },
        {
          no: 4,
          tool: "Folddisco",
          action: "部分モチーフで絞り込む",
          heading: "全体は似ていなくても、機能を担う“部分”は残っているかもしれない",
          story:
            "最後に、粒度をもう一段下げます。Foldseek がタンパク質全体の構造を比べるのに対し、Folddisco は局所的な三次元配置＝モチーフの検索に特化したツールです。ステップ3のアライメントで浮かび上がった共通モチーフを検索キーにすれば、全体構造ではもはや似ていない、さらに遠縁のタンパク質にまで手が届きます。動画ではマウスの Egr1 がもつ C2H2 型ジンクフィンガーを例に、モチーフ検索の実際が示されています。",
          videoTitle: "Folddiscoを使って、タンパク質のモチーフの検索をする（2026年版）",
          url: "https://togotv.dbcls.jp/20260825.html",
          youtube: "R7k0eNnmtq4",
          duration: "10:04"
        }
      ],
      outro:
        "この4ステップは「全体を俯瞰する → 個別に探す → 並べて比べる → 部分に絞る」という、徐々に解像度が上がっていく流れになっています。どこから入っても構いませんが、順番にたどると、なぜ Folddisco のような部分モチーフ検索が必要になるのかが自然に分かってきます。手元のタンパク質で同じ順路を歩いてみてください。",
      lectures: [
        {
          title: "AlphaFold が拓いた次世代のタンパク質構造予測 @ データ解析講習会：AJACS「AlphaFold 等のタンパク質立体構造予測ツールを知って・学んで・使う」",
          url: "https://togotv.dbcls.jp/20250612.html",
          thumbnail: "https://dbarchive.biosciencedbc.jp/data/togotv/movie/thumbnail/20250612_0.jpg",
          duration: "64:57",
          date: "2025-06-12"
        },
        {
          title: "タンパク質立体構造予測の実践と応用 @ データ解析講習会：AJACS「AlphaFold 等のタンパク質立体構造予測ツールを知って・学んで・使う」",
          url: "https://togotv.dbcls.jp/20250613.html",
          thumbnail: "https://dbarchive.biosciencedbc.jp/data/togotv/movie/thumbnail/20250613_0.jpg",
          duration: "61:10",
          date: "2025-06-13"
        },
        {
          title: "AlphaFold時代のProtein Data Bank @ トーゴーの日シンポジウム2023",
          url: "https://togotv.dbcls.jp/20231024.html",
          thumbnail: "https://dbarchive.biosciencedbc.jp/data/togotv/movie/thumbnail/20231024_0.jpg",
          duration: "15:14",
          date: "2023-10-24"
        }
      ]
    };
  },
  head() {
    const title = "タンパク質の構造の“遠縁”を追い詰める | 動画でワークフロー";
    const description =
      "AFDB Clusters・Foldseek・FoldMason・Folddisco の4本の動画を、俯瞰→探索→比較→絞り込みの順につないだタンパク質構造検索の実践ワークフローです。";
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
