<template>
  <div class="workflow_wrapper">
    <h2 class="page_title tsukushi bold">ミスセンス変異を、頻度から立体構造まで</h2>
    <p class="workflow_subtitle">TogoVar で日本人集団での頻度と病原性を調べ、予測ツールと立体構造で変異の影響を確かめる</p>

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
        "アミノ酸を1つ置き換えるミスセンス変異は、病気の原因になることもあれば、まったく影響のない個人差であることもあります。その見極めには、まず「どのくらいの人が持っているか」という頻度、次に「タンパク質の機能を損なうか」という予測、そして「立体構造のどこで起きているか」という位置の情報が手がかりになります。このワークフローでは、日本人集団のバリアント頻度を横断的に調べられる TogoVar から出発し、PolyPhen-2 と Ensembl VEP で影響の予測を確かめ、最後に AlphaFold DB でタンパク質の立体構造の上に変異の位置を置いて見ます。",
      steps: [
        {
          no: 1,
          tool: "TogoVar",
          action: "日本人での頻度と病原性を調べる",
          heading: "そのバリアントは、日本人集団でどのくらいの頻度で見られるか",
          story:
            "TogoVar は、複数の国内研究プロジェクトから得られた日本人集団のバリアント頻度と、それに関係する疾患情報や論文をまとめたデータベースです。世界最大級の gnomAD でも、日本人に特化した頻度は十分に得られません。この動画では、日本人に特徴的な遺伝性疾患のバリアント（GJB2 遺伝子の c.235delC など）を例に、データセットごとのアレル頻度と臨床的意義を確認します。さらに OCA2 遺伝子のミスセンスバリアントを例に、SIFT・PolyPhen-2 による予測と、臨床的な判定が分かれる場合があることも紹介しています。",
          videoTitle: "TogoVarを使って、日本人に特徴的な遺伝性疾患のバリアントの頻度と病原性を調べる（2026年版）",
          url: "https://togotv.dbcls.jp/20261007.html",
          youtube: "w-S0l6eZuyE",
          duration: "5:59"
        },
        {
          no: 2,
          tool: "TogoVar",
          action: "集団ごとに比べ、ミスセンスを評価する",
          heading: "条件を絞り込んで探し、世界の集団と頻度を比べる",
          story:
            "続いて、もう一歩踏み込んだ使い方です。Advanced search では、疾患名・遺伝子名・バリアントの種類などの条件を組み合わせて、目的のバリアントを絞り込めます。この動画では、もやもや病に関連する RNF213 遺伝子のバリアントを例に、日本人集団の頻度を gnomAD の各集団（東アジア、南アジアなど）と比べます。また、肺がんに関連する EGFR 遺伝子のミスセンスバリアントを例に、SIFT・PolyPhen-2 のスコアや ClinVar・MGeND の臨床的意義をあわせて評価する方法を紹介しています。",
          videoTitle: "TogoVarを使って疾患に関連したバリアントの集団における頻度を調べる（2026年版）",
          url: "https://togotv.dbcls.jp/20261008.html",
          youtube: "ajErvF53Pq4",
          duration: "9:16"
        },
        {
          no: 3,
          tool: "PolyPhen-2",
          action: "予測の根拠を確かめる",
          heading: "アミノ酸置換の影響予測を、PolyPhen-2 で詳しく見る",
          story:
            "TogoVar に表示される PolyPhen-2 のスコアは、どのような根拠で計算されているのでしょうか。PolyPhen-2 は、多くの生物種の配列を並べたマルチプルアラインメントから分かる進化的な保存性と、タンパク質の立体構造の情報を考慮して、アミノ酸置換がタンパク質の機能に影響するかを予測するプログラムです。この動画では、ALDH2 遺伝子の rs671 を例に、UniProtKB の ID とアミノ酸置換を入力して予測結果を読む方法を紹介しています。ステップ1・2で見た予測スコアの意味を、ここで確かめましょう。",
          videoTitle: "Polyphen-2を使ってバリアントによって起こるアミノ酸置換の影響を調べる",
          url: "https://togotv.dbcls.jp/20220802.html",
          youtube: "CKTNo-esFdE",
          duration: "5:18"
        },
        {
          no: 4,
          tool: "Ensembl VEP",
          action: "構造・相互作用への影響を予測する",
          heading: "複数の予測をまとめて、変異の影響を見比べる",
          story:
            "1つの予測ツールだけで判断するのは危険です。Ensembl Variant Effect Predictor（VEP）は、バリアントがどの遺伝子・どの転写産物のどの領域に位置し、どのようなアミノ酸の変化を起こすかを示すとともに、タンパク質の構造や相互作用への影響に関する予測をまとめて表示するツールです。この動画では、ClinVar で見つけたバリアントを、バリアントの ID や HGVS 表記で検索する例を紹介しています。PolyPhen-2 の予測とあわせて、複数の根拠が同じ方向を指しているかを確かめます。",
          videoTitle: "Ensembl Variant Effect Predictorを使ってバリアントがタンパク質の構造や相互作用に与える影響を調べる",
          url: "https://togotv.dbcls.jp/20221107.html",
          youtube: "1J_3Ece8Cno",
          duration: "7:02"
        },
        {
          no: 5,
          tool: "AlphaFold DB",
          action: "立体構造の上で位置を確かめる",
          heading: "変異したアミノ酸が、立体構造のどこにあるかを見る",
          story:
            "最後に、変異したアミノ酸の位置をタンパク質の立体構造の上で確かめます。AlphaFold DB は、AlphaFold で予測された立体構造のデータベースで、UniProt に登録されたヒトのタンパク質の予測構造を検索して表示できます。変異がタンパク質の内部にあるのか表面にあるのか、ほかの領域と接する場所にあるのかによって、影響の大きさは変わります。この動画では、検索方法と予測構造の見方、予測の信頼度や利用時の注意点を紹介しています。実験で決定された構造が PDB にある場合は、そちらも確認しましょう。",
          videoTitle: "AlphaFold DB を使ってAlphaFold2で予測されたタンパク質立体構造を調べる",
          url: "https://togotv.dbcls.jp/20220221.html",
          youtube: "-NaYkOlc8AY",
          duration: "7:33"
        }
      ],
      outro:
        "日本人での頻度を調べる → 集団ごとに比べて評価する → 予測の根拠を確かめる → 複数の予測を見比べる → 立体構造の上で位置を確かめる。頻度が高ければ病気の原因である可能性は低く、まれで、予測ツールがそろって影響ありとし、立体構造の重要な位置にあれば、注目すべき変異の候補になります。ただし、予測はあくまで予測です。頻度・予測・構造・臨床的意義という複数の視点を重ねて、はじめて判断の根拠になります。",
      extras: [
        {
          videoTitle: "gnomAD v2.1.1 を使ってヒトバリアントの集団中のアレル頻度を調べる",
          url: "https://togotv.dbcls.jp/20210823.html",
          duration: "11:27",
          note: "ステップ2で比べた世界の集団の頻度を、gnomAD 側から詳しく調べる。"
        },
        {
          videoTitle: "ClinVar を使って疾患に関連するバリアントを検索する",
          url: "https://togotv.dbcls.jp/20210405.html",
          duration: "9:21",
          note: "臨床的意義の判定と、その根拠となった報告を ClinVar で確かめる。"
        },
        {
          videoTitle: "Docker版のVEPを導入して、バリアント情報にアノテーションし、基本的な統計情報を調べる",
          url: "https://togotv.dbcls.jp/20251230.html",
          duration: "8:49",
          note: "手元の VCF ファイルに含まれる多数のバリアントを、VEP でまとめて評価したいときに。"
        },
        {
          videoTitle: "Google Colab版公式のAlphaFold2.1 Notebook を使ってタンパク質立体構造予測をする",
          url: "https://togotv.dbcls.jp/20220517.html",
          duration: "5:49",
          note: "AlphaFold DB に目的の構造がない場合に、自分で立体構造を予測する。"
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
          title: "タンパク質立体構造予測の実践と応用 @ データ解析講習会：AJACS「AlphaFold 等のタンパク質立体構造予測ツールを知って・学んで・使う」",
          url: "https://togotv.dbcls.jp/20250613.html",
          thumbnail: "https://dbarchive.biosciencedbc.jp/data/togotv/movie/thumbnail/20250613_0.jpg",
          duration: "61:10",
          date: "2025-06-13"
        },
        {
          title: "AlphaFold が拓いた次世代のタンパク質構造予測 @ データ解析講習会：AJACS「AlphaFold 等のタンパク質立体構造予測ツールを知って・学んで・使う」",
          url: "https://togotv.dbcls.jp/20250612.html",
          thumbnail: "https://dbarchive.biosciencedbc.jp/data/togotv/movie/thumbnail/20250612_0.jpg",
          duration: "64:57",
          date: "2025-06-12"
        }
      ]
    };
  },
  head() {
    const title = "ミスセンス変異を、頻度から立体構造まで | 動画でワークフロー";
    const description =
      "TogoVar・PolyPhen-2・Ensembl VEP・AlphaFold DB をつなぎ、ミスセンス変異を日本人集団での頻度から影響予測、立体構造上の位置までたどるワークフローです。";
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
