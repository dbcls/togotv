<template>
  <div class="workflow_wrapper">
    <h2 class="page_title tsukushi bold">解析環境を整える</h2>
    <p class="workflow_subtitle">解析を始める前に、つまずかないための土台をつくる</p>

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
        "「論文に書いてあるツールを動かしてみよう」と思ったのに、インストールの時点で止まってしまう。バイオインフォマティクスを始めるとき、いちばん多い挫折はここです。多くの解析ツールは Linux 環境を前提にしていて、Windows や Mac でそのまま動くとは限りません。このワークフローは、解析そのものではなく「解析を始められる状態をつくる」ことだけに集中した5本です。ここを越えれば、他のワークフローの選択肢が一気に広がります。",
      steps: [
        {
          no: 1,
          tool: "WSL2",
          action: "Windows に Linux を用意する",
          heading: "出発点 ― Windows のまま Linux を手に入れる",
          story:
            "バイオインフォマティクスのツールの多くは Linux 前提で書かれています。かつては別マシンを用意するか仮想マシンを立てるしかありませんでしたが、いまは WSL2（Windows Subsystem for Linux 2）を使えば Windows の中に Linux 環境を同居させられます。この動画は4分ほど。まずここを通しておくと、以降「Linux でしか動かない」という理由で諦める場面がなくなります。",
          videoTitle: "WSL2(Windows Subsystem for Linux 2) を導入してWindows10(11) にLinux環境を構築する",
          url: "https://togotv.dbcls.jp/20220216.html",
          youtube: "Glj5E3oXzGc",
          duration: "4:11"
        },
        {
          no: 2,
          tool: "Docker",
          action: "環境ごと再現する",
          heading: "「自分の環境では動かない」を根本から避ける",
          story:
            "ツールを入れるたびに依存関係が衝突し、あるツールを入れたら別のツールが壊れる——これもよくある話です。Docker はツールとその動作環境をまるごと箱に閉じ込める仕組みで、この問題を構造的に解決します。作者が用意した箱をそのまま動かせるので、インストール作業自体が不要になることも多い。WSL2 と組み合わせて Python 環境をつくるところまでを扱います。",
          videoTitle: "WSL2とDocker Desktopを使ってPythonの環境構築を行う",
          url: "https://togotv.dbcls.jp/20230501.html",
          youtube: "UP9Y_5mguDc",
          duration: "8:29"
        },
        {
          no: 3,
          tool: "Anaconda",
          action: "解析ごとに環境を分ける",
          heading: "プロジェクトごとに、汚さない場所をつくる",
          story:
            "Docker ほど大掛かりでなくてよい場面もあります。Python のライブラリだけを解析ごとに分けたいなら、Anaconda の仮想環境が手軽です。「この解析には古いバージョンのライブラリが必要」という要求にも、環境を分けておけば応えられます。ステップ2の Docker と使い分けの感覚を持っておくと、無駄に重い構成を選ばずに済みます。",
          videoTitle: "Anaconda を使ってPythonの仮想環境を構築する・データ解析をする",
          url: "https://togotv.dbcls.jp/20231202.html",
          youtube: "mQiEDdr3bwA",
          duration: "6:40"
        },
        {
          no: 4,
          tool: "Git / GitHub",
          action: "コードを記録・共有する",
          heading: "「最終版_修正2_本当に最終.py」から卒業する",
          story:
            "環境が整うと、次はコードが増えていきます。Git はコードの変更履歴を記録する仕組みで、GitHub はそれを共有する場所です。いつ何を変えたかが残るので、「動いていた頃に戻す」ができるようになります。この動画では WSL2 上のリポジトリと GitHub を SSH 接続で連携させるところまでを扱います。共同研究でコードをやりとりする土台にもなります。",
          videoTitle: "ローカルマシン(WSL2: Ubuntu)のレポジトリとリモートレポジトリ(GitHub)をSSH接続で連携し管理する",
          url: "https://togotv.dbcls.jp/20221224.html",
          youtube: "V_vMgOTOoIY",
          duration: "6:36"
        },
        {
          no: 5,
          tool: "Code Ocean",
          action: "再現できる形で公開する",
          heading: "最後に ― 他人が同じ結果を出せる状態にして渡す",
          story:
            "自分の環境で動くだけでは、研究成果としては半分です。Code Ocean はコード・データ・計算環境をひとまとめにして共有・実行できるプラットフォームで、読み手がその場で再現を試せます。論文に添えれば、査読者にも読者にも「本当に動く」ことを示せます。ステップ1〜4で整えてきた環境を、外に出す出口にあたります。",
          videoTitle: "Code Ocean を使って研究の再現に必要なコード、データ、計算環境を共有、発見、実行する",
          url: "https://togotv.dbcls.jp/20211025.html",
          youtube: "H_eNPolbJOA",
          duration: "6:38",
          outdated: true
        }
      ],
      outro:
        "Linux を用意する → 環境ごと再現する → 解析ごとに分ける → 履歴を残す → 再現可能な形で出す。派手さはありませんが、ここが固まっているかどうかで、この先の解析の進み方がまったく変わります。全部で30分ほど。他のワークフローで「手元で動かす」段階が出てきたら、ここに戻ってきてください。",
      extras: [
        {
          videoTitle: "UTMを使ってApple silicon(M1/M2)のMacにLinuxの仮想環境を構築する",
          url: "https://togotv.dbcls.jp/20230302.html",
          duration: "8:48",
          note: "Mac をお使いの方は、ステップ1の代わりにこちらから。"
        },
        {
          videoTitle: "Anaconda を使ってPythonの環境構築をする 導入〜Spyder活用編",
          url: "https://togotv.dbcls.jp/20231201.html",
          duration: "7:27",
          note: "ステップ3の前編。Anaconda の導入から丁寧に追いたいときに。"
        },
        {
          videoTitle: "RStudio Cloud を使ってウェブブラウザ上でR(Studio)を利用する",
          url: "https://togotv.dbcls.jp/20210318.html",
          duration: "4:00",
          note: "R を使いたい、でも環境構築は避けたい。そんなときの逃げ道。"
        },
        {
          videoTitle: "データ解析者、ツール開発者のDocker利用シーン5選",
          url: "https://togotv.dbcls.jp/20220610.html",
          duration: "33:20",
          note: "ステップ2をもう一段深く。Docker が実際どう使われているかの実例集。"
        }
      ],
      lectures: [
        {
          title: "ワークフロー言語 Snakemakeの入門 @ Bio”Pack”athon2025#6",
          url: "https://togotv.dbcls.jp/20250717.html",
          thumbnail: "https://dbarchive.biosciencedbc.jp/data/togotv/movie/thumbnail/20250717_0.jpg",
          duration: "31:44",
          date: "2025-07-17"
        },
        {
          title: "Nix ~再現性のある環境を用意する手段の1つとしての使い方~ @ Bio”Pack”athon2025#1",
          url: "https://togotv.dbcls.jp/20250124.html",
          thumbnail: "https://dbarchive.biosciencedbc.jp/data/togotv/movie/thumbnail/20250124_0.jpg",
          duration: "56:19",
          date: "2025-01-24"
        },
        {
          title: "プログラミングにおすすめなテキストエディタの紹介 2024年6月版 @ Bio”Pack”athon2024#6",
          url: "https://togotv.dbcls.jp/20240621.html",
          thumbnail: "https://dbarchive.biosciencedbc.jp/data/togotv/movie/thumbnail/20240621_0.jpg",
          duration: "44:29",
          date: "2024-06-21"
        }
      ]
    };
  },
  head() {
    const title = "解析環境を整える | 動画でワークフロー";
    const description =
      "WSL2・Docker・Anaconda・GitHub・Code Ocean をつなぎ、バイオインフォマティクス解析を始めるための環境構築だけに絞ったワークフローです。";
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
