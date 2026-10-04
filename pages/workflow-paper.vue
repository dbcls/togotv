<template>
  <div class="workflow_wrapper">
    <h2 class="page_title tsukushi bold">論文を探す・読む・書く・公開する</h2>
    <p class="workflow_subtitle">解析をしない日にも役に立つ、研究者の道具箱</p>

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
        "研究の時間の多くは、実は解析以外に使われています。論文を探し、読み、考えをまとめ、原稿を書き、手法を共有し、成果を再利用できる形で世に出す。このワークフローは、その一連の作業を助ける道具を、研究の流れに沿って並べたものです。生命科学の専門知識もプログラミングも必要ありません。1本3〜9分と短いので、気になったところだけ拾っても役に立ちます。",
      steps: [
        {
          no: 1,
          tool: "PubMed Central",
          action: "論文を探して読む",
          heading: "出発点 ― 誰でも読める論文にたどり着く",
          story:
            "まず読むものを見つけます。PubMed Central (PMC) は全文が無料公開されている論文のアーカイブで、所属機関の購読契約がなくても本文まで読めます。検索の絞り込み方、全文中の図表へのアクセス、引用情報の取得——ここを押さえておくと、文献収集の効率が目に見えて変わります。",
          videoTitle: "PubMed Central (PMC)を使ってオープンアクセス論文を検索・閲覧する",
          url: "https://togotv.dbcls.jp/20250116.html",
          youtube: "KTXWn-JRoKM",
          duration: "4:57"
        },
        {
          no: 2,
          tool: "Connected Papers",
          action: "関連論文を俯瞰する",
          heading: "キーワード検索では届かない論文に出会う",
          story:
            "検索窓に打ち込んだ言葉が、その分野で使われている言葉と一致するとは限りません。Connected Papers は1本の論文を起点に、引用関係から関連論文をネットワーク図として描き出します。分野の全体像、古典的な基礎論文、最近の派生研究が一目で見えるので、「読むべきものを見落としていないか」という不安に対する答えになります。",
          videoTitle: "Connected Papers を使って類似する論文を可視化する",
          url: "https://togotv.dbcls.jp/20230404.html",
          youtube: "6j5INWgLuEs",
          duration: "4:01"
        },
        {
          no: 3,
          tool: "ChatGPT",
          action: "考えを整理する",
          heading: "道具として使う ― できることと、任せてはいけないこと",
          story:
            "集めた文献を読み解き、考えをまとめる段階では対話型AIが助けになります。ただし要約させたものをそのまま信じるのは危険で、事実確認は必ず自分でやる必要があります。この動画では研究用途での基本的な使い方と、どこまでを任せてよいかの線引きを扱います。前のステップで一次情報にあたる力をつけているからこそ、AIの出力を評価できる——その順番が大事です。",
          videoTitle: "科学研究のためのChatGPTの使い方(基本編)",
          url: "https://togotv.dbcls.jp/20231228.html",
          youtube: "AWD_ugGleSk",
          duration: "6:37"
        },
        {
          no: 4,
          tool: "Cloud LaTeX",
          action: "原稿を書く",
          heading: "環境構築でつまずかずに、書きはじめる",
          story:
            "LaTeX は数式や参考文献の扱いに強い一方、環境構築でつまずきがちです。Cloud LaTeX ならブラウザだけで書きはじめられ、インストールは不要。共著者との共同編集もできるので、原稿のやりとりでバージョンが分からなくなる問題からも解放されます。まず書くことに集中したい人向けの選択肢です。",
          videoTitle: "Cloud LaTeX を使って文章やスライドを作成する",
          url: "https://togotv.dbcls.jp/20230131.html",
          youtube: "Lem9iF_QqXY",
          duration: "6:11"
        },
        {
          no: 5,
          tool: "protocols.io",
          action: "手法を共有する",
          heading: "論文の Methods に書ききれないことを、外に置く",
          story:
            "論文の材料と方法の節は、字数の制約でどうしても圧縮されます。protocols.io は実験プロトコールを詳細に記述・公開・共有できるプラットフォームで、DOI を付けて論文から参照させることもできます。再現性の担保になるだけでなく、自分の研究室内での手順の引き継ぎにも効きます。",
          videoTitle: "protocols.ioを使って研究プロトコールを作成/共有する",
          url: "https://togotv.dbcls.jp/20210727.html",
          youtube: "9TstPOx8kzg",
          duration: "8:35",
          outdated: true
        },
        {
          no: 6,
          tool: "CC ライセンス",
          action: "再利用できる形で出す",
          heading: "最後に ― 使う側と、使われる側の作法を知る",
          story:
            "成果を公開するとき、そして他人の図表を使うとき、両方でライセンスの理解が必要になります。クリエイティブ・コモンズ・ライセンスは、どの条件なら再利用してよいかを明示する仕組みです。表示義務のある素材をどう扱うか、自分の成果にどう付与するか。ここを知っているかどうかで、公開後のトラブルの有無が変わります。",
          videoTitle: "クリエイティブ・コモンズ・ライセンスの付与されたコンテンツの利用方法とその付与方法",
          url: "https://togotv.dbcls.jp/20210821.html",
          youtube: "rLWwiBxTEa4",
          duration: "3:15",
          outdated: true
        }
      ],
      outro:
        "探す → 俯瞰する → 整理する → 書く → 手法を共有する → ライセンスを付けて出す。研究の「解析以外」の部分が、これでひと通りつながりました。合計40分弱です。研究室に入ったばかりの学生に最初に見てもらうコースとしても使えます。",
      extras: [
        {
          videoTitle: "ResearchRabbit を使って論文の関連性を可視化する",
          url: "https://togotv.dbcls.jp/20221208.html",
          duration: "5:08",
          note: "ステップ2の別ツール。新着論文の追跡機能が使いたいときに。"
        },
        {
          videoTitle: "科学研究のためのChatGPTの使い方 GPT-4モデルの性能比較と画像生成・データ分析機能の紹介",
          url: "https://togotv.dbcls.jp/20240104.html",
          duration: "8:13",
          note: "ステップ3の続編。データ分析機能まで踏み込みたい方へ。"
        }
      ],
      lectures: [
        {
          title: "研究効率化の鍵は生成AI ～文献調査・資料作成を加速するサービス～ @ データ解析講習会：AJACS「ChatGPT等の生成AIツールを研究活動に活用する注意点を知って・学んで・使う」",
          url: "https://togotv.dbcls.jp/20240806.html",
          thumbnail: "https://dbarchive.biosciencedbc.jp/data/togotv/movie/thumbnail/20240806_0.jpg",
          duration: "60:51",
          date: "2024-08-06"
        },
        {
          title: "オープンサイエンスの潮流と学術出版の多様化: プレプリントと研究データにどう向き合うか @ AJACSオンライン16",
          url: "https://togotv.dbcls.jp/20230816.html",
          thumbnail: "https://dbarchive.biosciencedbc.jp/data/togotv/movie/thumbnail/20230816_0.jpg",
          duration: "52:13",
          date: "2023-08-16"
        },
        {
          title: "データに関する各種トピック (FAIR原則、DOI、データ論文) @ Bio”Pack”athon2023#10",
          url: "https://togotv.dbcls.jp/20231029.html",
          thumbnail: "https://dbarchive.biosciencedbc.jp/data/togotv/movie/thumbnail/20231029_0.jpg",
          duration: "28:56",
          date: "2023-10-29"
        }
      ]
    };
  },
  head() {
    const title = "論文を探す・読む・書く・公開する | 動画でワークフロー";
    const description =
      "PubMed Central・Connected Papers・ChatGPT・Cloud LaTeX・protocols.io・CCライセンスをつないだ、研究の「解析以外」を支える道具のワークフローです。";
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
