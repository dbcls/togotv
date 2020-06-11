<template>
  <div class="pictures_wrapper">
    <div class="facet_wrapper">
      <p class="facet_title search tsukushi bold">テキスト検索</p>
      <div class="input_wrapper">
        <input
          type="text"
          placeholder="イラストを検索"
          v-model="keyword"
          @keyup.enter="searchByText('enter')"
          @keypress="setCanMessageSubmit()"
        />
        <button @click="searchByText('click')"></button>
      </div>
      <p class="facet_title filter tsukushi bold">絞り込み検索</p>
      <div class="facet_small_section">
        <p class="facet_small_title brush tsukushi bold">
          作者
          <span
            :class="['toggle_btn', facets.author.is_open ? '' : 'close']"
            @click="facets.author.is_open = !facets.author.is_open"
          ></span>
        </p>
        <div :class="['checkbox_wrapper', facets.author.is_open ? '' : 'close']">
          <ul>
            <li v-for="(author, index) in facets.author.data" :key="index">
              <input type="checkbox" :id="author.key === '' ? '作者なし' : removeTag(author.key)" :value="author.key === '' ? '作者なし' : removeTag(author.key)" v-model="filters.author"/>
              <label :for="author.key === '' ? '作者なし' : removeTag(author.key)">
                <span class="label">{{ author.key === '' ? '作者なし' : removeTag(author.key) }}</span>
                <span class="count mont">{{ author.doc_count }}</span>
              </label>
            </li>
          </ul>
        </div>
      </div>
      <div class="facet_small_section">
        <p class="facet_small_title taxonomy tsukushi bold">
          生物分類
          <span
            :class="['toggle_btn', facets.taxon.is_open ? '' : 'close']"
            @click="facets.taxon.is_open = !facets.taxon.is_open"
          ></span>
        </p>
        <div :class="['checkbox_wrapper', 'taxon', facets.taxon.is_open ? '' : 'close']">
          <ul class="taxon_1">
            <li v-for="(taxon, index) in facets.taxon.data" :key="index">
              <!-- taxon1 -->
              <input type="checkbox" :id="taxon.key" :value="taxon.key" v-model="filters.taxon1" @click="checkTaxon('taxon1', null, null, null, taxon.taxonomy_2.buckets)"/>
              <label :for="taxon.key">
                <span class="label" v-html="taxon.key"></span>
                <span class="count mont">{{ taxon.doc_count }}</span>
                <span class="toggle_btn" v-if="hasChildren(taxon.taxonomy_2.buckets)"></span>
              </label>
              <ul class="taxon_2" v-if="hasChildren(taxon.taxonomy_2.buckets)">
                <li v-for="(taxon_2, index_2) in taxon.taxonomy_2.buckets" :key="index_2">
                  <!-- taxon2 -->
                  <input type="checkbox" :id="taxon_2.key" :value="taxon_2.key" v-model="filters.taxon2" @click="checkTaxon('taxon2', null, taxon.key, taxon.taxonomy_2.buckets, taxon_2.taxonomy_3.buckets)"/>
                  <label :for="taxon_2.key">
                    <span class="label" v-html="taxon_2.key"></span>
                    <span class="count mont">{{ taxon_2.doc_count }}</span>
                    <span class="toggle_btn" v-if="hasChildren(taxon_2.taxonomy_3.buckets)"></span>
                  </label>
                  <ul class="taxon_3" v-if="hasChildren(taxon_2.taxonomy_3.buckets)">
                    <li v-for="(taxon_3, index_3) in taxon_2.taxonomy_3.buckets" :key="index_3">
                      <!-- taxon2 -->
                      <input type="checkbox" :id="taxon_3.key" :value="taxon_3.key" v-model="filters.taxon3" @click="checkTaxon('taxon3', taxon.key, taxon_2.key, taxon_2.taxonomy_3.buckets, null, taxon_2.taxonomy_3.buckets)"/>
                      <label :for="taxon_3.key">
                        <span class="label" v-html="taxon_3.key"></span>
                        <span class="count mont">{{ taxon_3.doc_count }}</span>
                      </label>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
      <div class="facet_small_section">
        <p class="facet_small_title tag tsukushi bold">
          タグ
          <span
            :class="['toggle_btn', facets.other_tags.is_open ? '' : 'close']"
            @click="facets.other_tags.is_open = !facets.other_tags.is_open"
          ></span>
        </p>
        <div :class="['checkbox_wrapper', facets.other_tags.is_open ? '' : 'close']">
          <ul>
            <li v-for="(other_tag, index) in facets.other_tags.data" :key="index">
              <input type="checkbox" :id="other_tag.key" :value="other_tag.key" v-model="filters.other_tags"/>
              <label :for="other_tag.key">
                <span class="label" v-html="other_tag.key === '' ? '分類なし' : other_tag.key"></span>
                <span class="count mont">{{ other_tag.doc_count }}</span>
              </label>
            </li>
          </ul>
        </div>
      </div>
      <div class="facet_small_section">
        <p class="facet_small_title format tsukushi bold">形式
          <span
            :class="['toggle_btn', facets.pics.is_open ? '' : 'close']"
            @click="facets.pics.is_open = !facets.pics.is_open"
          ></span>
        </p>
        <div :class="['checkbox_wrapper', facets.pics.is_open ? '' : 'close']">
          <ul>
            <li v-for="(pic, index) in facets.pics.data" :key="index">
              <input type="checkbox" :id="pic.key" :value="pic.key" v-model="filters.pics"/>
              <label :for="pic.key">
                <span class="label" v-html="pic.key"></span>
                <span class="count mont">{{ pic.doc_count }}</span>
              </label>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="gallery_wrapper">
      <div class="gallery_section_header">
        <h2 class="page_title mont bold">Togo picture gallery</h2>
        <div class="control_wrapper">
          <button
            :class="['control_btn', 'download']"
            @click="toggleEditMode()"
            v-html="is_edit_on ? '終了' : '選択'"
          ></button>
          <button
            v-if="is_edit_on"
            @click="downloadSelectedImages"
            :class="['control_btn', 'download', selected_pics.length === 0 ? 'off' : '']"
          >ダウンロード</button>
          <ul class="display_icon_wrapper">
            <li>
              <img
                v-if="$store.state.display === 'card'"
                @click="toggleDisplay"
                src="~/assets/img/icon/icon_list_off.svg"
                alt="リスト表示"
              />
              <img
                v-if="$store.state.display === 'list'"
                src="~/assets/img/icon/icon_list.svg"
                alt="リスト表示"
              />
            </li>
            <li>
              <img
                v-if="$store.state.display === 'list'"
                @click="toggleDisplay"
                src="~/assets/img/icon/icon_card_off.svg"
                alt="カード表示"
              />
              <img
                v-if="$store.state.display === 'card'"
                src="~/assets/img/icon/icon_card.svg"
                alt="カード表示"
              />
            </li>
          </ul>
        </div>
      </div>
      <ul v-if="$store.state.display === 'card'" class="picture_list_card">
        <li class="single_picture" v-for="picture in pictures" :key="picture.TOGOTV_Image_ID">
          <a
            @click="is_edit_on ? selectPic(picture.TogoTV_Image_ID, picture.original_png, $event) : moveDetailPage({name: 'picture', query: {id: picture.TogoTV_Image_ID}})"
            :class="checkIfSelected(picture.TogoTV_Image_ID)"
          >
            <span
              @click="selectPic(picture.TogoTV_Image_ID, picture.original_png, $event)"
              v-if="is_edit_on"
              class="check_btn"
            ></span>
            <img
              :src="`http://togotv.dbcls.jp/images/s/${picture.original_png}`"
              :alt="picture.name"
            />
          </a>
          <div class="description_wrapper">
            <p class="name tsukushi bold">{{ picture.name }}</p>
            <p class="name_en mont">{{ picture.name_en }}</p>
            <a
              class="button png mont bold"
              @click="setDonwnloadLink(picture.TogoTV_Image_ID, picture.original_png)"
            >png</a>
            <nuxt-link
              class="button mont bold"
              :to="{name: 'picture', query: {id: picture.TogoTV_Image_ID}}"
            >詳細をみる</nuxt-link>
          </div>
        </li>
      </ul>
      <infinite-loading v-if="$store.state.display === 'card'" ref="infiniteLoading" spinner="spiral" @infinite="infiniteHandler">
        <div slot="no-more"></div>
        <div slot="no-results"></div>
      </infinite-loading>
      <ul v-if="$store.state.display === 'list'" class="picture_list">
        <li v-for="(other_tag, index) in tags" :key="index" @click="fetchImageByTag(other_tag.key, index)" :class="other_tag.key == '' ? 'notag' : ''">
          <div v-if="other_tag.key !== ''" class="category">
            {{ other_tag.key }}
            <span
              :id="`toggle_btn_${index}`"
              :class="['toggle_btn', 'close']"
            ></span>
          </div>
          <ul :id="`picture_list_children_${index}`" class="picture_list_children">
          </ul>
        </li>
      </ul>
    </div>
    <DownloadModal
      v-if="is_modal_on"
      :props="{selected_pic: selected_pic, selected_pics: selected_pics, is_single_download: is_single_download}"
      @closeModal="closeModal"
    />
    <div v-if="is_modal_on" @click="is_modal_on = false" class="modal_back"></div>
  </div>
