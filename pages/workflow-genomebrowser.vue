<template>
  <div class="workflow_wrapper">
    <h2 class="page_title tsukushi bold">ゲノムブラウザを使いこなす</h2>
    <p class="workflow_subtitle">公共データを、自分の座標系に持ち込む</p>

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
        "UCSC Genome Browser は、ゲノムの可視化だけじゃなく、膨大な公共アノテーションから必要な部分だけを切り出し、自分のデータと同じ土俵に載せるための道具でもあります。このワークフローでは、可視化ツールから一歩進んで、絞り込んで取り出し、自分のデータを重ね、最後に手元のマシンで詳しく見るところまでをたどります。",
      steps: [
        {
          no: 1,
          tool: "UCSC Table Browser",
          action: "必要な領域だけ切り出す",
          heading: "眺めるブラウザから、取り出すブラウザへ",
          story:
            "最初の一歩は、画面をスクロールして眺めるのをやめることです。Table Browser を使うと、UCSC が持つ多様なアノテーショントラックに対して条件を指定し、必要な範囲・必要な項目だけを表形式で取り出せます。「この染色体領域にある遺伝子の一覧がほしい」といった要求が、数クリックで満たせるようになります",
          videoTitle: "UCSC Table Browserを使って多様なアノテーショントラックからデータを絞り込み閲覧･取得する",
          url: "https://togotv.dbcls.jp/20210707.html",
          youtube: "CFbZe7tcFTo",
          duration: "8:58",
          outdated: true
        },
        {
          no: 2,
          tool: "UCSC Table Browser",
          action: "配列ファイルとして取得する",
          heading: "座標のリストから、実際の塩基配列へ",
          story:
            "領域が決まったら、次はその中身、つまり配列そのものを取ってきます。同じ Table Browser から cDNA の配列を FASTA 形式でダウンロードできます。プライマー設計、アラインメント、その先の解析——どれも配列ファイルが手元にあってはじめて始まります。「ブラウザで見えているもの」を「解析に使えるファイル」に。",
          videoTitle: "UCSC Table Browserを使ってcDNAの配列ファイルをダウンロードする",
          url: "https://togotv.dbcls.jp/20240327.html",
          youtube: "jVEkySj01w4",
          duration: "8:38"
        },
        {
          no: 3,
          tool: "UCSC Genome Browser",
          action: "自分のデータを重ねる",
          heading: "公共データの上に、自分の結果を載せる",
          story:
            "取り出すのではなく、配列を持ち込んで使う。カスタムトラック機能を使えば、自分の WIG（シグナル強度）や VCF（バリアント）のファイルを、公共のアノテーションと同じ画面上に並べて表示することができます。「自分のピークは既知のプロモーター領域と重なっているのか」といった問いに、目で見て答えられるようになります。",
          videoTitle: "UCSC Genome Browserを使ってWIG、VCFファイルをカスタムトラックとして追加する",
          url: "https://togotv.dbcls.jp/20240306.html",
          youtube: "eOQsDXTmxyc",
          duration: "10:35"
        },
        {
          no: 4,
          tool: "UCSC LiftOver",
          action: "ゲノムのアッセンブリー情報から座標を変換する",
          heading: "つまずきポイント ― ゲノムバージョンが違うと重ならない",
          story:
            "自分のデータが hg19 で、公共データが hg38。よくある落とし穴です。座標系が違えば、同じ位置を指しているつもりでもまったく別の場所を見ていることになります。Lift Genome Annotations（LiftOver）は、あるリファレンス配列の座標を別のバージョンへ対応付ける道具です。地味ですが、これを知らないと結果が静かに間違うので、必ず押さえておきたいステップです。",
          videoTitle: "UCSC Lift Genome Annotations を使ってゲノム座標データをリファレンス配列間で対応付ける",
          url: "https://togotv.dbcls.jp/20191218.html",
          youtube: "U70HwqJ5k7k",
          duration: "6:55",
          outdated: true
        },
        {
          no: 5,
          tool: "IGV",
          action: "手元で詳細に見る",
          heading: "最後は自分のマシンで、リードの1本1本まで",
          story:
            "ウェブブラウザでは扱いにくい大きなファイルや、公開前のデータを見るときは、手元で動くビューアの出番です。Integrative Genomics Viewer (IGV) はデスクトップアプリで、BAM ファイルのリードを1本ずつ確認するような細かい検証ができます。「変異のように見えるが、実はシーケンスエラーではないか」を判断するには、この解像度が要ります。また、マイクロアレイなどの遺伝子発現データの可視化なども同時に行うことができます。",
          videoTitle: "Integrative Genomics Viewer (IGV) を使ってゲノムデータを可視化する",
          url: "https://togotv.dbcls.jp/20240704.html",
          youtube: "fdrrq6j9Y1w",
          duration: "11:09"
        }
      ],
      outro:
        "切り出す → 配列にする → 自分のデータを重ねる → 座標を揃える → 手元で精査する。ゲノムブラウザが「見るもの」から「作業台」に変わったはずです。とくにステップ4の座標変換は、間違えても画面上はそれらしく見えてしまうため、事故が起きやすい場所です。ここだけでも覚えて帰ってください。",
      extras: [
        {
          videoTitle: "Ensembl BioMart を使って必要な遺伝子機能情報、塩基配列、ID対応表を網羅的に取得する",
          url: "https://togotv.dbcls.jp/20220324.html",
          duration: "5:18",
          note: "UCSC とは別系統の取り出し口。ID対応表がほしいときに強い。"
        },
        {
          videoTitle: "UCSC Genome Browserを使ってClinVarに登録されているSNVとCNVを検索する",
          url: "https://togotv.dbcls.jp/20220323.html",
          duration: "9:15",
          note: "臨床的に意味づけされたバリアントを、ブラウザ上で確認する。"
        },
        {
          videoTitle: "UCSC Track Hubs を使って大規模な公共データをゲノムブラウザで閲覧する",
          url: "https://togotv.dbcls.jp/20191117.html",
          duration: "7:30",
          note: "カスタムトラックでは載りきらない大規模データを扱いたくなったら。"
        }
      ],
      lectures: [
        {
          title: "UCSCゲノムブラウザを活用する @ AJACSオンライン15",
          url: "https://togotv.dbcls.jp/20230207.html",
          thumbnail: "https://dbarchive.biosciencedbc.jp/data/togotv/movie/thumbnail/20230207_0.jpg",
          duration: "149:27",
          date: "2023-02-07"
        },
        {
          title: "ゲノムデータベース/ゲノムブラウザを使って配列解析と遺伝子機能解析を行う @ AJACSオンライン7",
          url: "https://togotv.dbcls.jp/20210729.html",
          thumbnail: "https://dbarchive.biosciencedbc.jp/data/togotv/movie/thumbnail/20210729_0.jpg",
          duration: "95:08",
          date: "2021-07-29"
        },
        {
          title: "ゲノム解析からはじまるバイオDX @ 一般社団法人バイオDX推進機構セミナー 「バイオDXの世界 ゲノム解析を学び、実践に生かす」",
          url: "https://togotv.dbcls.jp/20250331.html",
          thumbnail: "https://dbarchive.biosciencedbc.jp/data/togotv/movie/thumbnail/20250331_0.jpg",
          duration: "69:13",
          date: "2025-03-31"
        }
      ]
    };
  },
  head() {
    const title = "ゲノムブラウザを使いこなす | 動画でワークフロー";
    const description =
      "UCSC Table Browser でのデータ切り出しから、カスタムトラック、LiftOver による座標変換、IGV での精査までをつないだゲノムブラウザ活用ワークフローです。";
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
