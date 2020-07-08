<template>
  <div class="download_modal_wrapper">
    <p class="modal_title tsukushi bold">出典元、クレジットを必ず明記してください。</p>
    <div class="content_wrapper">
      <p>
        この画像のご利用にあたっては、
        <strong>出典元 (© 2016 DBCLS TogoTV) あるいはこのページのURLを必ず明記してください。</strong>出典の記載のみが条件で、論文の図表や発表スライド、ポスター、プレスリリース、販促資料など内容を問わず、自由にご利用いただけます。 出典元の記載箇所については、デザインの体裁を損なわない箇所・表現で構いません。論文等では、Acknowledgementや図のlegend 等にご記載いただいています。出典元表示用の画像セットも用意しておりますので、目的に応じて適宜ご自由にご利用ください。
        統合TVおよびTogoPictureGalleryをはじめとするDBCLSの活動は、どのくらい活用されたかについて主にアクセス数や引用数などで評価されており、 利用者の方の積極的なサポートがとても重要です。
      </p>
      <br>
      <p>
        この画像は、
        <a
          href="https://creativecommons.org/licenses/by/4.0/deed.ja"
          target="_blank"
        >クリエイティブ・コモンズ表示ライセンス</a>の下で利用可能です。 利用にあたっては、下記のクレジットを必ず表示してください。
        &copy;2016
        <a target="_blank" href="https://dbcls.rois.ac.jp/">DBCLS</a> TogoTV / CC-BY-4.0
        <img
          alt="Creative Commons License"
          style="border-width:0"
          src="https://mirrors.creativecommons.org/presskit/buttons/80x15/svg/by.svg"
        />
      </p>
    </div>
    <div class="btn_wrapper">
      <a class="button mont bold" target="_blank" @click="controlDownload('all')">All</a>
      <a class="button mont bold" v-if="extension_exist.original_png" target="_blank" @click="controlDownload('original_png')">png</a>
      <a class="button mont bold" v-if="extension_exist.original_svg" target="_blank" @click="controlDownload('original_svg')">svg</a>
      <a class="button mont bold" v-if="extension_exist.original_ai" target="_blank" @click="controlDownload('original_ai')">AI<span>(Adobe Illustrator)</span></a>
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
        if(this.props.selected_pic[extension] !== undefined) {
          this.extension_exist[extension] = true
        }
      })
    } else {
      this.props.selected_pics.forEach(selected_pic => {
        Object.keys(this.extension_exist).forEach(extension => {
          if(selected_pic[extension] !== undefined) {
            this.extension_exist[extension] = true
          }
        })
      })
    }
  },
  data() {
    return {
      extension_exist: {
        'original_png': false,
        'original_svg': false,
        'original_ai': false,
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
