<template>
  <div class="workflow_wrapper">
    <h2 class="page_title tsukushi bold">バリアントから疾患、そして創薬へ</h2>
    <p class="workflow_subtitle">ひとつの塩基の違いを、意味づけて、たどっていく</p>

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
        "手元に「気になるバリアント」がひとつあるとします。それは本当に病気と関係あるのか、タンパク質の働きをどう変えるのか、そして治療の標的になり得るのか。どれも一つのデータベースだけでは答えが出ません。このワークフローでは、頻度を調べ、影響を予測し、疾患との関連を確かめ、複数DBを重ねて絞り込み、最後に創薬ターゲットとしての可能性まで、5つのデータベースを順に渡り歩きます。",
      steps: [
        {
          no: 1,
          tool: "TogoVar",
          action: "バリアントの素性を調べる",
          heading: "出発点 ― まず、そのバリアントが何者かを押さえる",
          story:
            "最初にやるべきは「珍しさ」の確認です。日本人集団でありふれた多型なのか、ほとんど報告のない稀な変異なのか。TogoVar はヒトゲノムバリアントの頻度情報や、既存の疾患データベースとの関連をまとめて参照できる日本発のデータベースです。頻度が高ければ病原性は考えにくく、逆に稀であれば追いかける価値が出てきます。ここで方向性が決まります。",
          videoTitle: "TogoVar を使ってヒトゲノムに存在するバリアントに関連する情報を調べる",
          url: "https://togotv.dbcls.jp/20240612.html",
          youtube: "hnEYm9lomZ8",
          duration: "10:35"
        },
        {
          no: 2,
          tool: "Ensembl VEP",
          action: "分子への影響を予測する",
          heading: "その変異は、タンパク質に何をするのか",
          story:
            "頻度が分かっても、それだけでは機能への影響は分かりません。Ensembl Variant Effect Predictor (VEP) は、バリアントが遺伝子のどの領域に落ち、アミノ酸置換を起こすのか、タンパク質の構造や相互作用にどう影響し得るのかを予測します。同じ「稀な変異」でも、イントロンの奥にあるのか、活性部位のど真ん中なのかで意味はまったく違います。ここで解像度がぐっと上がります。",
          videoTitle: "Ensembl Variant Effect Predictorを使ってバリアントがタンパク質の構造や相互作用に与える影響を調べる",
          url: "https://togotv.dbcls.jp/20221107.html",
          youtube: "1J_3Ece8Cno",
          duration: "7:02"
        },
        {
          no: 3,
          tool: "OMIM",
          action: "疾患との関連を確かめる",
          heading: "その遺伝子は、すでに病気と結びつけられているか",
          story:
            "予測は予測でしかありません。次に、すでに人類が積み上げてきた知識を照合します。OMIM はヒトの遺伝性疾患と原因遺伝子・バリアントを網羅的にまとめたカタログで、「この遺伝子の変異でこういう疾患が起きる」という報告があるかを確認できます。既知であればその表現型と自分のケースを突き合わせ、未報告であれば新規性のある所見かもしれない——判断の分かれ目です。",
          videoTitle: "OMIMを使ってヒトの遺伝性疾患とそれに関連する遺伝子･バリアントを調べる",
          url: "https://togotv.dbcls.jp/20220627.html",
          youtube: "BpAUFhfFzh4",
          duration: "9:46"
        },
        {
          no: 4,
          tool: "TogoDX/Human",
          action: "複数DBを重ねて絞り込む",
          heading: "1件ずつの確認から、候補群の絞り込みへ",
          story:
            "ここまでは1つのバリアントを深掘りしてきました。実際の研究では「候補が何十個もある」ほうが普通です。TogoDX/Human はヒトに関する多数のデータベースを統合的に扱えるツールで、希少疾患編では疾患情報を軸に条件を重ねて候補を絞り込めます。組織発現、疾患関連、構造情報の有無といった条件を掛け合わせることで、追跡すべき候補が現実的な数まで減ります。",
          videoTitle: "TogoDX/Human v1.2を使ってヒトのデータベースを統合的に探索､俯瞰､抽出する (希少疾患編)",
          url: "https://togotv.dbcls.jp/20240802.html",
          youtube: "DFS-qx9oclw",
          duration: "8:40"
        },
        {
          no: 5,
          tool: "Open Targets",
          action: "創薬ターゲット性を評価する",
          heading: "それは、薬で狙える標的なのか",
          story:
            "最後は出口の話です。Open Targets は遺伝学的エビデンス・発現・パスウェイ・既存薬の情報を統合し、疾患と標的の結びつきをスコアとして示してくれます。「病気と関係がありそう」から一歩進んで、「介入できる見込みがあるか」を評価する段階です。すでに他疾患向けの薬が存在する標的なら、ドラッグリポジショニングの糸口にもなります。",
          videoTitle: "Open Targets を使って疾患に関連する潜在的な創薬ターゲットを可視化し検索する",
          url: "https://togotv.dbcls.jp/20220225.html",
          youtube: "TDpjowLfoOc",
          duration: "9:33"
        }
      ],
      outro:
        "頻度 → 分子への影響 → 疾患との関連 → 候補の絞り込み → 創薬可能性。一つのバリアントを軸に、これだけの視点を重ねられます。大事なのは、どの段階の情報も単独では結論にならないということ。複数のデータベースが同じ方向を指したときにはじめて、その所見は主張できるものになります。",
      extras: [
        {
          videoTitle: "Polyphen-2を使ってバリアントによって起こるアミノ酸置換の影響を調べる",
          url: "https://togotv.dbcls.jp/20220802.html",
          duration: "5:18",
          note: "ステップ2の予測を、別の手法でも裏取りしたいときに。"
        },
        {
          videoTitle: "GTEx Portalを使ってヒトの各組織での遺伝子発現量や影響するeQTLを調べる",
          url: "https://togotv.dbcls.jp/20240703.html",
          duration: "8:08",
          note: "コード領域外のバリアントが、発現量を通して効いている可能性を調べる。"
        },
        {
          videoTitle: "DECIPHER Phenotype browserを使って表現型からバリアントを調べる",
          url: "https://togotv.dbcls.jp/20220719.html",
          duration: "7:50",
          note: "遺伝子側からではなく、症状（表現型）側から攻めたいときの入口。"
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
          title: "バリアントの機能を推定する @ AJACSオンライン9",
          url: "https://togotv.dbcls.jp/20220107.html",
          thumbnail: "https://dbarchive.biosciencedbc.jp/data/togotv/movie/thumbnail/20220107_0.jpg",
          duration: "64:40",
          date: "2022-01-07"
        },
        {
          title: "疾患・表現型解析 (PubCaseFinder、HPO、NANDOなど) ＠ AJACSオンライン5",
          url: "https://togotv.dbcls.jp/20210205.html",
          thumbnail: "https://dbarchive.biosciencedbc.jp/data/togotv/movie/thumbnail/20210205_0.jpg",
          duration: "54:20",
          date: "2021-02-05"
        }
      ]
    };
  },
  head() {
    const title = "バリアントから疾患、そして創薬へ | 動画でワークフロー";
    const description =
      "TogoVar・Ensembl VEP・OMIM・TogoDX/Human・Open Targets をつなぎ、ひとつのバリアントを頻度から創薬ターゲット性まで追いかけるワークフローです。";
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
