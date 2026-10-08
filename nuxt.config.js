import axios from "axios";
import ja from "./static/json/ja.json";
import en from "./static/json/en.json";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
dotenv.config();

// 動画数・イラスト数を「前月末時点」で集計して static/json/entry_counts.json に書き出す
// (APIはスプレッドシート由来。ビルド時に実行されるので、月が替わった最初のビルドで更新される)
async function writeEntryCounts() {
  // JSTで前月末日を求める
  const nowJst = new Date(Date.now() + 9 * 60 * 60 * 1000);
  const lastMonthEnd = new Date(
    Date.UTC(nowJst.getUTCFullYear(), nowJst.getUTCMonth(), 0)
  );
  const asOf = lastMonthEnd.toISOString().slice(0, 10);
  const countUntil = (entries) =>
    entries.filter((entry) => entry.uploadDate && entry.uploadDate <= asOf)
      .length;
  try {
    const [videos, pictures] = await Promise.all([
      axios.get(`https://togotv-api.dbcls.jp/api/entries?rows=10000`),
      axios.get(
        `https://togotv-api.dbcls.jp/api/entries?target=pictures&rows=10000`
      ),
    ]);
    fs.writeFileSync(
      path.join(__dirname, "static/json/entry_counts.json"),
      JSON.stringify(
        {
          as_of: asOf,
          videos: countUntil(videos.data.data),
          pictures: countUntil(pictures.data.data),
        },
        null,
        2
      ) + "\n"
    );
  } catch (error) {
    // 取得に失敗した場合は既存のファイルをそのまま使う
    console.log("entry_counts error", error.message);
  }
}

