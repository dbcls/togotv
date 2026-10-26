<template>
  <div class="workflow_wrapper">
    <h2 class="page_title tsukushi bold">日本人の多型から、ありふれた病気のリスクへ</h2>
    <p class="workflow_subtitle">TogoVar と gnomAD で集団ごとの頻度を比べ、GWAS・eQTL・ポリジェニックスコアへとつなぐ</p>

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
        "糖尿病や高血圧のようなありふれた病気（多因子疾患）は、1つの変異で決まるのではなく、それぞれは影響の小さい多くのバリアントと、生活習慣などの環境要因が重なって発症すると考えられています。また、同じバリアントでも集団によって頻度が大きく異なることがあります。このワークフローでは、TogoVar で日本人集団の頻度を世界の集団と比べるところから始め、gnomAD、GWAS Catalog、GTEx と進み、最後に多数のバリアントの影響をまとめてリスクとして表すポリジェニックスコアの考え方までをつなぎます。",
      steps: [
        {
          no: 1,
          tool: "TogoVar",
          action: "日本人の頻度を世界と比べる",
          heading: "そのバリアントは、日本人や東アジアに多いのか",
          story: "TogoVar は、複数の国内研究プロジェクトから得られた日本人集団のバリアント頻度をまとめたデータベースです。ここでは動画のうち、Advanced search で疾患名・遺伝子名・バリアントの種類などの条件を組み合わせて絞り込み、もやもや病に関連する RNF213 遺伝子のバリアントについて、日本人集団の頻度を gnomAD の各集団（東アジア、南アジアなど）と比べる部分を再生します。日本人や東アジアの集団に特に多いバリアントがあることが、ここで実感できます。",
          videoTitle: "TogoVarを使って疾患に関連したバリアントの集団における頻度を調べる（2026年版）",
          url: "https://togotv.dbcls.jp/20261008.html",
          youtube: "ajErvF53Pq4",
          duration: "9:16",
          end: "6:45"
        },
        {
          no: 2,
          tool: "gnomAD",
          action: "世界の集団での頻度を調べる",
          heading: "世界の集団ごとのアレル頻度を、gnomAD で詳しく見る",
          story: "gnomAD は、さまざまな大規模シーケンスプロジェクトから得られたエキソームと全ゲノムのデータを集約したデータベースで、見つかったバリアントが一般的なものなのか、まれなものなのかを判断するためのリファレンスとして広く使われています。この動画では、gnomAD v2.1.1 を使って、基本的な検索方法と、集団ごとのアレル頻度などデータの見方を紹介しています。ステップ1で見た集団差を、世界の集団全体の中で確かめましょう。",
          videoTitle: "gnomAD v2.1.1 を使ってヒトバリアントの集団中のアレル頻度を調べる",
          url: "https://togotv.dbcls.jp/20210823.html",
          youtube: "8jXGsBs-fGo",
          duration: "11:27",
          outdated: true
        },
        {
          no: 3,
          tool: "GWAS Catalog",
          action: "形質との関連を調べる",
          heading: "そのバリアントは、どのような病気や形質と関連が報告されているか",
          story: "ありふれた病気に関わるバリアントは、多くの人のゲノムを比べる全ゲノム関連解析（GWAS）で見つかってきました。GWAS Catalog は、公開された GWAS の論文から、キュレーターがバリアントと形質（病気や身長などの特徴）の関連を集めたデータベースです。病名などの形質名、遺伝子名、SNP の ID で検索できます。この動画では、乳がんを例に基本的な使い方を紹介しています。",
          videoTitle: "GWAS Catalog を使ってGWASで見つかった形質と多型の関連について検索する",
          url: "https://togotv.dbcls.jp/20210212.html",
          youtube: "L3iVHSesqDE",
          duration: "10:59",
          outdated: true
        },
        {
          no: 4,
          tool: "GTEx Portal",
          action: "遺伝子発現への影響を調べる",
          heading: "そのバリアントは、どの組織で、どの遺伝子の発現量を変えるのか",
          story: "GWAS で見つかるバリアントの多くは、タンパク質のアミノ酸を変えない、遺伝子の外側の領域にあります。そうしたバリアントは、遺伝子の発現量を変えることで働いている場合があります。GTEx Portal では、ヒトの組織ごとの遺伝子発現量と、発現量に影響を与えるバリアント（eQTL）を調べられます。この動画では、組織別の発現量の表示、eQTL の検索、Locus Browser やゲノムブラウザーで eQTL と GWAS で検出された SNP をあわせて見る方法を紹介しています。",
          videoTitle: "GTEx Portalを使ってヒトの各組織での遺伝子発現量や影響するeQTLを調べる",
          url: "https://togotv.dbcls.jp/20240703.html",
          youtube: "iEvUOpgu3_Y",
          duration: "8:08"
        },
        {
          no: 5,
          tool: "ポリジェニックスコア",
          action: "多数のバリアントをリスクにまとめる",
          heading: "影響の小さい多くのバリアントを、1つのリスクの数値にまとめる",
          story: "1つ1つのバリアントの影響は小さくても、多数を足し合わせると、病気へのかかりやすさの違いとして見えてきます。それを数値にしたものがポリジェニックスコア（PGS）です。この動画は一般向けの解説で、ポリジェニックスコアの仕組みと計算方法、データの見方、生活習慣との関係、そして倫理的・法的・社会的課題（ELSI）を含めた現状と今後の展望を紹介しています。ステップ1〜4で見てきた頻度・関連・機能の情報が、最終的にどのように使われるのかが分かります。",
          videoTitle: "ポリジェニックスコアとは？〜仕組みから医療・社会での活用・課題まで〜",
          url: "https://togotv.dbcls.jp/20260823.html",
          youtube: "imGAGZmMfSE",
          duration: "6:21"
        }
      ],
      outro:
        "日本人の頻度を世界と比べる → 世界の集団での頻度を調べる → 形質との関連を調べる → 遺伝子発現への影響を調べる → 多数のバリアントをリスクにまとめる。ありふれた病気の遺伝的な背景は、1つのバリアントだけでは説明できません。集団ごとの頻度の違いを踏まえたうえで、関連と機能の情報を重ねていくことが大切です。海外の集団で作られた関連やスコアが、日本人にもそのまま当てはまるとは限らない点にも注意しましょう。",
      extras: [
        {
          videoTitle: "TogoVarを使って、日本人に特徴的な遺伝性疾患のバリアントの頻度と病原性を調べる（2026年版）",
          url: "https://togotv.dbcls.jp/20261007.html",
          duration: "5:59",
          note: "TogoVar の基本的な使い方（頻度と病原性の調べ方）から確認したいときに。"
        },
        {
          videoTitle: "What Is a Polygenic Score? — From How It Works to Its Applications and Challenges in Medicine and Society",
          url: "https://togotv.dbcls.jp/20260824.html",
          duration: "4:59",
          note: "ステップ5の動画の英語版。"
        },
        {
          videoTitle: "MoG+: 理研BRCマウスゲノム多型データベースを使って実験用マウス系統の多型情報を調べる",
          url: "https://togotv.dbcls.jp/20250415.html",
          duration: "5:14",
          note: "ヒトで見つけたバリアントの働きを、マウスの系統間の多型から調べたいときに。"
        }
      ],
      lectures: [
        {
          title: "インピュテーション解析 @ データ解析講習会：AJACS「日本人ゲノムバリアント解析ツールを知って・学んで・使う」",
          url: "https://togotv.dbcls.jp/20260208.html",
          thumbnail: "https://dbarchive.biosciencedbc.jp/data/togotv/movie/thumbnail/20260208_0.jpg",
          duration: "60:00",
          date: "2026-02-08"
        },
        {
          title: "TogoVar の活用事例で学ぶバリアントデータベースの使い方 @ データ解析講習会：AJACS「日本人ゲノムバリアント解析ツールを知って・学んで・使う」",
          url: "https://togotv.dbcls.jp/20260209.html",
          thumbnail: "https://dbarchive.biosciencedbc.jp/data/togotv/movie/thumbnail/20260209_0.jpg",
          duration: "51:40",
          date: "2026-02-09"
        },
        {
          title: "ヒトACTGハプロタイプデータベース JoGo: Joint Open Genome and Omics Platform",
          url: "https://togotv.dbcls.jp/20250901.html",
          thumbnail: "https://dbarchive.biosciencedbc.jp/data/togotv/movie/thumbnail/20250901_0.jpg",
          duration: "8:18",
          date: "2025-09-01"
        },
        {
          title: "ヒトDB・ヒト多型解析 (TogoVar、HGVDなど) ＠ AJACSオンライン5",
          url: "https://togotv.dbcls.jp/20210203.html",
          thumbnail: "https://dbarchive.biosciencedbc.jp/data/togotv/movie/thumbnail/20210203_0.jpg",
          duration: "57:31",
          date: "2021-02-03"
        }
      ]
    };
  },
  head() {
    const title = "日本人の多型から、ありふれた病気のリスクへ | 動画でワークフロー";
    const description =
      "TogoVar・gnomAD・GWAS Catalog・GTEx Portal をつなぎ、日本人集団のバリアント頻度から、形質との関連、遺伝子発現への影響、ポリジェニックスコアの考え方までたどるワークフローです。";
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
