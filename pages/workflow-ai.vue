<template>
  <div class="workflow_wrapper">
    <h2 class="page_title tsukushi bold">研究でAIを使う環境構築と実践</h2>
    <p class="workflow_subtitle">生成AIで何ができるかを知り、AIをデータベースや手元のPCにつないで、研究の作業を任せられるようにする</p>

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
        "ChatGPT に質問するだけなら、準備はいりません。けれども、AI に生命科学のデータベースを調べさせたり、手元のコードを読み書きさせたり、毎回の決まった作業を覚えさせたりするには、AI を使う環境を整える必要があります。このワークフローでは、まず科学研究での AI 活用の全体像をつかみ、次に ChatGPT を TogoMCP につないでデータベースを横断検索できるようにします。続いて、ターミナルで動く AI エージェントを手元の PC に入れ、作業手順を Skills として覚えさせ、さらに研究用の AI エージェントを自分で組み立てるところまで進みます。最後に、AI を使った研究を論文にするときに、各雑誌がどのようなルールを定めているかを確認します。",
      steps: [
        {
          no: 1,
          tool: "生成AI（講演）",
          action: "全体像をつかむ",
          heading: "生成AIは、科学研究のどこで使われはじめているのか",
          story:
            "最初に、科学研究における AI 活用の全体像をつかみます。この講演では、AI for Science と AI Scientist という言葉の整理から、科学研究の理解・発見・論文執筆・査読といった AI 活用の分野、AI に研究を進めさせる国内外の取り組み、OpenAI や Anthropic が生命科学向けに打ち出しているサービスまでを、10分ほどで紹介しています。このあと出てくる「AI エージェント」という言葉も、ここで登場します。",
          videoTitle: "生成AIが変える科学研究の最前線 @ データ解析講習会：AJACS「科学研究を加速させる ChatGPT 等の生成 AI ツールを知って・学んで・使う」",
          url: "https://togotv.dbcls.jp/20251219.html",
          youtube: "oeOShj3RxG8",
          duration: "9:29"
        },
        {
          no: 2,
          tool: "TogoMCP",
          action: "AIをデータベースにつなぐ",
          heading: "ChatGPT から、生命科学のデータベースを使えるようにする",
          story:
            "ChatGPT は、そのままでは生命科学のデータベースを直接調べられません。TogoMCP は、AI と UniProt や PubMed などのデータベースをつなぐ MCP サーバーです。この動画では、ChatGPT の設定で Developer mode を有効にし、TogoMCP の MCP サーバー URL を登録して、チャットから呼び出せるようにするまでの手順を紹介しています。TogoMCP は Claude Desktop や Gemini CLI からも使えます。",
          videoTitle: "ChatGPT + TogoMCP で生命科学データをデータベース横断的に検索する (セットアップ編)",
          url: "https://togotv.dbcls.jp/20260421.html",
          youtube: "mfL_CPl1Zjs",
          duration: "6:44"
        },
        {
          no: 3,
          tool: "TogoMCP",
          action: "データベースを横断して調べる",
          heading: "遺伝子の情報を、AIにデータベース横断でまとめさせる",
          story:
            "つないだら、実際に調べてみます。この動画では、MYC 遺伝子についてレポートを作らせ、さらに「どのデータベースのどのエントリーから引いたか」も出すようにプロンプトを改良します。出典の ID が出ていれば、AI の答えを自分で確かめられます。non-coding RNA の XIST の例では、AI がタンパク質のデータベースを使わず、ほかのデータベースから情報を集めてくることも分かります。",
          videoTitle: "ChatGPT + TogoMCP で生命科学データをデータベース横断的に検索する (実行編)",
          url: "https://togotv.dbcls.jp/20260502.html",
          youtube: "Cj1fUCNpk9E",
          duration: "4:45"
        },
        {
          no: 4,
          tool: "GitHub Copilot CLI",
          action: "手元にAIエージェントを入れる",
          heading: "ターミナルで動くAIエージェントに、コードを読ませて書かせる",
          story:
            "チャットの画面では、手元のファイルやプログラムを AI に直接扱わせることはできません。そこで、ターミナルで動く AI エージェント（コーディングエージェント）を手元の PC に入れます。この講演では、学生なら無料で使える GitHub Copilot CLI を例に、公開されているバイオインフォマティクスのパッケージのコードを AI に調べさせ、計画を立てさせ、コード・テスト・ドキュメントまで書かせる流れを実演しています。ここでは講演部分を再生します。",
          videoTitle: "（主に学生のための）GitHub Copilot CLIの紹介",
          url: "https://togotv.dbcls.jp/20260425.html",
          youtube: "04nndpRtUzg",
          duration: "50:38",
          end: "35:40"
        },
        {
          no: 5,
          tool: "Claude Skills",
          action: "決まった作業を覚えさせる",
          heading: "毎回同じ指示をするなら、手順をSkillsとして覚えさせる",
          story:
            "AI エージェントを使っていると、同じ指示を何度も書くことになります。スクリプトにするほど決まりきってはいないけれど、毎回同じ手順で進めたい作業は、Skills にまとめておくと、AI がその手順を読んで実行してくれます。この講演では、Claude の Skills の入口になる SKILL.md の書き方、引数の渡し方、手順の一部を並列に実行させる方法、関数に決まった書式のドキュメントを付けさせる例までを紹介しています。",
          videoTitle: "スクリプトに落とせない反復作業を Claude に覚えさせる 〜Skills 入門〜",
          url: "https://togotv.dbcls.jp/20260902.html",
          youtube: "zH1WhIAZ6kk",
          duration: "20:22"
        },
        {
          no: 6,
          tool: "Google ADK",
          action: "研究用のAIエージェントを作る",
          heading: "自分の研究に合わせて、AIエージェントを組み立てる",
          story:
            "既製の AI エージェントで足りなければ、自分で作ることもできます。この講演の後半では、Google の Agent Development Kit（ADK）を使って、文献を検索するエージェントを組み立てるデモを見せています。検索先を PubMed に限定する、関数をツールとして渡すといった方法で、AI に何をどこまで任せるかを自分で決められます。ここでは講演のうち、デモの部分から再生します。前半の、研究用 AI エージェントの現状と評価の話もあわせて知りたい場合は、全編をご覧ください。",
          videoTitle: "研究特化型AIエージェントの構築と活用 @ データ解析講習会：AJACS「科学研究を加速させる ChatGPT 等の生成 AI ツールを知って・学んで・使う」",
          url: "https://togotv.dbcls.jp/20251221.html",
          youtube: "nCRjIhI-5W8",
          duration: "49:03",
          start: "30:40"
        },
        {
          no: 7,
          tool: "AIポリシー（講演）",
          action: "論文にするときのルールを知る",
          heading: "AIを使った研究を発表する前に、雑誌のルールを確かめる",
          story:
            "AI を使って得た成果を論文にするときは、投稿先の雑誌のルールに従う必要があります。この講演では、AI を使ったソフトウェア開発、論文執筆、査読について、各科学雑誌がどのようなポリシーを定めているかを紹介しています。AI を使ったことを本文のどこに書くか、どこまで AI に任せてよいかは雑誌によって異なります。ここでは講演部分を再生します。",
          videoTitle: "LLM時代における各科学雑誌のAIポリシーまとめ（2026）",
          url: "https://togotv.dbcls.jp/20260620.html",
          youtube: "MbHK_LTiUJk",
          duration: "40:38",
          end: "21:40"
        }
      ],
      outro:
        "全体像をつかむ → AI をデータベースにつなぐ → 横断して調べる → 手元に AI エージェントを入れる → 作業を覚えさせる → 自分で作る → ルールを確かめる。AI は、つなぐ先と任せる範囲を整えるほど、研究の役に立つようになります。一方で、AI の答えには誤りが混じることがあります。データベースの ID など出典を出させて自分で確かめること、AI を使ったことを正しく報告することを、どのステップでも忘れないようにしましょう。",
      extras: [
        {
          videoTitle: "今すぐ使える生成AI研究支援ツール実践 @ データ解析講習会：AJACS「科学研究を加速させる ChatGPT 等の生成 AI ツールを知って・学んで・使う」",
          url: "https://togotv.dbcls.jp/20251220.html",
          duration: "1:23:14",
          note: "プログラミングなしで、ChatGPT を文献検索・文献レビュー・英語論文の執筆に使う方法を実演で知りたいときに。"
        },
        {
          videoTitle: "研究に役立つNotebookLM",
          url: "https://togotv.dbcls.jp/20260319.html",
          duration: "36:31",
          note: "手元の論文や資料を読み込ませて、要約や整理を AI に手伝わせたいときに。"
        },
        {
          videoTitle: "GPT-OSS 120BをRooCodeで無料で使ってバイブコーディングする方法",
          url: "https://togotv.dbcls.jp/20251030.html",
          duration: "24:57",
          note: "VS Code の拡張機能で、費用をかけずに AI にコードを書かせる環境をつくりたいときに。"
        },
        {
          videoTitle: "Claude Code × GitHub Actions：新たなコーディングとワークフロー管理の形@ Bio”Pack”athon2025#7",
          url: "https://togotv.dbcls.jp/20250721.html",
          duration: "38:57",
          note: "AI エージェントにコードを書かせ、GitHub 上で解析を自動で実行させたいときに。"
        },
        {
          videoTitle: "Agent-readyなデータ解析ワークフローの構築",
          url: "https://togotv.dbcls.jp/20260928.html",
          duration: "38:29",
          note: "過去の解析ワークフロー（Snakemake）を手本に、AI エージェントに新しい解析ワークフローを作らせる事例。"
        }
      ],
      lectures: [
        {
          title: "AI関連トピックまとめ2026-スマホ連携、Claude Science、AIができないこと-",
          url: "https://togotv.dbcls.jp/20260831.html",
          thumbnail: "https://dbarchive.biosciencedbc.jp/data/togotv/movie/thumbnail/20260831_0.jpg",
          duration: "22:51",
          date: "2026-08-31"
        },
        {
          title: "Bioconductor AI Agent Skillsの紹介",
          url: "https://togotv.dbcls.jp/20260901.html",
          thumbnail: "https://dbarchive.biosciencedbc.jp/data/togotv/movie/thumbnail/20260901_0.jpg",
          duration: "20:28",
          date: "2026-09-01"
        },
        {
          title: "TogoMCP開発にみるAI-ready dataの理想と現実",
          url: "https://togotv.dbcls.jp/20261001.html",
          thumbnail: "https://dbarchive.biosciencedbc.jp/data/togotv/movie/thumbnail/20261001_aidriven4.jpg",
          duration: "33:43",
          date: "2026-10-01"
        },
        {
          title: "生命科学におけるLLMの研究活用事例まとめ / BioPackathonMCPの紹介",
          url: "https://togotv.dbcls.jp/20260318.html",
          thumbnail: "https://dbarchive.biosciencedbc.jp/data/togotv/movie/thumbnail/20260318_0.jpg",
          duration: "44:36",
          date: "2026-03-18"
        }
      ]
    };
  },
  head() {
    const title = "研究でAIを使う環境構築と実践 | 動画でワークフロー";
    const description =
      "生成AIの全体像をつかみ、ChatGPT を TogoMCP につないでデータベースを横断検索し、AI エージェントを手元に入れて作業を任せ、論文にするときのルールまでを確かめるワークフローです。";
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
