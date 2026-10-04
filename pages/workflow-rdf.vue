<template>
  <div class="workflow_wrapper">
    <h2 class="page_title tsukushi bold">クリックの先へ</h2>
    <p class="workflow_subtitle">RDF／SPARQL でデータベースを横断して情報を集めるワークフロー</p>

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
        "データベースの画面を開いて、1件ずつコピーして、表計算ソフトに貼り付ける——調べる対象が数件ならそれで十分です。でも「ヒトの全キナーゼについて、構造情報と疾患との関連をまとめたい」となった瞬間、その手作業は破綻します。生命科学のデータベースの多くは RDF という形式でも公開されていて、SPARQL という言語で「問い合わせる」ことができます。このワークフローでは、UniProt を題材に、画面をクリックする世界から、まとめて問い合わせる世界へ移っていきます。",
      steps: [
        {
          no: 1,
          tool: "UniProt",
          action: "まず画面で調べてみる",
          heading: "出発点 ― 手で調べるやり方と、その限界を知る",
          story:
            "最初は普通に Web 画面から始めます。UniProt でアミノ酸配列や機能アノテーションをどう探すか、アクセッション番号がどういう役割を持つかを押さえておきましょう。ここで「1件ずつなら簡単に引ける」という感覚を持っておくことが大事です。次のステップで、まったく同じ情報を別のやり方で取りにいくので、その対比が効いてきます。",
          videoTitle: "UniProtを使って、タンパク質のアミノ酸配列とその機能情報を横断的・網羅的に調べる",
          url: "https://togotv.dbcls.jp/20170912.html",
          youtube: "VqGtn2cDBOk",
          duration: "8:03",
          outdated: true
        },
        {
          no: 2,
          tool: "UniProt SPARQL",
          action: "クエリで問い合わせる",
          heading: "同じデータベースを、画面ではなく“質問文”で引く",
          story:
            "ここがこのワークフローの中心です。UniProt は RDF でもデータを公開しており、SPARQL エンドポイントに問い合わせれば、条件に合うエントリを何百件でも一度に取り出せます。ステップ1で画面を何度もクリックして集めていた情報が、1本のクエリに置き換わる——この体験が、この先すべての土台になります。動画では実際のクエリの書き方と実行までを追えます。",
          videoTitle: "UniProtからSPARQLを使って情報を取得する",
          url: "https://togotv.dbcls.jp/20251027.html",
          youtube: "htIxnufmtqM",
          duration: "9:25"
        },
        {
          no: 3,
          tool: "TogoID",
          action: "IDを変換して橋を架ける",
          heading: "UniProt の外へ出るために ― データベース間をつなぐ",
          story:
            "SPARQL で UniProt から情報を取れるようになると、次にぶつかるのが「他のデータベースとどうつなぐか」です。データベースごとに ID の体系が違うため、そのままでは接続できません。TogoID は生命科学系データベースの ID どうしの対応関係をたどって変換できるサービスで、UniProt の ID を PDB や遺伝子、疾患のデータベースの ID へと橋渡ししてくれます。横断利用のための、いわば継手にあたるステップです。",
          videoTitle: "TogoID ver. 2.0を使って生命科学系データベースのさまざまなIDを探索的に変換する",
          url: "https://togotv.dbcls.jp/20241219.html",
          youtube: "ORW1GGIaJsY",
          duration: "9:51"
        },
        {
          no: 4,
          tool: "TogoDX/Human",
          action: "複数DBをまとめて俯瞰する",
          heading: "つないだ先で、条件を重ねて絞り込む",
          story:
            "ID がつながれば、複数のデータベースにまたがった絞り込みができるようになります。TogoDX/Human は、ヒトに関する多数のデータベースを統合的に探索・俯瞰し、条件に合う対象を抽出できるツールです。「発現している組織」「疾患との関連」「構造情報の有無」といった条件を重ねていく作業を、クエリを書かずに画面上で試せます。ステップ2〜3でやったことが、どんな分析につながるのかがここで具体的に見えてきます。",
          videoTitle: "TogoDX/Human v1.2を使ってヒトのデータベースを統合的に探索､俯瞰､抽出する (基本操作編)",
          url: "https://togotv.dbcls.jp/20240613.html",
          youtube: "QCRLLuXVVRg",
          duration: "8:32"
        },
        {
          no: 5,
          tool: "TogoMCP",
          action: "自然言語で横断検索する",
          heading: "そして今 ― クエリを書かずに、同じことを頼む",
          story:
            "最後に、いま起きつつある変化を見ておきます。TogoMCP を使うと、ChatGPT のような対話型 AI から生命科学データベースへ横断的に問い合わせられます。ステップ2で手で書いた SPARQL を、AI に組み立てさせるイメージです。ただし、返ってきた結果が妥当かどうかを判断できるのは、ステップ1〜4を通ってきた人だけです。仕組みを知った上で使うからこそ、この便利さが武器になります。",
          videoTitle: "ChatGPT + TogoMCP で生命科学データをデータベース横断的に検索する (実行編)",
          url: "https://togotv.dbcls.jp/20260502.html",
          youtube: "Cj1fUCNpk9E",
          duration: "4:45"
        }
      ],
      outro:
        "画面をクリックする → クエリで問い合わせる → データベースをつなぐ → まとめて俯瞰する → AI に頼む。この5本を通ると、「調べる対象が増えても手作業を増やさない」というやり方が身につきます。まずはステップ2の SPARQL を、自分がよく使うタンパク質で書き換えて実行してみてください。そこが一番の分かれ目です。",
      extras: [
        {
          videoTitle: "ChatGPT + TogoMCP で生命科学データをデータベース横断的に検索する (セットアップ編)",
          url: "https://togotv.dbcls.jp/20260421.html",
          duration: "6:44",
          note: "ステップ5を実際に自分の環境で動かすには、まずこちらの設定から。"
        },
        {
          videoTitle: "Semantic WebとRDF @ 第4回RDF講習会",
          url: "https://togotv.dbcls.jp/20191209.html",
          duration: "59:50",
          note: "そもそも RDF とは何か。考え方から腰を据えて学びたい方へ。"
        },
        {
          videoTitle: "SPARQLクエリの基本 @ 第4回RDF講習会",
          url: "https://togotv.dbcls.jp/20191211.html",
          duration: "57:13",
          note: "ステップ2をきっかけに、クエリ言語を体系的に押さえたくなったら。"
        }
      ],
      lectures: [
        {
          title: "生命科学分野における知識グラフとRDFポータル @ データ解析講習会：AJACS「生命科学分野におけるナレッジグラフとオントロジーを知って・学んで・使う」",
          url: "https://togotv.dbcls.jp/20250731.html",
          thumbnail: "https://dbarchive.biosciencedbc.jp/data/togotv/movie/thumbnail/20250731_0.jpg",
          duration: "34:32",
          date: "2025-07-31"
        },
        {
          title: "TogoID による生命科学データベースの横断利用 @ データ解析講習会：AJACS「生命科学分野におけるナレッジグラフとオントロジーを知って・学んで・使う」",
          url: "https://togotv.dbcls.jp/20250801.html",
          thumbnail: "https://dbarchive.biosciencedbc.jp/data/togotv/movie/thumbnail/20250801_0.jpg",
          duration: "32:20",
          date: "2025-08-01"
        },
        {
          title: "大規模言語モデルを用いたサンプルメタデータの自動キュレーション @ データ解析講習会：AJACS「生命科学分野におけるナレッジグラフとオントロジーを知って・学んで・使う」",
          url: "https://togotv.dbcls.jp/20250803.html",
          thumbnail: "https://dbarchive.biosciencedbc.jp/data/togotv/movie/thumbnail/20250803_0.jpg",
          duration: "28:02",
          date: "2025-08-03"
        }
      ]
    };
  },
  head() {
    const title = "クリックの先へ | 動画でワークフロー";
    const description =
      "UniProt の SPARQL から TogoID・TogoDX・TogoMCP まで、RDF を使ってデータベースを横断的に扱うための5本の動画をつないだワークフローです。";
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
