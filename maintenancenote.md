# TogoTV Website Maintenance Note

TogoTV ウェブサイトの運用・保守に必要な情報をまとめたドキュメントです。

---

## 目次

1. [開発サーバーの起動](#1-開発サーバーの起動)
2. [トップページのお知らせバナー](#2-トップページのお知らせバナー)
3. [引用論文カルーセル](#3-引用論文カルーセル)
4. [Heritage Trees ページ](#4-heritage-trees-ページ)
5. [スタッフ情報の更新](#5-スタッフ情報の更新)
6. [多言語テキスト (i18n)](#6-多言語テキスト-i18n)
7. [FAQ の更新](#7-faq-の更新)
8. [年表・統計グラフの更新](#8-年表統計グラフの更新)
9. [リクエストフォーム](#9-リクエストフォーム)
10. [Google OAuth / YouTube 連携](#10-google-oauth--youtube-連携)
11. [ビルドとデプロイ](#11-ビルドとデプロイ)
12. [API エンドポイント一覧](#12-api-エンドポイント一覧)
13. [スタッフ募集セクション](#13-スタッフ募集セクション)
14. [ファイル構成の概要](#14-ファイル構成の概要)

---

## 1. 開発サーバーの起動

Node.js v16 が必要です（v18以上では `esm` モジュールの互換性エラーが発生）。

```bash
# nvm で Node 16 に切り替えて起動
source ~/.nvm/nvm.sh && nvm use 16
npm run dev
# → http://localhost:3000/
```

| コマンド | 用途 |
|---------|------|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | プロダクションビルド |
| `npm run generate` | 静的サイト生成（約10,000ルート） |
| `npm run start` | ビルド済みサイトの起動 |

---

## 2. トップページのお知らせバナー

メンテナンス告知などの一時的なお知らせを表示する機能です。**普段はコメントアウト**されています。

### 表示する手順

**Step 1**: `static/json/ja.json` のメッセージを更新

```json
"top_announcement": "お知らせ: YYYY年MM月DD日からMM月DD日まで、システムメンテナンスのため..."
```

**Step 2**: `pages/index.vue` (24〜27行目) のコメントアウトを外す

```html
<!-- 変更前 (非表示) -->
<!-- お知らせ 普段はコメントアウト
<div class="announcement" v-if="$t('top_announcement')">
  <p>{{ $t('top_announcement') }}</p>
</div> -->

<!-- 変更後 (表示) -->
<div class="announcement" v-if="$t('top_announcement')">
  <p>{{ $t('top_announcement') }}</p>
</div>
```

**Step 3**: お知らせ終了後、再度コメントアウトして非表示に戻す

---

## 3. 引用論文カルーセル

TogoTV / Togo Picture Gallery を引用・言及している論文を自動収集し、トップページにカルーセル表示する機能です。

### データソース

| ソース | 取得内容 |
|--------|---------|
| Europe PMC API | "TogoTV" / "Togo picture gallery" でテキスト検索 (計〜140件) |
| OpenCitations API v1 | TogoTV論文 (`10.1093/bib/bbr039`) の引用論文 (〜11件) |
| `static/citations/manualcurated.txt` | 手動で追加したDOIリスト |

### 手動でDOIを追加する

自動検索で漏れている論文がある場合:

**ファイル**: `static/citations/manualcurated.txt`

```
10.20517/ss.2025.107
10.xxxx/another.example
```

- **1行に1つのDOI** を記載
- DOI のみ (`10.xxxx/...`) でも URL 形式 (`https://doi.org/10.xxxx/...`) でもOK
- 書誌情報は Europe PMC API から自動取得される
- 空行は無視される

### キャッシュについて

- 取得結果は **localStorage** に `togotv_citations` キーで保存
- **7日間** 有効（自動で週1回更新）
- 即座に反映したい場合: ブラウザの DevTools → Application → Local Storage から `togotv_citations` を削除してリロード

### 関連ファイル

| ファイル | 役割 |
|---------|------|
| `components/CitationCarousel.vue` | カルーセルコンポーネント (自動スクロール付き) |
| `pages/index.vue` | トップページ (API取得ロジック含む) |
| `pages/citations.vue` | 引用論文一覧ページ (`/citations`) |
| `static/citations/manualcurated.txt` | 手動キュレーションDOIリスト |

---

## 4. Heritage Trees ページ

京都府立植物園 Heritage Trees Project x Togo Picture Gallery の特設ページです。

**現在の状態**: イラスト製作中のため、**メニューから非表示**

### 公開する手順

`components/Header.vue` のコメントアウトを外す:

```html
<!-- 変更前 (非表示) -->
<!-- Heritage Trees: イラスト製作中のため一時的に非表示
<li @click="$event.stopPropagation()" class="link img">
  <nuxt-link :to="localePath('/heritage-trees.html')">
    Heritage Trees
  </nuxt-link>
</li>
-->

<!-- 変更後 (表示) -->
<li @click="$event.stopPropagation()" class="link img">
  <nuxt-link :to="localePath('/heritage-trees.html')">
    Heritage Trees
  </nuxt-link>
</li>
```

同ファイルで、アクティブ判定にもパスを追加:

```javascript
// $route.path === '/pics.html' || の次の行に追加
$route.path === '/heritage-trees.html' ||
```

ページ本体は `pages/heritage-trees.vue` に実装済みです。

---

## 5. スタッフ情報の更新

### 表示されるスタッフ

**ファイル**: `pages/staff.vue`

| 行 | 役職 | 表示名 |
|----|------|--------|
| 6〜20 | 創始者 (Founder) | 坊農秀雄, 河野信, 小野浩雅 |
| 22〜29 | 製作・監修 (Main Editor) | 森岡勝樹 |
| 31〜41 | 運営チーム | 佐久間桂子, 箕輪真理 |

- メンバー写真: `assets/img/member/` に PNG で配置
- 表示名の i18n キー: `static/json/ja.json` の `bono`, `kono`, `ono`, `morioka`, `sakuma`, `minowa` 等

### コンテンツ制作者リスト

**ファイル**: `static/json/ja.json` → `staff_member_list` キー (70行目)

新メンバーの追加・退職メンバーの削除はこのカンマ区切りリストを編集します。

### ウェブサイト構築メンバー

**ファイル**: `static/json/ja.json` → `develop_site_member_list` キー (72行目)

---

## 6. 多言語テキスト (i18n)

### ファイル

| ファイル | 内容 |
|---------|------|
| `static/json/ja.json` | 日本語 UI テキスト (全キー) |
| `static/json/en.json` | 英語 UI テキスト |

### テキスト変更時の注意

- **必ず ja.json と en.json の両方** にキーを追加すること
- HTML タグを含むキー (`about_description`, `picture_liscense_text` 等) は、テンプレート側で `v-html` を使用している
- キー名はスネークケースで統一

### 主要なキー

| キー | 用途 | 更新頻度 |
|------|------|---------|
| `top_announcement` | トップページお知らせ (ja.jsonのみ) | 必要時 |
| `about_description` | TogoTVについてページの説明文 | 低 |
| `staff_member_list` | コンテンツ制作者一覧 | メンバー変動時 |
| `develop_site_member_list` | サイト構築者一覧 | メンバー変動時 |
| `picture_liscense_text` | ライセンス表記 | ポリシー変更時 |
| `citing_papers` | 引用論文セクションタイトル | 低 |

---

## 7. FAQ の更新

| ファイル | 内容 |
|---------|------|
| `static/json/FAQ.json` | 日本語 FAQ (Q&A形式) |
| `static/json/FAQ_en.json` | 英語 FAQ |

JSON配列形式で、各要素に `question` と `answer` フィールドがあります。

**連絡先が含まれるFAQ項目**: 連絡先メールアドレスやURLを変更する場合は、FAQ内のリンクも確認してください。

- TogoTV スタッフ連絡先: `togotv-staff@dbcls.rois.ac.jp`
- 問い合わせフォーム: `https://dbcls.rois.ac.jp/contact`

---

## 8. 年表・統計グラフの更新

### 年表データ

| ファイル | 内容 |
|---------|------|
| `static/json/history.json` | 日本語年表 (2007〜) |
| `static/json/history_en.json` | 英語年表 |

新しいマイルストーンが発生した場合、JSONの配列末尾に追加します。

### 統計グラフ画像

**ファイル**: `assets/img/` に配置

- `20230731_TogoTVYouTube_stats_Ja.png` (日本語版)
- `20230731_TogoTVYouTube_stats_En.png` (英語版)

使用箇所: `pages/welcome.vue` (64〜65行目)

画像を差し替える場合はファイル名を変更し、`welcome.vue` の `src` パスも更新すること。

---

## 9. リクエストフォーム

**ファイル**: `pages/request.vue` (5行目)

```html
<iframe src="https://docs.google.com/forms/d/15pxJHnsV_Cu8B55Xy0F3jg5S9FXupkbBqONrZsyUE7k/viewform?embedded=true" ...>
```

Google フォームのIDを変更する場合はこのURLを更新します。

---

## 10. Google OAuth / YouTube 連携

マイページ機能（YouTubeプレイリスト管理）に使用しています。

### 認証情報

**ファイル**: `.env`

```
GOOGLE_CLIENT_ID=...apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=...
```

### OAuth 設定

**ファイル**: `nuxt.config.js` (88〜119行目)

- スコープ: `https://www.googleapis.com/auth/youtube`
- コールバック: `/oauth2_callback.html`
- ログイン後リダイレクト: `/mypage.html`

認証情報の更新時は `.env` を変更し、Google Cloud Console でリダイレクトURIも確認すること。

---

## 11. ビルドとデプロイ

### 静的サイト生成

```bash
source ~/.nvm/nvm.sh && nvm use 16
npm run generate
```

- 約10,000ルートを生成 (動画・イラスト・AJACS各ページ)
- `nuxt.config.js` の `generate.routes()` (125〜199行目) で togotv-api からルートを取得
- メモリ上限: `--max-old-space-size=4096` (4GB)

### サービスワーカー

`static/sw.js` は自己破壊型（古いキャッシュをクリアする目的）。変更不要。

---

## 12. API エンドポイント一覧

### togotv-api (バックエンドAPI)

ベースURL: `https://togotv-api.dbcls.jp/api/`

| エンドポイント | 用途 | 使用箇所 |
|---------------|------|---------|
| `/skillset_s` | コースデータ | index.vue |
| `/entries?rows=N` | 動画エントリ一覧 | index.vue, newvideo.vue |
| `/entries?target=pictures` | イラスト一覧 | index.vue, pics.vue |
| `/entries?target=ajacs-training` | AJACS資料一覧 | ajacs_text.vue |
| `/yt_view/weekly` | 週間視聴ランキング | index.vue |
| `/yt_view/month` | 月間視聴ランキング | rankings.vue |
| `/yt_view/year` | 年間視聴ランキング | rankings.vue |
| `/search` | 検索 | result.vue, heritage-trees.vue |
| `/bool_search` | フィルター検索 | result.vue, newvideo.vue |
| `/date/{videoId}` | 動画メタデータ | _video.vue |
| `/recommend/movies/{id}` | 関連動画 | _video.vue |
| `/facets/movies` | ファセット (絞り込み) | AsideParts.vue |

バックエンドリポジトリ: `github.com/dogrunjp/togotv2020-api` (大石さん管理)

### 外部API (引用論文機能)

| API | URL | 用途 |
|-----|-----|------|
| Europe PMC | `https://www.ebi.ac.uk/europepmc/webservices/rest/search` | 論文テキスト検索 |
| OpenCitations v1 | `https://api.opencitations.net/index/v1/citations/` | DOI引用追跡 |

---

## 13. スタッフ募集セクション

`pages/staff.vue` (48〜52行目) にコメントアウトされた募集セクションがあります。

### 募集を開始する場合

1. 48〜52行目のコメントを外す
2. 募集文面を必要に応じて更新
3. 連絡先: `togotvyoutube@dbcls.rois.ac.jp`

---

## 14. ファイル構成の概要

```
togotv_edit/
├── .env                          # Google OAuth 認証情報
├── nuxt.config.js                # メイン設定 (ルート生成, OAuth, モジュール)
├── pages/
│   ├── index.vue                 # トップページ (お知らせ, 引用論文)
│   ├── citations.vue             # 引用論文一覧ページ
│   ├── heritage-trees.vue        # Heritage Trees 特設ページ
│   ├── staff.vue                 # スタッフページ (募集セクション含む)
│   ├── welcome.vue               # TogoTVについて (年表, 統計グラフ)
│   ├── request.vue               # リクエストフォーム (Google Forms)
│   └── faq.vue                   # FAQ ページ
├── components/
│   ├── Header.vue                # ナビゲーション (Heritage Trees 表示切替)
│   ├── CitationCarousel.vue      # 引用論文カルーセル
│   └── ...
├── static/
│   ├── json/
│   │   ├── ja.json               # 日本語テキスト (お知らせ, スタッフ名)
│   │   ├── en.json               # 英語テキスト
│   │   ├── FAQ.json / FAQ_en.json
│   │   └── history.json / history_en.json
│   ├── citations/
│   │   └── manualcurated.txt     # 手動キュレーション DOI リスト
│   └── sw.js                     # サービスワーカー (変更不要)
└── assets/
    ├── img/member/               # スタッフ写真
    ├── img/icon/                 # SVG アイコン群
    └── sass/mixin.sass           # グローバル SASS 変数・ミックスイン
```
