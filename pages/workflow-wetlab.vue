<template>
  <div class="workflow_wrapper">
    <h2 class="page_title tsukushi bold">分子生物学実験に役に立つWEBサービスを学ぶ</h2>
    <p class="workflow_subtitle">プラスミドの入手から設計、プライマー設計、大腸菌の培地選び、手順の記録まで、実験の準備をウェブで進める</p>

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
        "遺伝子をプラスミドに組み込み、大腸菌で増やす。分子生物学の基本となるこの実験も、ベンチに向かう前の準備で結果が大きく変わります。このワークフローでは、論文で使われたプラスミドを Addgene で探して配列を手に入れ、ApE で組み込み後のプラスミドを画面上で設計します。続いて Primer-BLAST で目的の領域だけを増やすプライマーを設計し、TogoMedium で大腸菌 K-12 株に合う培地とそのレシピを調べます。最後に、実験の手順を protocols.io に記録して共有します。どのサービスも無料で、ブラウザやデスクトップアプリですぐに使えます。",
      steps: [
        {
          no: 1,
          tool: "Addgene",
          action: "プラスミドを探して配列を得る",
          heading: "論文で使われたプラスミドを探し、配列データを手に入れる",
          story:
            "Addgene は、研究者が論文で使ったプラスミドを寄託・分与する非営利の組織です。カタログからプラスミドを探すと、配列をプラスミドマップで確かめられ、GenBank 形式や FASTA 形式でダウンロードできます。GenBank 形式のファイルには、プロモーターや薬剤耐性遺伝子などの位置情報（Features）も含まれていて、次のステップの設計にそのまま使えます。分子生物学の用語を解説する学習コンテンツもあります。",
          videoTitle: "Addgeneを使って登録されているプラスミド配列を検索し取得する",
          url: "https://togotv.dbcls.jp/20240523.html",
          youtube: "ogeTWYXDOw4",
          duration: "6:50"
        },
        {
          no: 2,
          tool: "ApE",
          action: "プラスミドを設計する",
          heading: "制限酵素で切ってつないだ結果を、実験の前に画面で確かめる",
          story:
            "ApE（A plasmid Editor）は、プラスミドの配列を表示・編集できる無料のソフトウェアです。この動画では、Addgene から入手した gfasPurple 色素タンパク質の遺伝子を、pUC119 のマルチクローニングサイトに組み込みます。制限酵素（EcoR I と Pst I）を選んで切断後の断片を仮想の電気泳動で確かめ、Restriction-Ligation Assembler で断片をつなぎます。突出末端が合っているか、遺伝子がプロモーターに対して正しい向きで入るかを、試薬を使う前に確認できます。",
          videoTitle: "ApE(A plasmid Editor) を使ってプラスミドを構築(デザイン)する 制限酵素・ライゲーションアセンブリー編",
          url: "https://togotv.dbcls.jp/20240701.html",
          youtube: "BAk6LXdPptE",
          duration: "11:45"
        },
        {
          no: 3,
          tool: "Primer-BLAST",
          action: "プライマーを設計する",
          heading: "目的の領域だけを増やす、特異性の高いプライマーを設計する",
          story:
            "組み込む遺伝子を PCR で増やしたり、組み込みを確かめたりするにはプライマーが必要です。Primer-BLAST は、プライマー設計ツール Primer3 と相同性検索ツール BLAST を組み合わせたツールで、設計したプライマーが目的以外の場所を増やさないかを、生物種を指定してデータベースで確かめてくれます。この動画では、緑膿菌の gyrB 遺伝子を例に、増幅する範囲の指定、Tm 値などの条件設定、片方のプライマーが決まっている場合の設計、設計済みプライマーの特異性の確認までを紹介しています。",
          videoTitle: "Primer-BLASTを使ってプライマーを設計する（2025年度版）",
          url: "https://togotv.dbcls.jp/20251227.html",
          youtube: "NDzDjZU9wVY",
          duration: "13:21"
        },
        {
          no: 4,
          tool: "TogoMedium",
          action: "培地を調べる",
          heading: "大腸菌K-12株に合う培地と、そのレシピを調べる",
          story:
            "できたプラスミドは大腸菌に導入して増やします。TogoMedium は、微生物の培地情報を集めたデータベースです。この動画では、大腸菌 K-12 を検索し、分類の情報や、MG1655・W3110・DH10B など K-12 から派生した株の一覧を確かめます。続いて、K-12 に使われる LB 培地などのページを開き、成分と分量、pH、ほかに培養できる生物を確認します。同じ「LB」でも、Miller 処方は NaCl が 10 g/L と多いなど、レシピの違いも比べられます。",
          videoTitle: "TogoMediumの基本的な使い方: 大腸菌K-12に対応する培地を調べる",
          url: "https://togotv.dbcls.jp/20261009.html",
          youtube: "o90B5OvVzi8",
          duration: "5:51"
        },
        {
          no: 5,
          tool: "protocols.io",
          action: "手順を記録・共有する",
          heading: "実験の手順を、ほかの人が再現できる形で記録して共有する",
          story:
            "設計したプラスミド、プライマー、培地が決まったら、実験の手順を記録しておきましょう。protocols.io は、生命科学のプロトコールを作成・共有できるオープンアクセスのリポジトリです。手順をステップごとに書き、ブラウザ上でチェックしながら実験を進められます。公開したプロトコールには DOI が付くので、論文から引用することもできます。研究室のメンバーと手順をそろえたいときにも役立ちます。",
          videoTitle: "protocols.ioを使って研究プロトコールを作成/共有する",
          url: "https://togotv.dbcls.jp/20210727.html",
          youtube: "9TstPOx8kzg",
          duration: "8:35",
          outdated: true
        }
      ],
      outro:
        "プラスミドを探す → 設計する → プライマーを設計する → 培地を調べる → 手順を記録する。どのステップも、試薬や時間を使う前に、画面の上で確かめられることばかりです。組み込みの向きやプライマーの特異性、培地のレシピを事前に確認しておけば、ベンチでの失敗や手戻りを減らせます。実験が終わったら、使ったプラスミドの配列や手順を共有して、次に同じ実験をする人の準備も短くしましょう。",
      extras: [
        {
          videoTitle: "ApE(A plasmid Editor) を使ってプラスミドを構築(デザイン)する ギブソンアセンブリー編",
          url: "https://togotv.dbcls.jp/20240702.html",
          duration: "14:11",
          note: "制限酵素を使わずに、複数の断片をまとめてつなぐギブソンアセンブリーを設計したいときに。必要なプライマーも表示されます。"
        },
        {
          videoTitle: "GGGenome《ゲゲゲノム》を使って高速塩基配列検索をする 2018",
          url: "https://togotv.dbcls.jp/20181026.html",
          duration: "6:26",
          note: "プライマーなどの短い配列が、ゲノムのどこに一致するかをすばやく調べたいときに。"
        },
        {
          videoTitle: "CRISPORを使ってゲノム編集(CRISPR-Cas9)での標的サイトを検索する",
          url: "https://togotv.dbcls.jp/20210319.html",
          duration: "9:15",
          note: "プラスミドではなくゲノムを直接書き換えたいときに。ガイド RNA の候補とオフターゲットを調べる。"
        },
        {
          videoTitle: "CRISPResso2を使ってゲノム編集結果を解析する",
          url: "https://togotv.dbcls.jp/20250319.html",
          duration: "7:56",
          note: "ゲノム編集のあと、アンプリコンシーケンスの結果から編集がうまくいったかを確かめる。"
        },
        {
          videoTitle: "protocols.io を使って公開プロトコールと公開ワークスペースを活用する",
          url: "https://togotv.dbcls.jp/20210728.html",
          duration: "5:02",
          note: "ほかの研究者が公開しているプロトコールを探して、自分の実験に取り入れたいときに。"
        }
      ],
      lectures: [
        {
          title: "GGGenome & CRISPRdirect：塩基配列検索およびゲノム編集のためのウェブツール @ トーゴーの日シンポジウム2019",
          url: "https://togotv.dbcls.jp/20200102.html",
          thumbnail: "https://dbarchive.biosciencedbc.jp/data/togotv/movie/thumbnail/20200102_0.jpg",
          duration: "14:58",
          date: "2020-01-02"
        },
        {
          title: "ウェブツールを使ってゲノム編集の標的サイトを検索する @ AJACSオンライン8",
          url: "https://togotv.dbcls.jp/20210831.html",
          thumbnail: "https://dbarchive.biosciencedbc.jp/data/togotv/movie/thumbnail/20210831_0.jpg",
          duration: "1:38:51",
          date: "2021-08-31"
        },
        {
          title: "塩基配列解析およびゲノム編集のためのデータベース・ウェブツール @ AJACS番町1",
          url: "https://togotv.dbcls.jp/20180922.html",
          thumbnail: "https://dbarchive.biosciencedbc.jp/data/togotv/movie/thumbnail/20180922_0.jpg",
          duration: "1:08:24",
          date: "2018-09-22"
        }
      ]
    };
  },
  head() {
    const title = "分子生物学実験に役に立つWEBサービスを学ぶ | 動画でワークフロー";
    const description =
      "Addgene でプラスミドを探し、ApE で設計、Primer-BLAST でプライマーを設計し、TogoMedium で大腸菌 K-12 の培地を調べ、protocols.io で手順を共有するワークフローです。";
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
