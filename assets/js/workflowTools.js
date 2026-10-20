// 動画でワークフローで使うツールの公式サイト。
// キーはステップの tool 名、または一覧カードの tools 名（「（講演）」などの補足は除いて引く）。
// 1つのキーに複数のツールが並ぶものは { label, url } の配列で書く。
// 新しいツールを使うときは、ここに1行足せば各ワークフローページにリンクが出る。
const TOOL_LINKS = {
  // タンパク質構造
  UniProt: "https://www.uniprot.org/",
  Foldseek: "https://search.foldseek.com/",
  "AFDB Clusters": "https://cluster.foldseek.com/",
  FoldMason: "https://search.foldseek.com/foldmason",
  Folddisco: "https://search.foldseek.com/folddisco",
  "AlphaFold DB": "https://alphafold.ebi.ac.uk/",
  // RDF・データベース横断
  "UniProt SPARQL": "https://sparql.uniprot.org/",
  SPARQL: "https://sparql.uniprot.org/",
  TogoID: "https://togoid.dbcls.jp/",
  TogoDX: "https://togodx.dbcls.jp/human/",
  "TogoDX/Human": "https://togodx.dbcls.jp/human/",
  TogoMCP: "https://togomcp.rdfportal.org/",
  // 発現解析
  "NCBI GEO": "https://www.ncbi.nlm.nih.gov/geo/",
  RNAseqChef: "https://imeg-ku.shinyapps.io/RNAseqChef/",
  ShinyGO: "https://bioinformatics.sdstate.edu/go/",
  Reactome: "https://reactome.org/",
  // バリアント・疾患
  TogoVar: "https://grch38.togovar.org/",
  "PolyPhen-2": "http://genetics.bwh.harvard.edu/pph2/",
  "Ensembl VEP": "https://www.ensembl.org/Tools/VEP",
  OMIM: "https://www.omim.org/",
  "Open Targets": "https://platform.opentargets.org/",
  NanbyoData: "https://nanbyodata.jp/",
  DECIPHER: "https://www.deciphergenomics.org/",
  PubCaseFinder: "https://pubcasefinder.dbcls.jp/",
  // 論文・執筆
  "PubMed Central": "https://pmc.ncbi.nlm.nih.gov/",
  "Connected Papers": "https://www.connectedpapers.com/",
  ChatGPT: "https://chatgpt.com/",
  "Cloud LaTeX": "https://cloudlatex.io/",
  "protocols.io": "https://www.protocols.io/",
  "CC ライセンス": "https://creativecommons.jp/licenses/",
  // ゲノムブラウザ
  "UCSC Table Browser": "https://genome.ucsc.edu/cgi-bin/hgTables",
  "UCSC Genome Browser": "https://genome.ucsc.edu/",
  "UCSC LiftOver": "https://genome.ucsc.edu/cgi-bin/hgLiftOver",
  IGV: "https://igv.org/",
  // エピゲノム
  "ChIP-Atlas": "https://chip-atlas.org/",
  // パスウェイ
  WikiPathways: "https://www.wikipathways.org/",
  PathVisio: "https://pathvisio.org/",
  "Pathway Figure OCR": "https://pfocr.wikipathways.org/",
  // 分子系統解析
  "NCBI BLAST": "https://blast.ncbi.nlm.nih.gov/",
  "Clustal Omega": "https://www.ebi.ac.uk/jdispatcher/msa/clustalo",
  Jalview: "https://www.jalview.org/",
  "MAFFT / RAxML / FigTree": [
    { label: "MAFFT", url: "https://mafft.cbrc.jp/alignment/software/" },
    { label: "RAxML-NG", url: "https://github.com/amkozlov/raxml-ng" },
    { label: "FigTree", url: "http://tree.bio.ed.ac.uk/software/figtree/" }
  ],
  DoMosaics: "https://domainworld.uni-muenster.de/developing/domosaics/",
  // 解析環境
  WSL2: "https://learn.microsoft.com/ja-jp/windows/wsl/",
  Docker: "https://www.docker.com/",
  Anaconda: "https://www.anaconda.com/",
  "Git / GitHub": [
    { label: "Git", url: "https://git-scm.com/" },
    { label: "GitHub", url: "https://github.com/" }
  ],
  "Code Ocean": "https://codeocean.com/"
};

// ツール名から [{ label, url }] を返す。登録がなければ空配列。
export function toolLinks(name) {
  const key = String(name || "")
    .replace(/（.*?）/g, "")
    .trim();
  const entry = TOOL_LINKS[key];
  if (!entry) return [];
  return typeof entry === "string" ? [{ label: key, url: entry }] : entry;
}
