import axios from "axios";
import ja from "./static/json/ja.json";
import en from "./static/json/en.json";
import dotenv from "dotenv";
dotenv.config();

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
        locales: ["en", "ja"],
        defaultLocale: "ja",
        vueI18n: {
          fallbackLocale: "ja",
          messages: {
            en: en,
            ja: ja,
          },
        },
      },
    ],
    "@nuxtjs/dotenv",
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
    generate: {
      async extendRoutes(routes) {
        const filtered = routes.filter((page) => !/\.html$/.test(page.route));
        routes.splice(0, routes.length, ...filtered);
      },
    },
  },
};
