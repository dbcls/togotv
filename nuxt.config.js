import axios from 'axios'
export default {
  mode: 'spa',
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s | 統合TV',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: 'favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: ['normalize.css'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [{ src: '~/plugins/infiniteloading', ssr: false }],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxt/typescript-build',
    // Doc: https://github.com/nuxt-community/stylelint-module
    '@nuxtjs/stylelint-module',
    '@nuxtjs/style-resources'
  ],
  styleResources: {
    sass: ['~/assets/sass/mixin.sass']
  },
  /*
   ** Nuxt.js modules
   */
  modules: [],
  /*
   ** Build configuration
   */
  generate: {
    dir: 'togotv',
    routes() {
      const videos = axios
        .get(`http://togotv-api.bhx.jp/api/entries?rows=10000`)
        .then(data => {
          return [...data.data.data.map(entry => entry.uploadDate.replace(/-/g, ''))]
        })
        .catch(error => {
          console.log("error", error);
        });
      
      const pictures = axios
        .get(`http://togotv-api.bhx.jp/api/entries?target=pictures&rows=10000`)
        .then(data => {
          return [...data.data.data.map(pic => pic.id.split('/').pop())]
        })
        .catch(error => {
          console.log("error", error);
        });
      
      const ajacs_list = axios
        .get(`http://togotv-api.bhx.jp/api/entries?target=ajacs-training&rows=10000`)
        .then(data => {
          return [...data.data.data.map(ajacs => ajacs.id.split('/').pop().replace(/\./g, ''))]
        })
        .catch(error => {
          console.log("error", error);
        });
      
      return Promise.all([videos, pictures, ajacs_list]).then(values => {
        return [...values[0], ...values[1], ...values[2]]
      })
    }
  },
  router: {
    base: process.env.NODE_ENV === 'dev' ? '/' : '/dbcls/togotv/'
  },
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, { isClient }) {
      if (isClient) {
        config.devtool = 'source-map'
      }
    }
  }
}
