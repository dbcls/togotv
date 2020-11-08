<template>
  <div class="download_modal_wrapper">
    <p class="modal_title tsukushi bold">{{ $t('specify_credits') }}</p>
    <div class="content_wrapper">
      <p v-html="$t('picture_liscense_text')"></p>
    </div>
    <div v-if="props.selected_video" class="btn_wrapper">
      <a class="button mont bold" :href="props.selected_video" download>{{ props.selected_video.split('/').pop() }}</a>
    </div>
    <div v-else class="btn_wrapper">
      <a class="button mont bold" target="_blank" @click="controlDownload('all')">All</a>
      <a class="button mont bold" v-if="extension_exist.png" target="_blank" @click="controlDownload('png')">png</a>
      <a class="button mont bold" v-if="extension_exist.svg" target="_blank" @click="controlDownload('svg')">svg</a>
      <a class="button mont bold" v-if="extension_exist.ai" target="_blank" @click="controlDownload('ai')">AI<span>(Adobe Illustrator)</span></a>
      <a class="button mont bold" v-if="extension_exist.obj_mtl_zip" target="_blank" @click="controlDownload('obj_mtl_zip')">obj_mtl_zip</a>
      <a class="button mont bold" v-if="extension_exist.apng" target="_blank" @click="controlDownload('apng')">apng</a>
      <a class="button mont bold" v-if="extension_exist.rotation" target="_blank" @click="controlDownload('rotation')">rotation</a>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  props: {
    props: {
      required: true
    }
  },
  mounted() {
    if(this.props.is_single_download) {
      Object.keys(this.extension_exist).forEach(extension => {
        if(this.props.selected_pic[extension] !== undefined &&
        this.props.selected_pic[extension] !== "-") {
          this.extension_exist[extension] = true
        }
      })
    } else if (!this.props.selected_video) {
      this.props.selected_pics.forEach(selected_pic => {
        Object.keys(this.extension_exist).forEach(extension => {
          if(selected_pic[extension] !== undefined && selected_pic[extension] !== "-") {
            this.extension_exist[extension] = true
          }
        })
      })
    }
  },
  data() {
    return {
      extension_exist: {
        'png': false,
        'svg': false,
        'ai': false,
        'obj_mtl_zip': false,
        'apng': false,
        'rotation': false,
      }
    }
  },
  methods: {
    controlDownload(extension) {
      if(extension === 'all') {
        let all_extensions = Object.keys(this.extension_exist)
        if(this.props.is_single_download){
          all_extensions.forEach((extension, i) => {
            if(this.extension_exist[extension]) {
              setTimeout(() => {
                this.download(this.props.selected_pic[extension])
              }, 500 * i)
            }
          })
        } else {
          all_extensions.forEach((extension, i) => {
            // setTimeout(() => {
            //   this.download(this.props.selected_pic.png, extension)
            // }, 500 * i)
            this.props.selected_pics.forEach((pic, t) => {
              setTimeout(() => {
                this.download(pic[extension])
              }, 500 * (i + t))
            })
          })
        }
      } else if(this.props.is_single_download){
        // シングルダウンロード
        this.download(this.props.selected_pic[extension])
      } else {
        // 複数ダウンロード
        this.props.selected_pics.forEach((pic, i) => {
          setTimeout(() => {
            this.download(pic[extension])
          }, 500 * i)
        })
      }
    },
    download(name) {
      if(!name) {
        return;
      }

      if (process.client) {
        let link = document.createElement('a')
        link.target = "_blank"
        link.download = name
        if(name.slice(-3) === 'png') {
          link.href = `https://dbarchive.biosciencedbc.jp/data/togo-pic/image/${name}`
        } else {
          link.href = `ftp://ftp.biosciencedbc.jp/archive/togo-pic/image/${name}`
        }
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        this.$emit('closeModal')
      }
    }
  }
})
</script>

<style lang="sass" scoped>
.download_modal_wrapper
  @include modal
  padding: 41px 70px 33px
  width: 70vw
  max-width: 980px
  background-color: $MAIN_COLOR
  border-radius: 20px
  > .modal_title
    font-size: 27px
    margin: 0 0 17px 0
    color: #ffffff
    display: flex
    align-items: center
    &:before
      width: 48px
      height: 48px
      @include icon('caution')
  > .content_wrapper
    width: 100%
    max-height: 400px
    overflow: auto
    padding: 28px 46px
    box-sizing: border-box
    background-color: rgba(255, 255, 255, .95)
    border-radius: 5px
    color: $DEEP_MAIN_COLOR
    > p
      margin: 0
      font-size: 18px
      line-height: 30px
  > .btn_wrapper
    display: flex
    justify-content: center
    align-items: center
    flex-wrap: wrap
    margin-top: 15px
    > a.button
      @include download_btn
      margin-right: 10px
      margin-top: 9px
      &:last-of-type
        margin-right: 0px
      > span
        font-weight: 400
        margin-left: 3px
</style>
