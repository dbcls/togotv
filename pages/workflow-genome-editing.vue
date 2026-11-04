<template>
  <div class="workflow_wrapper">
    <h2 class="page_title tsukushi bold">ゲノム編集のノックアウトを、予測してから確かめる</h2>
    <p class="workflow_subtitle">ガイドRNAの候補を探し、切断後にできる変異を予測して標的を選び、実際の編集結果をシーケンスで確かめる</p>

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
        "CRISPR-Cas9 で遺伝子をノックアウトするとき、DNA を切るだけでは十分ではありません。切断された DNA が修復されるときにどのような欠失や挿入ができるかで、遺伝子の読み枠がずれて（フレームシフト）機能を失うかどうかが決まります。この修復のされ方は、切断部位の周りの配列でかなり決まっていて、ウェブツールで事前に予測できます。このワークフローでは、CRISPOR でガイド RNA の候補を探し、Microhomology-Predictor と inDelphi で切断後にできる変異を予測して、ノックアウトになりやすい標的を選びます。実験のあとは、Primer-BLAST で編集部位を挟むプライマーを設計し、CRISPResso2 でアンプリコンシーケンスの結果を解析して、予測どおりに編集できたかを確かめます。",
      steps: [
        {
          no: 1,
          tool: "CRISPOR",
          action: "ガイドRNAの候補を探す",
          heading: "標的にしたい配列から、ガイドRNAの候補を一覧にする",
          story:
            "最初に、ノックアウトしたい遺伝子のエキソンの配列から、ガイド RNA の候補を探します。CRISPOR に配列を貼り付け、生物種のゲノムと Cas タンパク質（PAM 配列）を選ぶと、PAM の位置ごとにガイド RNA の候補が並び、ゲノム上のほかの場所を切ってしまわないかを表す特異度スコアや、切断効率の予測スコアが示されます。この動画では VEGFA 遺伝子のエキソン1を例にしています。標的部位を増幅するプライマーや、オフターゲット部位を確かめるためのプライマーの候補も出力されます。",
          videoTitle: "CRISPORを使ってゲノム編集(CRISPR-Cas9)での標的サイトを検索する",
          url: "https://togotv.dbcls.jp/20210319.html",
          youtube: "DjOcTflb1VY",
          duration: "9:15",
          outdated: true
        },
        {
          no: 2,
          tool: "Microhomology-Predictor",
          action: "ノックアウトの結果を予測する",
          heading: "切断後にできる欠失を予測し、フレームシフトになりやすい標的を選ぶ",
          story:
            "Cas9 で切断された DNA は、切断末端の近くにある短い相同配列（マイクロホモロジー）どうしがくっつく MMEJ という経路で修復されることがあり、そのときにできる欠失のパターンは配列から予測できます。Microhomology-Predictor に切断部位の前後 40 塩基ずつの配列を入力すると、予測される欠失パターンと、その元になるマイクロホモロジー配列、欠失の長さが一覧になります。欠失の長さが 3 の倍数ならインフレーム、そうでなければフレームシフトです。フレームシフトになる割合を示す Out-of-frame Score は 66 以上が推奨の目安です。この動画では MYOG 遺伝子を例に、遺伝子の配列全体から標的の候補を探して比べる方法と、同じサイトの Cas-OFFinder でオフターゲットの候補を調べる方法も紹介しています。",
          videoTitle: "Microhomology-Predictorを使ってノックアウト結果を予測し、標的配列を解釈する",
          url: "https://togotv.dbcls.jp/20261029.html",
          youtube: "QZI1OI04BfM",
          duration: "10:28"
        },
        {
          no: 3,
          tool: "inDelphi",
          action: "別の予測ツールで確かめる",
          heading: "機械学習による予測も合わせて、標的を多角的に評価する",
          story:
            "予測ツールは、それぞれ得意な変異の種類が異なります。inDelphi は、Cas9 による切断のあとにできる 1 塩基の挿入と 1〜60 塩基の欠失のパターンを、実験データで学習したモデルで予測するツールです。切断部位を1つ指定して詳しく見る Single mode、配列中のすべての候補をまとめて比べる Batch mode、遺伝子名を入れてエキソン上の候補を一覧にする Gene mode があります。Microhomology-Predictor と inDelphi の両方でフレームシフトの割合が高い標的を選べば、ノックアウトの成功率を上げられます。",
          videoTitle: "inDelphiを使ってゲノム編集後の変異を予測する",
          url: "https://togotv.dbcls.jp/20211105.html",
          youtube: "cQy-WPn89dA",
          duration: "14:41",
          outdated: true
        },
        {
          no: 4,
          tool: "Primer-BLAST",
          action: "確認用のプライマーを設計する",
          heading: "編集部位を挟んで増幅する、特異的なプライマーを設計する",
          story:
            "ゲノム編集の実験をしたら、編集部位の周りを PCR で増やして配列を読み、結果を確かめます。そのためのプライマーは、目的の場所だけを増やすものでなければなりません。Primer-BLAST は、Primer3 によるプライマー設計と BLAST による特異性の確認を一度に行えるツールです。増幅する範囲を、切断部位を挟むように指定して設計しましょう。この動画では緑膿菌の gyrB 遺伝子を例に、範囲の指定から特異性の確認までを紹介しています。",
          videoTitle: "Primer-BLASTを使ってプライマーを設計する（2025年度版）",
          url: "https://togotv.dbcls.jp/20251227.html",
          youtube: "NDzDjZU9wVY",
          duration: "13:21"
        },
        {
          no: 5,
          tool: "CRISPResso2",
          action: "編集結果を解析する",
          heading: "アンプリコンシーケンスから、実際にできた変異を確かめる",
          story:
            "最後に、増幅した編集部位をシーケンスしたデータ（FASTQ）を CRISPResso2 で解析します。アンプリコン配列とガイド RNA の配列を入力すると、編集されたリードの割合、欠失・挿入の長さの分布、位置ごとの変異、実際のアレルの配列が図で示されます。この動画では、筋ジストロフィー患者由来の iPS 細胞で DYSF 遺伝子のフレームシフトを狙った例を解析しています。ステップ2・3で予測した欠失パターンと見比べれば、予測どおりに編集できたかを確かめられます。",
          videoTitle: "CRISPResso2を使ってゲノム編集結果を解析する",
          url: "https://togotv.dbcls.jp/20250319.html",
          youtube: "HiJA2vkKaXM",
          duration: "7:56"
        }
      ],
      outro:
        "候補を探す → 結果を予測する → 別のツールで確かめる → プライマーを設計する → 編集結果を解析する。ノックアウトの成否は、DNA を切れるかどうかだけでなく、切ったあとにどう修復されるかで決まります。切断部位の配列から修復のされ方を予測して標的を選び、実験のあとにはシーケンスで予測と見比べる。この往復をすることで、ゲノム編集の実験を狙いどおりに進めやすくなります。",
      extras: [
        {
          videoTitle: "CHOPCHOPを使ってゲノム編集 (CRISPR-Cas9/TALEN) での標的サイトを検索する",
          url: "https://togotv.dbcls.jp/20201119.html",
          duration: "6:30",
          note: "ノックアウトだけでなく、ノックインやノックダウン、TALEN の標的も探したいときに。"
        },
        {
          videoTitle: "PtWAVEを使ってゲノム編集ツールの活性と変異を推定する",
          url: "https://togotv.dbcls.jp/20240614.html",
          duration: "7:24",
          note: "アンプリコンシーケンスではなく、サンガーシーケンスの波形データから編集効率と変異を推定したいときに。大きな欠失も検出できます。"
        },
        {
          videoTitle: "TIDE を使ってゲノム編集で生じたIndelを解析する",
          url: "https://togotv.dbcls.jp/20210423.html",
          duration: "5:18",
          note: "サンガーシーケンスの結果から、細胞集団に生じた挿入・欠失の種類と頻度を見積もる。"
        },
        {
          videoTitle: "BE-Hiveを使ってBase editing用のガイドRNAを設計する",
          url: "https://togotv.dbcls.jp/20250108.html",
          duration: "6:39",
          note: "DNA を切らずに1塩基を書き換える Base editing を設計したいときに。"
        },
        {
          videoTitle: "PrimeDesign を使ってPrimeEditing用のガイドRNAを設計する",
          url: "https://togotv.dbcls.jp/20220217.html",
          duration: "10:32",
          note: "狙った塩基の置換や小さな挿入・欠失を正確に入れる Prime Editing を設計したいときに。"
        }
      ],
      lectures: [
        {
          title: "ウェブツールを使ってゲノム編集の標的サイトを検索する @ AJACSオンライン8",
          url: "https://togotv.dbcls.jp/20210831.html",
          thumbnail: "https://dbarchive.biosciencedbc.jp/data/togotv/movie/thumbnail/20210831_0.jpg",
          duration: "1:38:51",
          date: "2021-08-31"
        },
        {
          title: "GGGenome & CRISPRdirect：塩基配列検索およびゲノム編集のためのウェブツール @ トーゴーの日シンポジウム2019",
          url: "https://togotv.dbcls.jp/20200102.html",
          thumbnail: "https://dbarchive.biosciencedbc.jp/data/togotv/movie/thumbnail/20200102_0.jpg",
          duration: "14:58",
          date: "2020-01-02"
        },
        {
          title: "ゲノム編集とバイオDXでミライを拓く @ とっとりバイオフロンティア人材育成セミナー",
          url: "https://togotv.dbcls.jp/20230529.html",
          thumbnail: "https://dbarchive.biosciencedbc.jp/data/togotv/movie/thumbnail/20230529_0.jpg",
          duration: "24:17",
          date: "2023-05-29"
        },
        {
          title: "iPS細胞にゲノム編集する - バイオDXとヒト細胞研究 @ 「ゲノム解読から生物のプログラミング」〜教科書の外へいこう 未来の研究者へ〜",
          url: "https://togotv.dbcls.jp/20230317.html",
          thumbnail: "https://dbarchive.biosciencedbc.jp/data/togotv/movie/thumbnail/20230317_0.jpg",
          duration: "16:07",
          date: "2023-03-17"
        }
      ]
    };
  },
  head() {
    const title = "ゲノム編集のノックアウトを、予測してから確かめる | 動画でワークフロー";
    const description =
      "CRISPOR でガイド RNA の候補を探し、Microhomology-Predictor と inDelphi で切断後の変異を予測して標的を選び、Primer-BLAST と CRISPResso2 で編集結果を確かめるワークフローです。";
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
