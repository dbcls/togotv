# static/audio

Togo Picture block-kuzushi の BGM 音源を置く場所です。

- ファイル名: `blocks_bgm.mp3`（`pages/pics-blocks.vue` の `BGM_SRC = '/audio/blocks_bgm.mp3'` を参照）
- `static/` 配下はビルド時にサイトルート直下へ配信されるため、`/audio/blocks_bgm.mp3` でアクセスできます。
- ループ再生される想定なので、**継ぎ目が自然につながる**素材が望ましいです。
- 音量はコード側で控えめ（`BGM_VOLUME = 0.2`）に絞っています。必要なら調整してください。
- ファイルが無くてもゲームはエラーにならず、無音で動作します。

別のファイル名／形式（例: `.ogg`）にしたい場合は `pages/pics-blocks.vue` の `BGM_SRC` を変更してください。
