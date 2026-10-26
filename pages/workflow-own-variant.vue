<template>
  <div class="workflow_wrapper">
    <h2 class="page_title tsukushi bold">自分のデータで見つけた変異を、公共データで意味づける</h2>
    <p class="workflow_subtitle">IGV でリードを確かめ、VEP でまとめてアノテーションし、TogoVar と ClinVar で頻度と臨床的意義を調べる</p>

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
        "シーケンス解析で変異が見つかったら、それが本物なのか、どのような意味をもつのかを確かめる必要があります。読み取りの誤りを変異と取り違えていないか、遺伝子のどこに影響するのか、日本人集団でありふれたものではないか、病気との関連が報告されているか。このワークフローでは、自分で取得したデータを出発点に、IGV でリードを目で確かめ、Ensembl VEP でバリアントにまとめてアノテーションし、TogoVar と ClinVar で頻度と臨床的意義を調べ、最後に UCSC Genome Browser で自分のデータを公共のアノテーションと重ねて見ます。",
      steps: [
        {
          no: 1,
          tool: "IGV",
          action: "リードで変異を確かめる",
          heading: "その変異は、リードの上で本当に見えているか",
          story: "変異の候補が見つかったら、まずマッピングしたリードそのものを見て確かめます。Integrative Genomics Viewer（IGV）は、自分の PC 上でも動くゲノムビューアです。この動画では、HISAT2 などでヒトゲノム（hg38）にマッピングした結果を保存した BAM ファイルを読み込み、リードの並びを可視化する方法を、iPS 細胞のトランスクリプトームのデータを例に紹介しています。その位置を十分な数のリードが覆っているか、変異を含むリードの割合はどのくらいか、読み取りの誤りが多い領域ではないかを、ここで目で確かめます。",
          videoTitle: "Integrative Genomics Viewer IGVを使い倒す 〜マッピングデータを可視化する〜（2026年版）",
          url: "https://togotv.dbcls.jp/20261006.html",
          youtube: "tKcuygc78Qo",
          duration: "12:17"
        },
        {
          no: 2,
          tool: "Ensembl VEP",
          action: "まとめてアノテーションする",
          heading: "多数のバリアントに、遺伝子上の位置と影響をまとめて付ける",
          story: "解析で得られるバリアントは、数個ではなく数千〜数百万個になることもあります。1つずつウェブで調べるのは現実的ではありません。Ensembl Variant Effect Predictor（VEP）を自分の PC で動かせば、VCF ファイルに含まれるバリアントに、どの遺伝子・どの転写産物のどの領域に位置し、どのような変化を起こすかといった情報をまとめて付けられます。この動画では、Docker を使って VEP の実行環境を用意し、VCF ファイルにアノテーションを行い、基本的な統計情報を調べる方法を紹介しています。",
          videoTitle: "Docker版のVEPを導入して、バリアント情報にアノテーションし、基本的な統計情報を調べる",
          url: "https://togotv.dbcls.jp/20251230.html",
          youtube: "Zb1y9crTfAk",
          duration: "8:49"
        },
        {
          no: 3,
          tool: "TogoVar",
          action: "日本人での頻度と病原性を調べる",
          heading: "そのバリアントは、日本人集団でありふれたものではないか",
          story: "VEP で絞り込んだ注目すべきバリアントについて、日本人集団でどのくらいの頻度で見られるかを確かめます。TogoVar は、複数の国内研究プロジェクトから得られた日本人集団のバリアント頻度と、それに関係する疾患情報をまとめたデータベースです。この動画では、日本人に特徴的な遺伝性疾患のバリアントを例に、データセットごとのアレル頻度と臨床的意義、SIFT・PolyPhen-2 による予測の確認方法を紹介しています。日本人で頻度の高いバリアントは、まれな病気の原因である可能性は低いと考えられます。",
          videoTitle: "TogoVarを使って、日本人に特徴的な遺伝性疾患のバリアントの頻度と病原性を調べる（2026年版）",
          url: "https://togotv.dbcls.jp/20261007.html",
          youtube: "w-S0l6eZuyE",
          duration: "5:59"
        },
        {
          no: 4,
          tool: "ClinVar",
          action: "臨床的意義の登録を確かめる",
          heading: "そのバリアントの臨床的意義は、どのような根拠で登録されているか",
          story: "TogoVar には ClinVar の臨床的意義も表示されますが、その判定がどのような報告にもとづくのかは、ClinVar で確かめましょう。ClinVar は、ヒトのバリアントと疾患との関係についての情報を集め、自由に利用できるアーカイブとして NCBI が提供しているデータベースです。この動画では、疾患名や遺伝子名でバリアントを検索する方法と、Variation Viewer でゲノム上のバリアントの配置を見る方法を紹介しています。",
          videoTitle: "ClinVar を使って疾患に関連するバリアントを検索する",
          url: "https://togotv.dbcls.jp/20210405.html",
          youtube: "5Ziz0vAa8ps",
          duration: "9:21",
          outdated: true
        },
        {
          no: 5,
          tool: "UCSC Genome Browser",
          action: "自分のデータを重ねて見る",
          heading: "自分の VCF を、公共のアノテーションと同じ画面に並べる",
          story: "最後に、自分のバリアントを公共のアノテーションの中に置いて眺めます。UCSC Genome Browser では、自分のデータをカスタムトラックとして追加し、遺伝子の構造や保存性、ClinVar などの公共のトラックと並べて表示できます。この動画では、VCF 形式や WIG 形式のファイルをカスタムトラックとして追加する方法を紹介しています。変異の周りにどのような既知の情報があるかを、ゲノムの位置で確かめられます。",
          videoTitle: "UCSC Genome Browserを使ってWIG、VCFファイルをカスタムトラックとして追加する",
          url: "https://togotv.dbcls.jp/20240306.html",
          youtube: "eOQsDXTmxyc",
          duration: "10:35"
        }
      ],
      outro:
        "リードで変異を確かめる → まとめてアノテーションする → 日本人での頻度と病原性を調べる → 臨床的意義の登録を確かめる → 自分のデータを重ねて見る。自分のデータから見つけた変異は、それだけでは意味が分かりません。リードの質、遺伝子上の位置、集団での頻度、臨床的な報告という複数の情報を公共データと突き合わせてはじめて、追いかけるべき変異かどうかを判断できます。",
      extras: [
        {
          videoTitle: "Integrative Genomics Viewer (IGV) を使ってゲノムデータを可視化する",
          url: "https://togotv.dbcls.jp/20240704.html",
          duration: "11:09",
          note: "IGV のインストールや基本操作から確認したいときに。"
        },
        {
          videoTitle: "TogoVarを使って疾患に関連したバリアントの集団における頻度を調べる（2026年版）",
          url: "https://togotv.dbcls.jp/20261008.html",
          duration: "9:16",
          note: "条件を組み合わせた検索や、世界の集団との頻度の比較まで進めたいときに。"
        },
        {
          videoTitle: "Ensembl Variant Effect Predictorを使ってバリアントがタンパク質の構造や相互作用に与える影響を調べる",
          url: "https://togotv.dbcls.jp/20221107.html",
          duration: "7:02",
          note: "少数のバリアントなら、VEP をウェブ版で手軽に試せる。"
        },
        {
          videoTitle: "gnomAD v2.1.1 を使ってヒトバリアントの集団中のアレル頻度を調べる",
          url: "https://togotv.dbcls.jp/20210823.html",
          duration: "11:27",
          note: "世界の集団でのアレル頻度も確かめる。"
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
          title: "表現型と遺伝子型のデータを共有および比較する @ AJACSオンライン9",
          url: "https://togotv.dbcls.jp/20220106.html",
          thumbnail: "https://dbarchive.biosciencedbc.jp/data/togotv/movie/thumbnail/20220106_0.jpg",
          duration: "59:25",
          date: "2022-01-06"
        }
      ]
    };
  },
  head() {
    const title = "自分のデータで見つけた変異を、公共データで意味づける | 動画でワークフロー";
    const description =
      "IGV・Ensembl VEP・TogoVar・ClinVar・UCSC Genome Browser をつなぎ、自分のシーケンスデータで見つけた変異を、リードの確認から頻度・臨床的意義の調査まで公共データで意味づけるワークフローです。";
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
