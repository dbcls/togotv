<template>
  <div class="workflows_wrapper">
    <h2 class="page_title tsukushi bold">{{ $t("video_workflows") }}</h2>
    <p class="corner_lead">
      統合TVの動画を、ひとつの手順としてつなぎ直したコーナーです。
      関連するツールの動画を「なぜ次にこれを使うのか」というストーリーでつないでいるので、
      教科書やワークフローのように順番にたどって学べます。
    </p>

    <!-- タグ絞り込み -->
    <div class="filter_bar">
      <div class="filter_head">
        <p class="filter_label tsukushi bold">タグで絞り込む</p>
        <button
          v-if="selectedTags.length"
          type="button"
          class="clear_button"
          @click="clearTags"
        >
          絞り込みを解除
        </button>
      </div>
      <ul class="tag_filter_list">
        <li v-for="tag in allTags" :key="tag">
          <button
            type="button"
            :class="['tag_button', { selected: isSelected(tag), is_category: isCategory(tag) }]"
            :aria-pressed="isSelected(tag) ? 'true' : 'false'"
            @click="toggleTag(tag)"
          >
            {{ tag }}<span class="tag_count mont">{{ tagCount(tag) }}</span>
          </button>
        </li>
      </ul>
      <p class="result_count mont">
        {{ filteredWorkflows.length }} / {{ workflowsWithTags.length }} 件
      </p>
    </div>

    <ul class="workflow_list">
      <li v-for="wf in filteredWorkflows" :key="wf.path" class="workflow_card">
        <nuxt-link :to="localePath(wf.path)" class="workflow_card_link">
          <p class="workflow_card_category tsukushi bold">{{ wf.category }}</p>
          <h3 class="workflow_card_title tsukushi bold">{{ wf.title }}</h3>
          <p class="workflow_card_subtitle">{{ wf.subtitle }}</p>
          <p class="workflow_card_description">{{ wf.description }}</p>
          <ul class="workflow_card_tools">
            <li v-for="tool in wf.tools" :key="tool" class="workflow_card_tool mont">{{ tool }}</li>
          </ul>
          <ul class="workflow_card_tags">
            <li
              v-for="tag in wf.displayTags"
              :key="tag"
              :class="['workflow_card_tag', { active: isSelected(tag) }]"
            >
              #{{ tag }}
            </li>
          </ul>
          <p class="workflow_card_meta mont">{{ wf.count }}本の動画</p>
        </nuxt-link>
      </li>
    </ul>

    <p v-if="!filteredWorkflows.length" class="empty_message">
      該当するワークフローがありません。
    </p>
  </div>
</template>

<script>
import Vue from "vue";

// ワークフローのカテゴリー。タグバーではこの順で先頭に並ぶ。
const CATEGORIES = [
  "タンパク質構造研究",
  "発現解析",
  "ゲノム研究",
  "AIサイエンス",
  "PaperWork",
  "研究基盤",
  "その他"
];

// ツールごとのタグ定義。
// あるツールにタグを足したいときは、ここを1行編集すれば
// そのツールを含むすべてのワークフローに反映される。
const TOOL_TAGS = {
  UniProt: ["アミノ酸配列", "タンパク質構造", "機能アノテーション"],
  Foldseek: ["タンパク質構造", "構造類似検索"],
  "AFDB Clusters": ["タンパク質構造", "構造類似検索", "AlphaFold"],
  FoldMason: ["タンパク質構造", "多重構造アライメント"],
  Folddisco: ["タンパク質構造", "モチーフ検索"],
  SPARQL: ["RDF", "SPARQL"],
  TogoID: ["ID変換", "データベース横断"],
  TogoDX: ["データベース横断"],
  TogoMCP: ["データベース横断", "AI活用"],
  // RNA-seq 再解析
  "NCBI GEO": ["発現解析", "RNA-seq", "公共データ再利用"],
  RNAseqChef: ["発現解析", "RNA-seq"],
  ShinyGO: ["発現解析", "エンリッチメント解析"],
  Reactome: ["パスウェイ"],
  // バリアント・疾患
  TogoVar: ["バリアント", "疾患情報"],
  "Ensembl VEP": ["バリアント", "タンパク質構造"],
  OMIM: ["疾患情報"],
  "Open Targets": ["疾患情報", "創薬"],
  // 論文・執筆
  "PubMed Central": ["文献検索"],
  "Connected Papers": ["文献検索", "可視化"],
  ChatGPT: ["AI活用"],
  "Cloud LaTeX": ["文章執筆"],
  "protocols.io": ["文章執筆", "再現性"],
  "CC ライセンス": ["ライセンス", "再現性"],
  // ゲノムブラウザ
  "UCSC Table Browser": ["ゲノムブラウザ", "塩基配列", "公共データ再利用"],
  "UCSC Genome Browser": ["ゲノムブラウザ", "可視化"],
  "UCSC LiftOver": ["ゲノムブラウザ", "ゲノム座標変換"],
  IGV: ["ゲノムブラウザ", "可視化"],
  // パスウェイ
  WikiPathways: ["パスウェイ", "ライセンス"],
  PathVisio: ["パスウェイ", "可視化"],
  "Pathway Figure OCR": ["パスウェイ", "文献検索"],
  // 解析環境
  WSL2: ["環境構築", "Linux"],
  Docker: ["環境構築", "再現性"],
  Anaconda: ["環境構築", "Python"],
  "Git / GitHub": ["環境構築", "コード管理"],
  "Code Ocean": ["再現性", "コード管理"],
  // 分子系統解析
  "NCBI BLAST": ["塩基配列", "アミノ酸配列", "相同性検索"],
  "Clustal Omega": ["アラインメント"],
  Jalview: ["アラインメント", "系統樹", "可視化"],
  "MAFFT / RAxML / FigTree": ["アラインメント", "系統樹"],
  DoMosaics: ["系統樹", "ドメイン構造", "可視化"]
};