export default {
  mode: "universal",
  /*
   ** Headers of the page
   */
  vue: {
    config: {
      productionTip: true,
      devtools: true,
    },
  },
  head: {
    htmlAttrs: {
      lang: "ja",
      prefix: "og: http://ogp.me/ns#",
    },
    titleTemplate: "%s | TogoTV",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || "",
      },
      { name: "twitter:card", content: "summary" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "favicon.ico" }],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#fff" },
  /*
   ** Global CSS
   */
  css: ["normalize.css"],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: "~/plugins/infiniteloading", ssr: false },
    { src: "~/plugins/vue-slider-component.js", ssr: false },
    { src: "~/plugins/helper.js", ssr: false },
    { src: "~/plugins/navigationMixin.js", ssr: true },
  ],
  serverMiddleware: [
    '~/server-middleware/access-counter.js',
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    "@nuxt/typescript-build",
    // Doc: https://github.com/nuxt-community/stylelint-module
    "@nuxtjs/stylelint-module",
    "@nuxtjs/style-resources",
  ],
  styleResources: {
    sass: ["~/assets/sass/mixin.sass"],
  },
  /*
   ** Nuxt.js modules
   */
  modules: [
    "@nuxtjs/pwa",
    [
      "nuxt-i18n",
      {
        locales: [
          { code: "en", iso: "en-US" },
          { code: "ja", iso: "ja-JP" },
        ],
        defaultLocale: "ja",
        baseUrl: "https://togotv.dbcls.jp",
        detectBrowserLanguage: {
          useCookie: true,
          cookieKey: 'i18n_redirected',
          fallbackLocale: 'ja',
          alwaysRedirect: false,
        },
        vueI18n: {
          fallbackLocale: "ja",
          messages: {
            en: en,
            ja: ja,
          },
        },
      },
    ],
    // .env の値はクライアントJSに埋め込まれるため、公開して良いキーだけに限定する
    ["@nuxtjs/dotenv", { only: ["GOOGLE_CLIENT_ID"] }],
    "@nuxtjs/axios",
    "@nuxtjs/auth-next",
  ],
  auth: {
    redirect: {
      login: "/",
      logout: "/",
      callback: "/oauth2_callback.html",
      home: "/mypage.html",
    },
    strategies: {
      google: {
        scheme: "oauth2",
        endpoints: {
          authorization: "https://accounts.google.com/o/oauth2/auth",
          userInfo: "https://www.googleapis.com/oauth2/v3/userinfo",
          token: "https://oauth2.googleapis.com/token",
        },
        token: {
          property: "access_token",
          type: "Bearer",
        },
        user: {
          property: false, // here should be `false`, as you defined in user endpoint `propertyName`
          autoFetch: false,
        },
        scope: ["https://www.googleapis.com/auth/youtube"],
        responseType: "token id_token",
        accessType: undefined,
        codeChallengeMethod: "",
        clientId: process.env.GOOGLE_CLIENT_ID,
      },
      cookie: true,
    },
  },
  /*
   ** Build configuration
   */
  generate: {
    dir: "togotv",
    // ブロックくずしゲームは非公開: 静的生成から除外(本番に pics-blocks.html を出力しない)
    exclude: [/^\/pics-blocks/],
    async routes() {
      let generates = [];
      await axios
        .get(`https://togotv-api.dbcls.jp/api/entries?rows=10000`)
        .then((data) => {
          data.data.data.forEach((entry) => {
            generates.push(
              {
                route: entry.uploadDate.replace(/-/g, ""),
                payload: entry,
              },
              {
                route: `en/${entry.uploadDate.replace(/-/g, "")}`,
                payload: entry,
              }
            );
          });
        })
        .catch((error) => {
          console.log("error", error);
        });

      await axios
        .get(
          `https://togotv-api.dbcls.jp/api/entries?target=pictures&rows=10000`
        )
        .then((data) => {
          data.data.data.forEach((pic) => {
            generates.push(
              {
                route: pic.id.split("/").pop(),
                payload: pic,
              },
              {
                route: `en/${pic.id.split("/").pop()}`,
                payload: pic,
              }
            );
          });
        })
        .catch((error) => {
          console.log("error", error);
        });

      await axios
        .get(
          `https://togotv-api.dbcls.jp/api/entries?target=ajacs-training&rows=10000`
        )
        .then((data) => {
          data.data.data.forEach((ajacs) => {
            generates.push(
              {
                route: ajacs.id
                  .split("/")
                  .pop()
                  .replace(/\./g, ""),
                payload: ajacs,
              },
              {
                route: `en/${ajacs.id
                  .split("/")
                  .pop()
                  .replace(/\./g, "")}`,
                payload: ajacs,
              }
            );
          });
        })
        .catch((error) => {
          console.log("error", error);
        });
      generates.push({
        route: `/en/index`,
      });
      return generates;
    },
    subFolders: false,
  },
  router: {
    base: "/",
    // base: process.env.NODE_ENV === "dev" ? "/" : "/dbcls/togotv/",
    extendRoutes(routes, resolve) {
      routes.forEach((route) => {
        if (route.name === "video") {
          route.path = "/:video(\\d+)";
        } else if (route.name === "picture") {
          route.path = "/:picture(togopic\\.\\d+\\.\\d+)";
        } else if (route.name === "ajacs") {
          route.path = "/:ajacs(ajacs\\d+)";
        }
      });
const aliases = routes.map((route) => ({
        path: /\/$/.test(route.path)
          ? `${route.path}index.html`
          : `${route.path}.html`,
        alias: route.path,
        component: route.component,
      }));
      routes.push(...aliases);
      let index_component = "";
      routes.some((route) => {
        if (route.path === "/index.html") {
          index_component = route.component;
          return true;
        }
      });
      routes.push({
        path: "/",
        component: index_component,
        alias: "/en/index",
      });
    },
    build: {
      /*
       ** You can extend webpack config here
       */
      extend(config, { isClient }) {
        if (isClient) {
          config.devtool = "source-map";
        }
      },
      parallel: true,
      cache: true,
      hardSource: true,
    },
  },
  hooks: {
    build: {
      async before() {
        await writeEntryCounts();
      },
    },
    generate: {
      async extendRoutes(routes) {
        const filtered = routes.filter((page) => !/\.html$/.test(page.route));
        routes.splice(0, routes.length, ...filtered);
      },
    },
  },
};