</template>

<script>
import Vue from 'vue'
import DownloadModal from '~/components/DownloadModal.vue'
import axios from 'axios'

export default Vue.extend({
  // async asyncData(params) {
  //   const { data } = await axios.get(
  //     `http://togotv-api.bhx.jp/api/entries?target=pictures&from=1&rows=40`
  //   )
  //   return { pictures: data.data }
  // },
  head() {
    return {
      title: 'Togo picture gallery'
    }
  },
  created() {
    Object.keys(this.facets).forEach((key) => {
      axios
        .get(`http://togotv-api.bhx.jp/api/facets/${key}?target=pictures`)
        .then(data => {
          this.facets[key].data = data.data.facets
          if(key === 'other_tags') {
            this.tags = data.data.facets
          }
        })
        .catch(error => {
          console.log('error', error)
        })
    })
  },
  components: {
    DownloadModal
  },
  data() {
    return {
      keyword: '',
      canMessageSubmit: false,
      is_modal_on: false,
      selected_pic: {
        id: '',
        png: ''
      },
      selected_pics: [],
      is_single_download: true,
      is_edit_on: false,
      current_page: 1,
      last_page: 0,
      pictures: [],
      tags: [],
      facets: {
        author: {
          checked: [],
          is_open: true
        },
        taxon: {
          checked: [],
          is_open: true
        },
        other_tags: {
          checked: [],
          is_open: true
        },
        pics: {
          checked: [],
          is_open: true
        }
      },
      filters: {
        author: [],
        taxon1: [],
        taxon2: [],
        taxon3: [],
        other_tags: [],
        pics: [],
      }
    }
  },
  watch: {
    filters: {
      handler: function (val) {

      },
      deep: true
    }
  },
  methods: {
    fetchImageByTag(tag, index) {
      let target_element = document.getElementById(`toggle_btn_${index}`)
      let classes = target_element.getAttribute('class')
      let target_element_children = document.getElementById(`picture_list_children_${index}`)
      if(classes.indexOf('close') === -1) {
        target_element.classList.add('close')
        target_element_children.classList.add('close')
      } else {
        target_element.classList.remove('close')
        target_element_children.classList.remove('close')
        if(!target_element_children.hasChildNodes()) {
          axios.get(`http://togotv-api.bhx.jp/api/search?target=pictures&other_tags=${tag}`).then(data => {
            let children_list = ''
            data.data.data.forEach(tag => {
              children_list += 
                `<li>
                  <a href="./picture?id=${tag.TogoTV_Image_ID}" onClick="event.stopPropagation()">
                    <div class="title">
                      <img src="http://togotv.dbcls.jp/images/s/${tag.original_png}"/>
                      <p>${tag.name}</p>
                    </div>
                    <p class="author">${this.removeTag(tag.author)}</p>
                  </a>
                </li>`
            })
            target_element_children.innerHTML = children_list
          })
        }
      }
    },
    checkTaxon(type, granpa, parent, siblings, children, parents) {
      let is_all_checked = true
      if(type === "taxon1") {
        // taxon1クリック時→子供の要素全てチェックor外す
        // 全てチェックが入ってるかチェック
        is_all_checked = this.checkAllChildrenChecked(children, null, 2)
        this.filters.taxon2 = this.removeArrayFromTaxonFilter('taxon2', children, 1)
        this.filters.taxon3 = this.removeArrayFromTaxonFilter('taxon3', children, 2)
        if(!is_all_checked) {
          let taxon2_array = []
          let taxon3_array = []
          children.forEach(child => {
            taxon2_array.push(child.key)
            child.taxonomy_3.buckets.forEach(taxon3 => {
              taxon3_array.push(taxon3.key)
            })
          })
          this.filters.taxon2 = this.filters.taxon2.concat(taxon2_array)
          this.filters.taxon3 = this.filters.taxon3.concat(taxon3_array)
        }
      } else if (type === "taxon2") {
        // taxon2クリック時→子供の要素全てチェックor外す、兄弟要素確認し、親の状態決める
        is_all_checked = this.checkAllChildrenChecked(children, 'taxon3', 1)

        this.filters.taxon3 = this.removeArrayFromTaxonFilter('taxon3', children, 1)

        if(!is_all_checked) {
          let taxon3_array = []
          children.forEach(child => {
            taxon3_array.push(child.key)
          })
          this.filters.taxon3 = this.filters.taxon3.concat(taxon3_array)
        }
        
        // check siblings state
        setTimeout(() => {
          let is_siblings_all_checked = true
          siblings.forEach(sibling => {
            if(siblings.key === "") {
              return
            }
            if(this.filters.taxon2.indexOf(sibling.key) === -1) {
              is_siblings_all_checked = false
            }
          })
          if(is_siblings_all_checked) {
            this.filters.taxon1.push(parent)
          } else {
            this.filters.taxon1 = this.filters.taxon1.filter(taxon => taxon !== parent)
          }
        }, 0)
      } else if (type === "taxon3") {
      // taxon3クリック時→兄弟要素確認し、親の状態決める。親の状態確認し、祖父の状態決める
        setTimeout(() => {
          // 親
          let is_siblings_all_checked = true
          siblings.forEach(sibling => {
            if(sibling.key === "") {
              return
            }
            if(this.filters.taxon3.indexOf(sibling.key) === -1) {
              is_siblings_all_checked = false
            }
          })
          if(is_siblings_all_checked) {
            this.filters.taxon2.push(parent)
          } else {
            this.filters.taxon2 = this.filters.taxon2.filter(taxon => taxon !== parent)
          }

          // 祖父
          let is_parents_all_checked = true
          parents.forEach(parent => {
            if(parent.key === "") {
              return
            }
            if(this.filters.taxon3.indexOf(parent.key) === -1) {
              is_parents_all_checked = false
            }
          })
          if(is_parents_all_checked) {
            this.filters.taxon1.push(granpa)
          } else {
            this.filters.taxon1 = this.filters.taxon1.filter(taxon => taxon !== granpa)
          }
        }, 0)
      }
    },
    checkAllChildrenChecked(array, target_filter, nest) {
      let is_all_checked = true
      if(nest === 1) {
        array.forEach(child => {
          if(this.filters[target_filter].indexOf(child.key) === -1) {
            is_all_checked = false
          }
        })
      } else if (nest === 2) {
        array.forEach(child => {
          if(this.filters.taxon2.indexOf(child.key) === -1) {
            is_all_checked = false
          }
          child.taxonomy_3.buckets.forEach(taxon3 => {
            if(this.filters.taxon3.indexOf(taxon3.key) === -1) {
              is_all_checked = false
            }
          })
        })
      }
      return is_all_checked
    },
    removeArrayFromTaxonFilter(target_filter, remove_array, nest) {
      if(nest === 1) {
        return this.filters[target_filter].filter(taxon => {
          let flag = true
          remove_array.forEach(remove_taxon => {
            if (remove_taxon.key !== "" && remove_taxon.key === taxon) {
              flag = false
            }
          })
          return flag
        })
      } else if (nest === 2) {
        return this.filters.taxon3.filter(taxon3 => {
          let flag = true
          remove_array.forEach(taxon2 => {
            taxon2.taxonomy_3.buckets.forEach(remove_taxon3 => {
              if (remove_taxon3.key !== "" && taxon3 === remove_taxon3.key) {
                flag = false
              }
            })
          })
          return flag
        })
      }
    },
    removeTag(text) {
      return text.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '')
    },
    infiniteHandler($state) {
      axios
        .get(
          `http://togotv-api.bhx.jp/api/entries?target=pictures&from=${this.current_page}&rows=40`
        )
        .then((data) => {
          this.pictures = this.pictures.concat(data.data.data)
          if (this.current_page === 1) {
            this.last_page = data.data.last_page
          }
          if (this.current_page === this.last_page) {
            $state.complete()
          } else {
            this.current_page += 1
            $state.loaded()
          }
        })
        .catch((error) => {
          console.log('error', error)
        })
    },
    setCanMessageSubmit() {
      this.canMessageSubmit = true
    },
    searchByText(type) {
      if (this.keyword === '') {
        return
      }
      if (type === 'enter') {
        if (!this.canMessageSubmit) {
          return
        }
        // this.$router.push({ name: 'result', query: { query: this.keyword } })
      } else if (type === 'click') {
        // this.$router.push({ name: 'result', query: { query: this.keyword } })
      }
    },
    toggleDisplay() {
      this.$store.commit('toggleDisplay')
    },
    setDonwnloadLink(id, png) {
      this.selected_pic['id'] = id
      this.selected_pic['png'] = png.split('.').shift()
      this.is_single_download = true
      this.is_modal_on = true
    },
    moveDetailPage(next_page) {
      this.$router.push(next_page)
    },
    selectPic(id, png, e) {
      e.stopPropagation()
      let is_already_exist = false
      this.selected_pics.forEach((pic) => {
        if (pic.id === id) {
          is_already_exist = true
        }
      })
      if (!is_already_exist) {
        this.selected_pics.push({
          id: id,
          png: png.split('.').shift()
        })
      } else {
        this.selected_pics = this.selected_pics.filter((pic) => {
          return pic.id !== id
        })
      }
    },
    checkIfSelected(id) {
      let is_already_exist = false
      this.selected_pics.forEach((pic) => {
        if (pic.id === id) {
          is_already_exist = true
        }
      })
      if (is_already_exist) {
        return 'selected'
      } else {
        return ''
      }
    },
    downloadSelectedImages() {
      this.is_single_download = false
      this.is_modal_on = true
    },
    closeModal() {
      this.is_modal_on = false
      this.is_edit_on = false
      this.selected_pics = []
    },
    toggleEditMode() {
      if (this.is_edit_on) {
        this.selected_pics = []
      }
      this.is_edit_on = !this.is_edit_on
    },
    hasChildren(array) {
      let flag = false
      array.forEach(item => {
        if(item.key !== '') {
          flag = true
        }
      })
      return flag
    }
  }
})
</script>