export default Vue.extend({
  data() {
    return {
      selectedTags: [],
      workflows: [
        {
          path: "/workflow-structure-intro.html",
          category: "タンパク質構造研究",
          title: "配列から構造へ",
          subtitle: "はじめてのタンパク質構造比較",
          description:
            "UniProt で配列と機能を調べるところから出発し、構造検索・構造比較・モチーフ検索まで順番に体験していく入門コースです。立体構造解析の専門知識は前提としていません。",
          tools: ["UniProt", "Foldseek", "AFDB Clusters", "FoldMason", "Folddisco"],
          extraTags: ["入門"],
          count: 5
        },
        {
          path: "/workflow-structure.html",
          category: "タンパク質構造研究",
          title: "タンパク質構造の“遠縁”を追い詰める",
          subtitle: "配列では見つからない相手を、立体構造で探し出す",
          description:
            "俯瞰する → 探す → 並べる → 絞り込む。徐々に解像度を上げながら、配列相同性では見つからない遠縁のタンパク質に迫っていく実践ワークフローです。",
          tools: ["AFDB Clusters", "Foldseek", "FoldMason", "Folddisco"],
          extraTags: ["実践"],
          count: 4
        },
        {
          path: "/workflow-rdf.html",
          category: "研究基盤",
          title: "クリックの先へ",
          subtitle: "RDF／SPARQL でデータベースを横断する",
          description:
            "画面を1件ずつクリックする作業から、SPARQL でまとめて問い合わせる世界へ。UniProt の RDF を起点に、ID変換・統合俯瞰・AI活用までをつなぎます。",
          tools: ["UniProt", "SPARQL", "TogoID", "TogoDX", "TogoMCP"],
          extraTags: ["実践"],
          count: 5
        },
        {
          path: "/workflow-rnaseq.html",
          category: "発現解析",
          title: "公共RNA-seqデータを再解析する",
          subtitle: "他人が出したデータで、自分の仮説を確かめる",
          description:
            "データを探すところから、発現変動を出し、生物学的に意味づけし、パスウェイに載せるまで。プログラミング環境の構築は不要で、すべてブラウザ上のツールで完結します。",
          tools: ["NCBI GEO", "RNAseqChef", "ShinyGO", "Reactome"],
          extraTags: ["実践"],
          count: 5
        },
        {
          path: "/workflow-variant.html",
          category: "ゲノム研究",
          title: "バリアントから疾患、そして創薬へ",
          subtitle: "ひとつの塩基の違いを、意味づけて、たどっていく",
          description:
            "頻度を調べ、分子への影響を予測し、疾患との関連を確かめ、候補を絞り込み、創薬ターゲットとしての可能性まで。5つのデータベースを順に渡り歩きます。",
          tools: ["TogoVar", "Ensembl VEP", "OMIM", "TogoDX", "Open Targets"],
          extraTags: ["実践"],
          count: 5
        },
        {
          path: "/workflow-paper.html",
          category: "PaperWork",
          title: "論文を探す・読む・書く・公開する",
          subtitle: "解析をしない日にも役に立つ、研究者の道具箱",
          description:
            "論文を探し、俯瞰し、考えを整理し、原稿を書き、手法を共有し、再利用できる形で公開するまで。専門知識もプログラミングも不要、合計40分弱で通せます。",
          tools: ["PubMed Central", "Connected Papers", "ChatGPT", "Cloud LaTeX", "protocols.io", "CC ライセンス"],
          extraTags: ["入門"],
          count: 6
        },
        {
          path: "/workflow-genomebrowser.html",
          category: "ゲノム研究",
          title: "ゲノムブラウザを使いこなす",
          subtitle: "公共データを、自分の座標系に持ち込む",
          description:
            "眺めるだけで終わらせず、必要な部分を切り出し、自分のデータを重ね、座標のズレを直し、手元で精査するまで。事故が起きやすい座標変換もカバーします。",
          tools: ["UCSC Table Browser", "UCSC Genome Browser", "UCSC LiftOver", "IGV"],
          extraTags: ["実践"],
          count: 5
        },
        {
          path: "/workflow-pathway.html",
          category: "その他",
          title: "パスウェイ図を読む・描く・公開する",
          subtitle: "読む側から、描いて共有する側へ",
          description:
            "既存の図を調べ、精緻な経路データを読み、自分の解析結果を載せ、最終的には自分で描いて公開するまで。パスウェイ図との距離を段階的に縮めます。",
          tools: ["WikiPathways", "Reactome", "PathVisio", "Pathway Figure OCR"],
          extraTags: ["実践"],
          count: 5
        },
        {
          path: "/workflow-phylogeny.html",
          category: "ゲノム研究",
          title: "配列から系統樹を描く",
          subtitle: "似た配列を集めて、並べて、進化の道筋を復元する",
          description:
            "相同配列の収集、マルチプルアラインメント、目視での調整、最尤法による推定、ドメイン構造との重ね合わせまで。手順の骨格は数十年変わらない古典的な流れです。",
          tools: ["NCBI BLAST", "Clustal Omega", "Jalview", "MAFFT / RAxML / FigTree", "DoMosaics"],
          extraTags: ["実践"],
          count: 5
        },
        {
          path: "/workflow-env.html",
          category: "研究基盤",
          title: "解析環境を整える",
          subtitle: "解析を始める前に、つまずかないための土台をつくる",
          description:
            "Linux 環境の用意から、環境の再現、プロジェクトごとの分離、コードの記録、再現可能な公開まで。他のワークフローで「手元で動かす」段階に進むための前提です。",
          tools: ["WSL2", "Docker", "Anaconda", "Git / GitHub", "Code Ocean"],
          extraTags: ["入門"],
          count: 5
        }
      ]
    };
  },
  computed: {
    // 各ワークフローのタグを、カテゴリー＋含まれるツール＋個別タグから組み立てる
    workflowsWithTags() {
      return this.workflows.map(wf => {
        const tags = [];
        const add = tag => {
          if (tag && tags.indexOf(tag) === -1) tags.push(tag);
        };
        // カテゴリーもタグとして扱い、絞り込みに使えるようにする
        add(wf.category);
        wf.tools.forEach(tool => (TOOL_TAGS[tool] || []).forEach(add));
        (wf.extraTags || []).forEach(add);
        return Object.assign({}, wf, {
          tags: tags,
          // カード上はカテゴリーをバッジで見せているので #タグ 一覧からは除く
          displayTags: tags.filter(t => t !== wf.category)
        });
      });
    },
    allTags() {
      const tags = [];
      this.workflowsWithTags.forEach(wf =>
        wf.tags.forEach(tag => {
          if (tags.indexOf(tag) === -1) tags.push(tag);
        })
      );
      // カテゴリーを先頭にまとめ、その後は該当数が多い順、同数なら五十音順
      return tags.sort((a, b) => {
        const ca = CATEGORIES.indexOf(a);
        const cb = CATEGORIES.indexOf(b);
        if (ca !== -1 || cb !== -1) {
          if (ca === -1) return 1;
          if (cb === -1) return -1;
          return ca - cb;
        }
        const diff = this.tagCount(b) - this.tagCount(a);
        return diff !== 0 ? diff : a.localeCompare(b, "ja");
      });
    },
    filteredWorkflows() {
      if (!this.selectedTags.length) return this.workflowsWithTags;
      return this.workflowsWithTags.filter(wf =>
        this.selectedTags.some(tag => wf.tags.indexOf(tag) !== -1)
      );
    }
  },
  methods: {
    isSelected(tag) {
      return this.selectedTags.indexOf(tag) !== -1;
    },
    isCategory(tag) {
      return CATEGORIES.indexOf(tag) !== -1;
    },
    toggleTag(tag) {
      const i = this.selectedTags.indexOf(tag);
      if (i === -1) this.selectedTags.push(tag);
      else this.selectedTags.splice(i, 1);
    },
    clearTags() {
      this.selectedTags = [];
    },
    tagCount(tag) {
      return this.workflowsWithTags.filter(wf => wf.tags.indexOf(tag) !== -1).length;
    }
  },
  head() {
    const title = this.$t("video_workflows");
    const description =
      "統合TVの動画を手順としてつなぎ直したコーナー。関連ツールの動画をストーリーでつなぎ、教科書のように順番に学べます。";
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
.workflows_wrapper
  // 中央寄せ。max-width + margin auto は幅の基準が1か所に決まるので崩れにくい
  max-width: 1100px
  margin: 0 auto
  padding: 0 $VIEW_PADDING 80px
  box-sizing: border-box

  > .page_title
    @include page_title('relation')
    margin-left: -10px

.corner_lead
  font-size: 15px
  line-height: 1.9
  margin: 0 0 28px

// ─── タグ絞り込み ─────────────────────────────────
.filter_bar
  background-color: #f5fafa
  border-radius: 6px
  padding: 18px 20px
  margin-bottom: 28px
  box-sizing: border-box

.filter_head
  display: flex
  align-items: center
  flex-wrap: wrap
  gap: 12px
  margin-bottom: 12px

.filter_label
  font-size: 14px
  color: $DEEP_MAIN_COLOR
  margin: 0

.clear_button
  font-size: 12px
  color: $MAIN_COLOR
  background: none
  border: none
  padding: 0
  cursor: pointer
  text-decoration: underline
  &:hover
    color: $DEEP_MAIN_COLOR

.tag_filter_list
  list-style: none
  padding: 0
  margin: 0
  display: flex
  flex-wrap: wrap
  gap: 8px

.tag_button
  display: inline-flex
  align-items: center
  font-size: 12px
  line-height: 1
  color: $DEEP_MAIN_COLOR
  background-color: #ffffff
  border: 1px solid #cfe3e5
  border-radius: 100px
  padding: 7px 12px
  cursor: pointer
  transition: background-color .15s, border-color .15s, color .15s
  &:hover
    border-color: $MAIN_COLOR
  // カテゴリーはタグより一段強く見せる
  &.is_category
    border-color: $MAIN_COLOR
    font-weight: bold
  &.selected
    background-color: $MAIN_COLOR
    border-color: $MAIN_COLOR
    color: #ffffff

.tag_count
  font-size: 10px
  margin-left: 6px
  opacity: 0.7

.result_count
  font-size: 12px
  color: #777777
  margin: 12px 0 0

// ─── ワークフローカード ───────────────────────────
.workflow_list
  list-style: none
  padding: 0
  margin: 0
  display: flex
  flex-wrap: wrap
  gap: 20px

.workflow_card
  // 折り返した行で1枚だけになってもカード幅が揃うように上限を設ける
  flex: 1 1 400px
  max-width: 460px
  min-width: 0

.workflow_card_link
  display: block
  height: 100%
  box-sizing: border-box
  padding: 22px
  background-color: #ffffff
  border: 1px solid #d5e6e8
  border-radius: 6px
  text-decoration: none
  color: $BLACK
  transition: border-color .2s, box-shadow .2s
  &:hover
    border-color: $MAIN_COLOR
    box-shadow: 0 3px 12px rgba(4, 137, 152, 0.16)

.workflow_card_category
  font-size: 11px
  color: #ffffff
  background-color: $MAIN_COLOR
  display: inline-block
  padding: 4px 10px
  border-radius: 3px
  margin: 0 0 12px

.workflow_card_title
  font-size: 21px
  line-height: 1.4
  margin: 0 0 6px
  word-break: break-word

.workflow_card_subtitle
  font-size: 14px
  color: $DEEP_MAIN_COLOR
  line-height: 1.6
  margin: 0 0 12px

.workflow_card_description
  font-size: 14px
  line-height: 1.85
  color: #555555
  margin: 0 0 16px

.workflow_card_tools
  list-style: none
  padding: 0
  margin: 0 0 10px
  display: flex
  flex-wrap: wrap
  gap: 6px

.workflow_card_tool
  font-size: 11px
  color: $DEEP_MAIN_COLOR
  background-color: #eef7f8
  border-radius: 3px
  padding: 4px 8px

.workflow_card_tags
  list-style: none
  padding: 0
  margin: 0 0 12px
  display: flex
  flex-wrap: wrap
  gap: 5px 10px

.workflow_card_tag
  font-size: 11px
  color: #999999
  line-height: 1.5
  &.active
    color: $MAIN_COLOR
    font-weight: bold

.workflow_card_meta
  font-size: 12px
  color: #888888
  margin: 0

.empty_message
  font-size: 14px
  color: #777777
  margin: 24px 0 0

@media screen and (max-width: 896px)
  .workflows_wrapper
    padding: 0 $VIEW_PADDING_SP 60px

  .corner_lead
    font-size: 14px

  .filter_bar
    padding: 16px

  .workflow_card
    flex: 0 0 auto
    width: 100%
    max-width: none

  .workflow_card_title
    font-size: 19px
</style>
