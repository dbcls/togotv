<template>
  <div class="workflow_wrapper">
    <h2 class="page_title tsukushi bold">公共RNA-seqデータを再解析する</h2>
    <p class="workflow_subtitle">他人が出したデータで、自分の仮説を確かめる</p>

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
        "自分でシーケンスを回さなくても、確かめられることはたくさんあります。公共データベースには膨大なRNA-seqデータが眠っていて、「この遺伝子はあの条件で本当に上がっているのか」といった問いなら、手元にサンプルがなくても検証できます。このワークフローは、データを探すところから、発現変動を出し、生物学的な意味づけをして、パスウェイの上に載せるまでをひと続きでたどります。プログラミング環境の構築は不要で、すべてブラウザ上のツールで完結します。",
      steps: [
        {
          no: 1,
          tool: "NCBI GEO",
          action: "使えるデータを探す",
          heading: "まず、自分の問いに答えられるデータが存在するかを確かめる",
          story:
            "解析の前に、材料を見つけるところから始めます。NCBI GEO は世界中の発現データが集まるアーカイブで、生物種・組織・処理条件などから目的のデータセットを探せます。ここで大事なのは「何が登録されているか」だけでなく「実験デザインが自分の問いに合っているか」を見極めること。対照群と処理群がきちんと揃っているか、反復数は足りているか——このステップで見る目を養っておくと、後の解析が空振りしません。",
          videoTitle: "NCBI GEO を使ってRNA-seqデータを検索する",
          url: "https://togotv.dbcls.jp/20230817.html",
          youtube: "wWiCarvrX3Y",
          duration: "8:15"
        },
        {
          no: 2,
          tool: "NCBI GEO",
          action: "データを手元に取得する",
          heading: "生データか、カウントデータか ― 目的に合う形式を選ぶ",
          story:
            "使えそうなデータセットが見つかったら、実際に取ってきます。ここで分かれ道があります。FASTQ の生データから自分で処理するのか、登録者が計算済みのカウントデータを使うのか。前者は自由度が高い代わりに計算環境が要り、後者はすぐ次のステップに進めます。このワークフローでは後者を選びますが、どちらを選ぶとその先がどうなるかを、この動画で押さえておきましょう。",
          videoTitle: "NCBI GEO を使ってRNA-seqの生データおよびカウントデータを取得する",
          url: "https://togotv.dbcls.jp/20231030.html",
          youtube: "NKziJ326WbY",
          duration: "8:59"
        },
        {
          no: 3,
          tool: "RNAseqChef",
          action: "発現変動を検出する",
          heading: "2群を比べて、動いている遺伝子を洗い出す",
          story:
            "いよいよ解析の中心です。RNAseqChef はブラウザ上で公共RNA-seqデータの発現変動解析ができるツールで、コードを書かずに2群間比較から可視化までを実行できます。ここで得られる「発現変動遺伝子リスト」が、この先すべての入力になります。統計的な閾値をどう置くかで結果は変わるので、数字を動かしながら結果がどう変わるかを見ておくと、後で結果を説明するときに強くなります。",
          videoTitle: "RNAseqChef を使って公共データベース上のRNA-seqデータに対して2群間の比較解析を行う",
          url: "https://togotv.dbcls.jp/20240226.html",
          youtube: "BI55VfH_qxQ",
          duration: "11:35"
        },
        {
          no: 4,
          tool: "ShinyGO",
          action: "遺伝子リストを解釈する",
          heading: "数百個の遺伝子リストを、意味のある言葉に変える",
          story:
            "「有意に変動した遺伝子が482個ありました」だけでは、生物学的な話になりません。エンリッチメント解析は、その遺伝子群にどんな機能カテゴリが偏って含まれているかを統計的に示してくれます。ShinyGO ならリストを貼り付けるだけで、GO やパスウェイの濃縮を図とともに返してくれます。ここで初めて「炎症応答が動いている」といった解釈が言えるようになります。",
          videoTitle: "ShinyGOを使ってエンリッチメント解析を行う",
          url: "https://togotv.dbcls.jp/20231204.html",
          youtube: "HdNOYoTKUJw",
          duration: "7:27"
        },
        {
          no: 5,
          tool: "Reactome",
          action: "パスウェイに載せる",
          heading: "結果を経路図の上に置いて、次の実験を考える",
          story:
            "最後に、自分の解析結果をパスウェイ図にマッピングします。Reactome は精緻にキュレーションされた経路データベースで、発現変動データを重ねると「経路のどこが動いていて、どこが動いていないか」が目で見て分かります。カテゴリ名の羅列だったものが、分子のつながりとして立ち上がる瞬間です。ここまで来ると、次に検証すべき分子が自然と浮かび上がってきます。",
          videoTitle: "Reactome を使ってパスウェイ情報を検索する〜解析データのマッピング〜",
          url: "https://togotv.dbcls.jp/20231110.html",
          youtube: "z_pwUeZeIdE",
          duration: "6:53"
        }
      ],
      outro:
        "探す → 取る → 変動を出す → 意味づける → 経路に載せる。この5本で、公共データ再解析のひと通りが手に入ります。同じ流れを別のデータセットで2〜3回まわすと、実験デザインの良し悪しを見抜く目がついてきます。3群以上を比べたい、別のエンリッチメント手法を試したい、というときは下の発展動画へ進んでください。",
      extras: [
        {
          videoTitle: "NCBI GEOのGEO2Rを使って公開されているRNA-seqデータを解析する",
          url: "https://togotv.dbcls.jp/20240324.html",
          duration: "8:02",
          note: "ステップ3の別ルート。GEO のサイト内で完結させたいときはこちら。"
        },
        {
          videoTitle: "RNAseqChefをDocker環境で使って公開RNA-seqデータの3群間多重比較解析を行う",
          url: "https://togotv.dbcls.jp/20240411.html",
          duration: "14:54",
          note: "2群では足りず、3群以上を多重比較したくなったら。"
        },
        {
          videoTitle: "Metascapeを使って遺伝子リストの生物学的解釈をする",
          url: "https://togotv.dbcls.jp/20240910.html",
          duration: "8:40",
          note: "ステップ4の別解。複数の遺伝子リストをまとめて比較できます。"
        },
        {
          videoTitle: "GSEA software を使ってRNA-seqデータのエンリッチメント解析を行う",
          url: "https://togotv.dbcls.jp/20240926.html",
          duration: "11:05",
          note: "閾値で切らず、発現量の順位全体を使って濃縮を評価する手法。"
        }
      ],
      lectures: [
        {
          title: "公共データベースからシングルセルRNA-seqデータを取得する @ データ解析講習会：AJACS「シングルセルRNA-seqを知って・学んで・使う」",
          url: "https://togotv.dbcls.jp/20250131.html",
          thumbnail: "https://dbarchive.biosciencedbc.jp/data/togotv/movie/thumbnail/20250131_0.jpg",
          duration: "29:18",
          date: "2025-01-31"
        },
        {
          title: "scRNA-seqデータを用いた細胞分類入門 @ データ解析講習会：AJACS「シングルセルRNA-seqを知って・学んで・使う」",
          url: "https://togotv.dbcls.jp/20250129.html",
          thumbnail: "https://dbarchive.biosciencedbc.jp/data/togotv/movie/thumbnail/20250129_0.jpg",
          duration: "40:54",
          date: "2025-01-29"
        },
        {
          title: "NCBI Gene Expression Omnibus（GEO）にシングルセルRNA-Seqデータを登録する @ Bio”Pack”athon2024#5",
          url: "https://togotv.dbcls.jp/20240525.html",
          thumbnail: "https://dbarchive.biosciencedbc.jp/data/togotv/movie/thumbnail/20240525_0.jpg",
          duration: "29:22",
          date: "2024-05-25"
        }
      ]
    };
  },
  head() {
    const title = "公共RNA-seqデータを再解析する | 動画でワークフロー";
    const description =
      "NCBI GEO でのデータ検索・取得から、RNAseqChef による発現変動解析、ShinyGO のエンリッチメント解析、Reactome へのマッピングまでをつないだ再解析ワークフローです。";
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