<style lang="sass">
.pictures_wrapper
  padding: 0 $VIEW_PADDING
  display: flex
  align-items: flex-start
  > .facet_wrapper
    @include facet
    > p.facet_title
      font-size: 18px
      display: flex
      align-items: center
      margin: 30px 0 14px
      &:before
        width: 32px
        height: 32px
      &.search
        &:before
          @include icon('search_color')
      &.filter
        &:before
          @include icon('filter')
    > .input_wrapper
      @include text_input
      > input
        width: 240px
        height: 28px
      > button
        width: 18px
        height: 18px
    > .facet_small_section
      border-bottom: 1px solid $MAIN_COLOR
      padding-bottom: 14px
      &:last-of-type
        border-bottom: none
      > .facet_small_title
        font-size: 14px
        display: flex
        align-items: center
        &:before
          width: 23px
          height: 23px
        &.brush
          &:before
            @include icon('brush')
        &.taxonomy
          &:before
            @include icon('mouse')
        &.tag
          &:before
            @include icon('tag')
        &.format
          &:before
            @include icon('img')
        > .toggle_btn
          @include toggle_arrow
      > .checkbox_wrapper
        transition: .5s
        max-height: 100vh
        &.taxon
         max-height: 400vh
        &.close
          max-height: 0
          overflow: hidden
        ul
          li
            position: relative
            > label
              > .label
                margin-left: 27px
              > .count
                font-size: 10px
                min-width: 16px
                height: 16px
                border-radius: 100px
                background-color: $MAIN_COLOR
                color: #ffffff
                padding: 0 4px
                box-sizing: border-box
                display: flex
                align-items: center
                justify-content: center
                margin-left: 4.4px
              > .toggle_btn
                @include toggle_arrow
            > input[type=checkbox]
              @include checkbox
              margin-left: 3px
          &.taxon_2,
          &.taxon_3
            margin-left: 28px
            position: relative
            &:before
              content: ""
              width: 1px
              height: 100%
              background-color: $SUB_COLOR
              position: absolute
              top: -8px
              left: -20px
            > li
              position: relative
              &:before
                content: ''
                width: 15px
                height: 1px
                background-color: $SUB_COLOR
                position: absolute
                top: 7px
                left: -20px
  > .gallery_wrapper
    width: 100%
    > .gallery_section_header
      display: flex
      justify-content: space-between
      > .page_title
        font-weight: 800
        @include page_title('img')
      > .control_wrapper
        margin-top: 22px
        display: flex
        align-items: center
        > .control_btn
          display: inline-block
          font-size: 13px
          border-radius: 100px
          border: none
          padding: 9.5px 25px
          margin-right: 15px
          white-space: nowrap
          transition: .3s
          background-color: $MAIN_COLOR
          color: #ffffff
          &.off
            color: #8e8e8e
            background: #e5e5e5
            pointer-events: none
          &:focus
            outline: none
          &:hover
            cursor: pointer
        > ul.display_icon_wrapper
          display: flex
          > li
            margin-left: 4px
            > img
              width: 27px
              &:hover
                cursor: pointer
    > ul.picture_list
      > li
        border-top: 2px solid $MAIN_COLOR
        &.notag
          border: none
        > .category
          height: 35px
          padding-left: 13px
          font-size: 14px
          font-weight: bold
          display: flex
          align-items: center
          > span.toggle_btn
            @include toggle_arrow
        &:hover
          cursor: pointer
        &:last-of-type
          border-bottom: 2px solid $MAIN_COLOR
        > ul.picture_list_children
          max-height: auto
          > li
            position: relative
            height: 35px
            padding: 0 13px
            font-size: 12px
            font-weight: bold
            > a
              color: $BLACK
              text-decoration: none
              display: flex
              align-items: center
              justify-content: space-between
              > div.title
                display: flex
                align-items: center
                > img
                  width: 30px
                  height: 30px
                  object-fit: cover
                  margin-right: 8px
            &:after
              @include dot_border_bottom
            &:first-of-type
              border-top: 1px solid $MAIN_COLOR
            &:last-of-type
              &:after
                height: 0
          &.close
            visibility: hidden
            max-height: 0
    > ul.picture_list_card
      display: flex
      flex-wrap: wrap
      margin-right: -20px
      > li.single_picture
        position: relative
        > a
          display: inline-block
          margin-right: 20px
          margin-bottom: 20px
          position: relative
          > .check_btn
            width: 22px
            height: 22px
            border-radius: 2px
            border: 2px solid $SUB_COLOR
            position: absolute
            left: 0
            top: 0
            z-index: $LAYER_2
            box-sizing: border-box
            &:hover
              cursor: pointer
          &.selected
            > .check_btn
              background-color: $SUB_COLOR
              &:after
                content: ""
                display: block
                position: absolute
                border-left: 2px solid #ffffff
                border-bottom: 2px solid #ffffff
                width: 8px
                height: 4px
                -webkit-transform: rotate(-45deg)
                transform: rotate(-45deg)
                left: 4px
                top: 5px
            > img
              &:hover
                transform: none
                filter: none
          > img
            width: 146px
            height: 146px
            object-fit: contain
            transition: .3s
            &:hover
              cursor: pointer
              transform: translate(-10px, -4px)
              filter: drop-shadow(15px 8px 0px rgba(253, 211, 101, .8))
        > .description_wrapper
          display: none
          text-align: center
          position: absolute
          z-index: $LAYER_4
          background-color: $MAIN_COLOR
          border-radius: 9px
          top: 10px
          left: 158px
          width: 238px
          color: #fff
          box-shadow: 0 3px 20px rgba(0, 0, 0, .4)
          padding: 19px 24px 28px
          box-sizing: border-box
          &:before
            content: ""
            position: absolute
            top: 22%
            left: -18px
            border: 10px solid transparent
            border-right: 10px solid $MAIN_COLOR
          > p.name
            font-size: 20px
            margin: 0
          > p.name_en
            font-size: 14px
            margin: 0 0 21px
          > a.button
            @include download_btn
        &:hover
          > .description_wrapper
            display: block
  > .modal_back
    @include modal_back
</style>
