# togotv

> An archive of tutorial videos expounding how to use biological databases and tools.

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

## API
APIの仕様についてはdogrun大石さんのレポジトリに詳細が記載されておりますので、以下をご覧ください。
[https://github.com/dogrunjp/togotv2020-api](https://github.com/dogrunjp/togotv2020-api)

##　構成
本システムの構成は以下のようになっている。
Github Actionsを使用し、masterブランチのcommitをフックに静的ファイルの書き出し・S3サーバーへのデプロイをする。
処理内容は `.github/workflows/` を参照すること。
<img width="1349" alt="TogoTV_開発環境" src="https://user-images.githubusercontent.com/31158474/164628460-f1dacf07-ac9f-4308-8810-f68d04dd6b53.png">
