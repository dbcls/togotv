<template>
  <div class="pictures_wrapper">
    <div class="facet_wrapper" v-if="$store.state.display === 'card'">
      <p class="facet_title search tsukushi bold">{{ $t("text_search") }}</p>
      <div class="input_wrapper">
        <input
          type="text"
          :placeholder="$t('search_pictures')"
          v-model="keyword"
          @keyup.enter="searchByText('enter')"
          @keypress="setCanMessageSubmit()"
        />
        <button @click="searchByText('click')"></button>
      </div>
      <p class="facet_title filter tsukushi bold">{{ $t("filter_search") }}</p>
      <p class="clear_btn" @click="clearFilter">{{ $t("clear_filter") }}</p>
      <div class="facet_small_section">
        <p class="facet_small_title tag tsukushi bold">
          {{ $t('tags') }}
          <span
            :class="['toggle_btn', facets.other_tags.is_open ? '' : 'close']"
            @click="facets.other_tags.is_open = !facets.other_tags.is_open"
          ></span>
        </p>
        <div :class="['checkbox_wrapper', facets.other_tags.is_open ? '' : 'close']">
          <ul>
            <li v-for="(other_tag, index) in facets.other_tags.data" :key="index">
              <input
                type="checkbox"
                :id="other_tag.key"
                :value="other_tag.key"
                v-model="filters.other_tags"
              />
              <label :for="other_tag.key">
                <span class="label" v-html="other_tag.key"></span>
                <span class="count mont">{{ other_tag.doc_count }}</span>
              </label>
            </li>
          </ul>
        </div>
      </div>
      <div class="facet_small_section">
        <p class="facet_small_title taxonomy tsukushi bold">
          {{ $t('taxonomy') }}
          <span
            :class="['toggle_btn', facets.taxon.is_open ? '' : 'close']"
            @click="facets.taxon.is_open = !facets.taxon.is_open"
          ></span>
        </p>
        <div :class="['checkbox_wrapper', 'taxon', facets.taxon.is_open ? '' : 'close']">
          <ul class="taxon_1">
            <li v-for="(taxon, index) in facets.taxon.data" :key="index">
              <!-- taxon1 -->
              <input
                type="checkbox"
                :id="taxon.key"
                :value="taxon.key"
                v-model="filters.taxon1"
                @click="checkTaxon('taxon1', null, null, null, taxon.taxonomy_2.buckets)"
              />
              <label :for="taxon.key">
                <span class="label" v-html="taxon.key"></span>
                <span class="count mont">{{ taxon.doc_count }}</span>
                <span
                  class="toggle_btn close"
                  @click="toggleTaxon($event)"
                  v-if="hasChildren(taxon.taxonomy_2.buckets)"
                ></span>
              </label>
              <ul class="taxon_2 close" v-if="hasChildren(taxon.taxonomy_2.buckets)">
                <li v-for="(taxon_2, index_2) in taxon.taxonomy_2.buckets" :key="index_2">
                  <!-- taxon2 -->
                  <input
                    type="checkbox"
                    :id="taxon_2.key"
                    :value="taxon_2.key"
                    v-model="filters.taxon2"
                    @click="checkTaxon('taxon2', null, taxon.key, taxon.taxonomy_2.buckets, taxon_2.taxonomy_3.buckets)"
                  />
                  <label :for="taxon_2.key">
                    <span class="label" v-html="taxon_2.key"></span>
                    <span class="count mont">{{ taxon_2.doc_count }}</span>
                    <span
                      class="toggle_btn close"
                      @click="toggleTaxon($event)"
                      v-if="hasChildren(taxon_2.taxonomy_3.buckets)"
                    ></span>
                  </label>
                  <ul class="taxon_3 close" v-if="hasChildren(taxon_2.taxonomy_3.buckets)">
                    <li v-for="(taxon_3, index_3) in taxon_2.taxonomy_3.buckets" :key="index_3">
                      <!-- taxon2 -->
                      <input
                        type="checkbox"
                        :id="taxon_3.key"
                        :value="taxon_3.key"
                        v-model="filters.taxon3"
                        @click="checkTaxon('taxon3', taxon.key, taxon_2.key, taxon_2.taxonomy_3.buckets, null, taxon_2.taxonomy_3.buckets)"
                      />
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
        <p class="facet_small_title brush tsukushi bold">
          {{ $t("author") }}
          <span
            :class="['toggle_btn', facets.author.is_open ? '' : 'close']"
            @click="facets.author.is_open = !facets.author.is_open"
          ></span>
        </p>
        <div :class="['checkbox_wrapper', facets.author.is_open ? '' : 'close']">
          <ul>
            <li v-for="(author, index) in facets.author.data" :key="index">
              <input
                type="checkbox"
                :id="removeTag(author.key)"
                :value="removeTag(author.key)"
                v-model="filters.author_str"
              />
              <label :for="removeTag(author.key)">
                <span class="label">{{ removeTag(author.key) }}</span>
                <span class="count mont">{{ author.doc_count }}</span>
              </label>
            </li>
          </ul>
        </div>
      </div>
      <div class="facet_small_section">
        <p class="facet_small_title format tsukushi bold">
          {{ $t("format") }}
          <span
            :class="['toggle_btn', facets.pics.is_open ? '' : 'close']"
            @click="facets.pics.is_open = !facets.pics.is_open"
          ></span>
        </p>
        <div :class="['checkbox_wrapper', facets.pics.is_open ? '' : 'close']">
          <ul>
            <li v-for="(pic, index) in facets.pics.data" :key="index">
              <input type="checkbox" :id="pic.key" :value="pic.key" v-model="filters.pics" />
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
            v-if="$store.state.display === 'card'"
            :class="['control_btn', 'download']"
            @click="toggleEditMode()"
            v-html="is_edit_on ? $t('finish') : $t('select')"
          ></button>
          <button
            v-if="is_edit_on"
            @click="downloadSelectedImages"
            :class="['control_btn', 'download', selected_pics.length === 0 ? 'off' : '']"
          >{{ $t('download') }}</button>
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
      <p v-if="$store.state.display === 'card' && !is_loading && pictures.length === 0">
        該当なし
      </p>
      <ul
        v-if="$store.state.display === 'card' && !is_loading && pictures.length !== 0"
        class="picture_list_card"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove"
        @mouseup="handleMouseEnd"
      >
        <li class="single_picture" v-for="picture in pictures" :key="picture.TOGOTV_Image_ID">
          <a
            :href="is_edit_on ? '#' : localePath(`/${picture.id.split('/').pop()}.html`)"
            @click="is_edit_on ? selectPic(picture, $event) : handlePictureClick($event, picture)"
            :class="checkIfSelected(picture.TogoTV_Image_ID)"
          >
            <span @click="selectPic(picture, $event)" v-if="is_edit_on" class="check_btn"></span>
            <img
              :src="`https://dbarchive.biosciencedbc.jp/data/togo-pic/image/${picture.png}`"
              :alt="picture.name"
              loading="lazy"
            />
          </a>
          <div :class="['description_wrapper', $i18n.locale]">
            <p v-if="$i18n.locale === 'ja'" class="name tsukushi bold">{{ picture.name }}</p>
            <p v-if="$i18n.locale === 'en'" :class="['name_en', 'mont', $i18n.locale === 'en' ? 'name' : '']">{{ picture.name_en }}</p>
          </div>
        </li>
      </ul>
      <div v-if="is_loading" class="loader">Loading...</div>
      <!-- ページネーション -->
      <div v-if="$store.state.display === 'card' && !is_loading && pictures.length > 0" class="pagination">
        <button @click="goToPrevPage" :disabled="current_page === 1" class="pagination_btn prev">
          ← 前へ
        </button>
        <span class="page_info">{{ current_page }} / {{ last_page }}</span>
        <button @click="goToNextPage" :disabled="current_page >= last_page" class="pagination_btn next">
          次へ →
        </button>
      </div>
      <ul v-if="$store.state.display === 'list'" class="picture_list">
        <li
          v-for="(other_tag, index) in tags"
          :key="index"
          @click="fetchImageByTag(other_tag.key, index)"
          :class="other_tag.key == '' ? 'notag' : ''"
        >
          <div v-if="other_tag.key !== ''" class="category">
            {{ other_tag.key }}
            <span :id="`toggle_btn_${index}`" :class="['toggle_btn', 'close']"></span>
          </div>
          <ul :id="`picture_list_children_${index}`" class="picture_list_children"></ul>
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
import Vue from "vue";
import DownloadModal from "~/components/DownloadModal.vue";
import axios from "axios";

export default Vue.extend({
  head() {
    return {
      title: "Togo picture gallery",
      meta: [
        { hid: 'og:title', property: 'og:title', content: 'Togo picture gallery' },
        { hid: 'og:url', property: 'og:url', content: process.client ? location.href : '' },
        { hid: 'og:image', property: 'og:image', content: 'https://raw.githubusercontent.com/dbcls/togotv/master/assets/img/icon/icon_img.svg'},
      ]
    };
  },
  created() {
    Object.keys(this.facets).forEach(key => {
      axios
        .get(`https://togotv-api.dbcls.jp/api/facets/${key}?target=pictures`)
        .then(data => {
          data.data.facets = data.data.facets.filter(facet => {
            return facet.key !== "";
          });
          this.facets[key].data = data.data.facets;
          // リスト表示の為
          if (key === "other_tags") {
            this.tags = data.data.facets;
          }
        })
        .catch(error => {
          console.log("error", error);
        });
    });
  },
  mounted() {
    // クエリパラメータから検索状態を復元
    const query = Object.assign({}, this.$route.query);

    // 復元するクエリがない場合は通常のページ表示
    if (!query.keyword && !Object.keys(this.filters).some(key => query[key])) {
      this.fetchPage(1);
      return;
    }

    // 復元フラグを立てる
    this._is_restoring = true;

    // テキスト検索の復元
    if (query.keyword) {
      this.keyword = query.keyword;
      this._is_text_search = true;
      this.filter_current_page = 1;

      // URLからクエリパラメータを削除（これ以上のループを防ぐ）
      this.$router.replace({ path: this.localePath('/pics'), query: {} });

      // 復元フラグを下ろしてからfetchPage
      this.$nextTick(() => {
        this._is_restoring = false;
        this.$nextTick(() => {
          this.fetchPage(1);
        });
      });
      return;
    }

    // フィルタ検索の復元
    let hasFilter = false;
    Object.keys(this.filters).forEach(key => {
      if (query[key]) {
        this.filters[key] = query[key].split(',');
        hasFilter = true;
      }
    });

    if (hasFilter) {
      // URLからクエリパラメータを削除（これ以上のループを防ぐ）
      this.$router.replace({ path: this.localePath('/pics'), query: {} });

      // 復元フラグを下ろしてから、パラメータを設定してリセット
      this.$nextTick(() => {
        // フィルタパラメータを準備
        let param = {};
        Object.keys(this.filters).forEach(key => {
          if (this.filters[key].length > 0) {
            param[key] = this.filters[key];
          }
        });
        this._current_filter_params = JSON.parse(JSON.stringify(param));
        this.filter_current_page = 1;
        this.filter_last_page = 0;

        this._is_restoring = false;

        this.$nextTick(() => {
          this.fetchPage(1);
        });
      });
    }
  },
  components: {
    DownloadModal
  },
  data() {
    return {
      is_loading: false,
      keyword: "",
      canMessageSubmit: false,
      is_modal_on: false,
      selected_pic: {
        id: "",
        png: ""
      },
      selected_pics: [],
      is_single_download: true,
      is_edit_on: false,
      current_page: 1,
      last_page: 0,
      filter_current_page: 1,
      filter_last_page: 0,
      filter_total_hits: 0,
      _is_text_search: false,
      _current_filter_params: null,
      _is_restoring: false,
      pictures: [],
      loaded_pictures: [],
      tags: [],
      facets: {
        other_tags: {
          checked: [],
          is_open: true
        },
        taxon: {
          checked: [],
          is_open: false
        },
        author: {
          checked: [],
          is_open: false
        },
        pics: {
          checked: [],
          is_open: false
        }
      },
      filters: {
        author_str: [],
        taxon1: [],
        taxon2: [],
        taxon3: [],
        other_tags: [],
        pics: []
      },
      swipe_start_x: null,
      swipe_current_x: null,
      is_mouse_down: false
    };
  },
  watch: {
    filters: {
      handler: function(val) {
        // 復元中はwatcherをスキップ
        if (this._is_restoring) {
          return;
        }

        setTimeout(() => {
          let param = Object.assign({}, val);
          // 空のプロパティは削除
          Object.keys(param).forEach(key => {
            param[key] = param[key].filter(data => data !== "");
            if (param[key].length === 0) {
              delete param[key];
            }
          });

          // フィルタが空かチェック（テキスト検索は別扱い）
          let has_filter = Object.keys(param).some(key => param[key].length > 0);

          if (!has_filter && !this._is_text_search) {
            // フィルターなし - 通常のページングに戻る
            this.pictures = [];
            this.filter_current_page = 1;
            this.filter_last_page = 0;
            this.filter_total_hits = 0;
            this._current_filter_params = null;
            this.fetchPage(1);
          } else if (has_filter) {
            // フィルタON（テキスト検索はクリア）
            this._is_text_search = false;
            this.pictures = [];
            this.filter_current_page = 1;
            this.filter_last_page = 0;
            // フィルタパラメータを一時保存（fetchPageで使用）
            // 配列の状態で保存（文字列変換はfetchPageで実施）
            this._current_filter_params = JSON.parse(JSON.stringify(param));
            this.fetchPage(1);
          }
        }, 0);
      },
      deep: true
    },
    keyword: function(val) {
      if (val === "") {
        this._is_text_search = false;
        this.clearFilter();
      }
    }
  },
  computed: {
    is_filter_on() {
      // テキスト検索中の場合もフィルタONとして扱う
      if (this._is_text_search) {
        return true;
      }
      let frag = false;
      Object.keys(this.filters).forEach(key => {
        if (this.filters[key].length !== 0) {
          frag = true;
        }
      });
      return frag;
    }
  },
  methods: {
    clearFilter() {
      Object.keys(this.filters).forEach(key => {
        this.filters[key] = [];
      });
      this.keyword = "";
      this._is_text_search = false;
      this._current_filter_params = null;
      this.filter_last_page = 0;
    },
    fetchImageByTag(tag, index) {
      if(process.client && document !== undefined) {
        let target_element = document.getElementById(`toggle_btn_${index}`);
        let classes = target_element.getAttribute("class");
        let target_element_children = document.getElementById(
          `picture_list_children_${index}`
        );
        if (classes.indexOf("close") === -1) {
          target_element.classList.add("close");
          target_element_children.classList.add("close");
        } else {
          target_element.classList.remove("close");
          target_element_children.classList.remove("close");
          if (!target_element_children.hasChildNodes()) {
            axios
              .get(
                `https://togotv-api.dbcls.jp/api/search?target=pictures&other_tags=${tag}`
              )
              .then(data => {
                let children_list = "";
                data.data.data.forEach(tag => {
                  children_list += `<li>
                    <a href="../${
                      tag.id.split('/').pop()
                    }.html" onClick="event.stopPropagation()">
                      <div class="title">
                        <img src="https://dbarchive.biosciencedbc.jp/data/togo-pic/image/${
                          tag.png
                        }"/>
                        <p>${tag.name}</p>
                      </div>
                      <p class="author">${this.removeTag(tag.author)}</p>
                    </a>
                  </li>`;
                });
                target_element_children.innerHTML = children_list;
              });
          }
        }
      }
    },
    checkTaxon(type, granpa, parent, siblings, children, parents) {
      let is_all_checked = true;
      if (type === "taxon1") {
        // taxon1クリック時→子供の要素全てチェックor外す
        // 全てチェックが入ってるかチェック
        is_all_checked = this.checkAllChildrenChecked(children, null, 2);
        this.filters.taxon2 = this.removeArrayFromTaxonFilter(
          "taxon2",
          children,
          1
        );
        this.filters.taxon3 = this.removeArrayFromTaxonFilter(
          "taxon3",
          children,
          2
        );
        if (!is_all_checked) {
          let taxon2_array = [];
          let taxon3_array = [];
          children.forEach(child => {
            taxon2_array.push(child.key);
            child.taxonomy_3.buckets.forEach(taxon3 => {
              taxon3_array.push(taxon3.key);
            });
          });
          this.filters.taxon2 = this.filters.taxon2.concat(taxon2_array);
          this.filters.taxon3 = this.filters.taxon3.concat(taxon3_array);
        } else {
          this.filters.taxon2 = [];
          this.filters.taxon3 = [];
        }
      } else if (type === "taxon2") {
        // taxon2クリック時→子供の要素全てチェックor外す、兄弟要素確認し、親の状態決める
        is_all_checked = this.checkAllChildrenChecked(children, "taxon3", 1);

        this.filters.taxon3 = this.removeArrayFromTaxonFilter(
          "taxon3",
          children,
          1
        );

        if (!is_all_checked) {
          let taxon3_array = [];
          children.forEach(child => {
            taxon3_array.push(child.key);
          });
          this.filters.taxon3 = this.filters.taxon3.concat(taxon3_array);
        }

        // check siblings state
        setTimeout(() => {
          let is_siblings_all_checked = true;
          siblings.forEach(sibling => {
            if (siblings.key === "") {
              return;
            }
            if (this.filters.taxon2.indexOf(sibling.key) === -1) {
              is_siblings_all_checked = false;
            }
          });
          if (is_siblings_all_checked) {
            this.filters.taxon1.push(parent);
          } else {
            this.filters.taxon1 = this.filters.taxon1.filter(
              taxon => taxon !== parent
            );
          }
        }, 0);
      } else if (type === "taxon3") {
        // taxon3クリック時→兄弟要素確認し、親の状態決める。親の状態確認し、祖父の状態決める
        setTimeout(() => {
          // 親
          let is_siblings_all_checked = true;
          siblings.forEach(sibling => {
            if (sibling.key === "") {
              return;
            }
            if (this.filters.taxon3.indexOf(sibling.key) === -1) {
              is_siblings_all_checked = false;
            }
          });
          if (is_siblings_all_checked) {
            this.filters.taxon2.push(parent);
          } else {
            this.filters.taxon2 = this.filters.taxon2.filter(
              taxon => taxon !== parent
            );
          }

          // 祖父
          let is_parents_all_checked = true;
          parents.forEach(parent => {
            if (parent.key === "") {
              return;
            }
            if (this.filters.taxon3.indexOf(parent.key) === -1) {
              is_parents_all_checked = false;
            }
          });
          if (is_parents_all_checked) {
            this.filters.taxon1.push(granpa);
          } else {
            this.filters.taxon1 = this.filters.taxon1.filter(
              taxon => taxon !== granpa
            );
          }
        }, 0);
      }
    },
    checkAllChildrenChecked(array, target_filter, nest) {
      let is_all_checked = true;
      if (nest === 1) {
        array.forEach(child => {
          if (this.filters[target_filter].indexOf(child.key) === -1) {
            is_all_checked = false;
          }
        });
      } else if (nest === 2) {
        array.forEach(child => {
          if (this.filters.taxon2.indexOf(child.key) === -1) {
            is_all_checked = false;
          }
          child.taxonomy_3.buckets.forEach(taxon3 => {
            if (this.filters.taxon3.indexOf(taxon3.key) === -1) {
              is_all_checked = false;
            }
          });
        });
      }
      return is_all_checked;
    },
    removeArrayFromTaxonFilter(target_filter, remove_array, nest) {
      if (nest === 1) {
        return this.filters[target_filter].filter(taxon => {
          let flag = true;
          remove_array.forEach(remove_taxon => {
            if (remove_taxon.key !== "" && remove_taxon.key === taxon) {
              flag = false;
            }
          });
          return flag;
        });
      } else if (nest === 2) {
        return this.filters.taxon3.filter(taxon3 => {
          let flag = true;
          remove_array.forEach(taxon2 => {
            taxon2.taxonomy_3.buckets.forEach(remove_taxon3 => {
              if (remove_taxon3.key !== "" && taxon3 === remove_taxon3.key) {
                flag = false;
              }
            });
          });
          return flag;
        });
      }
    },
    removeTag(text) {
      if(text !== undefined) {
        return text.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, "");
      } else {
        return text
      }
    },
    fetchPage(page) {
      this.is_loading = true;
      this.current_page = page;

      if (!this.is_filter_on) {
        // 通常のページング（フィルタなし）
        axios
          .get(
            `https://togotv-api.dbcls.jp/api/entries?target=pictures&from=${page}&rows=40`
          )
          .then(data => {
            this.pictures = data.data.data;
            this.last_page = data.data.last_page;
            this.is_loading = false;
            window.scrollTo(0, 0);
          })
          .catch(error => {
            console.log("error", error);
            this.is_loading = false;
          });
      } else if (this._is_text_search) {
        // テキスト検索時のページング
        axios
          .get(
            `https://togotv-api.dbcls.jp/api/search?target=pictures&text=${this.keyword}&from=${page}&rows=40`
          )
          .then(data => {
            if (data.data.data && data.data.data.length > 0) {
              this.pictures = data.data.data;
              this.last_page = data.data.last_page || 1;
              this.filter_total_hits = data.data.total_hits || 0;
            } else {
              this.pictures = [];
            }
            this.is_loading = false;
            window.scrollTo(0, 0);
          })
          .catch(error => {
            console.log("error", error);
            this.is_loading = false;
          });
      } else {
        // フィルタ時のページング
        let param;
        if (this._current_filter_params) {
          param = Object.assign({}, this._current_filter_params);
        } else {
          param = Object.assign({}, this.filters);
          Object.keys(param).forEach(key => {
            param[key] = param[key].filter(data => data !== "");
            if (param[key].length === 0) {
              delete param[key];
            }
          });
        }

        Object.keys(param).forEach(key => {
          if (key === "pics") {
            param["exist"] = param["pics"];
            delete param["pics"];
            param["exist"] = param["exist"].join(",");
          } else if (typeof param[key] === "object") {
            param[key] = param[key].join(",");
          }
        });

        param["target"] = "pictures";
        param["rows"] = 40;
        param["from"] = page;

        axios
          .get("https://togotv-api.dbcls.jp/api/bool_search", {
            params: param
          })
          .then(data => {
            if (data.data.data && data.data.data.length > 0) {
              this.pictures = data.data.data;
              this.last_page = data.data.last_page || 1;
              this.filter_total_hits = data.data.total_hits || 0;
            } else {
              this.pictures = [];
            }
            this.is_loading = false;
            window.scrollTo(0, 0);
          })
          .catch(error => {
            console.log("error", error);
            this.is_loading = false;
          });
      }
    },
    goToNextPage() {
      if (this.current_page < this.last_page) {
        this.fetchPage(this.current_page + 1);
      }
    },
    goToPrevPage() {
      if (this.current_page > 1) {
        this.fetchPage(this.current_page - 1);
      }
    },
    // スワイプ処理
    handleTouchStart(e) {
      this.swipe_start_x = e.touches[0].clientX;
    },
    handleTouchMove(e) {
      if (!this.swipe_start_x) return;
      this.swipe_current_x = e.touches[0].clientX;
    },
    handleTouchEnd() {
      if (!this.swipe_start_x || !this.swipe_current_x) return;

      const diff = this.swipe_start_x - this.swipe_current_x;
      const threshold = 50; // スワイプと認識する最小距離

      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          // 左スワイプ = 次へ
          this.goToNextPage();
        } else {
          // 右スワイプ = 前へ
          this.goToPrevPage();
        }
      }

      this.swipe_start_x = null;
      this.swipe_current_x = null;
    },
    handleMouseDown(e) {
      this.swipe_start_x = e.clientX;
      this.is_mouse_down = true;
    },
    handleMouseMove(e) {
      if (!this.is_mouse_down) return;
      this.swipe_current_x = e.clientX;
    },
    handleMouseEnd() {
      if (!this.is_mouse_down) return;
      this.handleTouchEnd();
      this.is_mouse_down = false;
    },
    setCanMessageSubmit() {
      this.canMessageSubmit = true;
    },
    searchByText(type) {
      if (this.keyword === "") {
        return;
      }
      if (type === "enter") {
        if (!this.canMessageSubmit) {
          return;
        }
        this.pictures = [];
        this.filter_current_page = 1;
        this.filter_last_page = 0;
        // フィルタをクリアしてから検索
        Object.keys(this.filters).forEach(key => {
          this.filters[key] = [];
        });
        // テキスト検索時は特殊なフィルタ状態にする
        this._is_text_search = true;
        // fetchPageで初回データ取得
        this.fetchPage(1);
      }
    },
    toggleDisplay() {
      this.$store.commit("toggleDisplay");
    },
    setDonwnloadLink(pic) {
      this.selected_pic = pic;
      this.is_single_download = true;
      this.is_modal_on = true;
    },
    handlePictureClick(event, picture) {
      // Command+Click (Mac) または Ctrl+Click (Windows/Linux) の場合は
      // デフォルトの動作（新しいタブで開く）を許可
      if (event.metaKey || event.ctrlKey) {
        return;
      }

      // 中クリック（マウスホイールクリック）も新しいタブで開く
      if (event.button === 1) {
        return;
      }

      // 通常のクリックの場合はSPAナビゲーション
      event.preventDefault();
      this.moveDetailPage(`/${picture.id.split('/').pop()}.html`);
    },
    moveDetailPage(next_page) {
      // 検索状態を保存
      const searchState = {};

      // テキスト検索の場合
      if (this._is_text_search && this.keyword) {
        searchState.keyword = this.keyword;
      }

      // フィルタ検索の場合
      if (this.is_filter_on && !this._is_text_search) {
        Object.keys(this.filters).forEach(key => {
          if (this.filters[key].length > 0) {
            searchState[key] = this.filters[key].join(',');
          }
        });
      }

      // 検索状態があればクエリパラメータとして渡す
      if (Object.keys(searchState).length > 0) {
        searchState.from_search = 'true';
        this.$router.push({
          path: this.localePath(next_page),
          query: searchState
        });
      } else {
        this.$router.push(this.localePath(next_page));
      }
    },
    selectPic(pic, e) {
      e.stopPropagation();
      let is_already_exist = false;
      this.selected_pics.forEach(selected_pic => {
        if (selected_pic.TogoTV_Image_ID === pic.TogoTV_Image_ID) {
          is_already_exist = true;
        }
      });
      if (!is_already_exist) {
        this.selected_pics.push(pic);
      } else {
        this.selected_pics = this.selected_pics.filter(selected_pic => {
          return selected_pic.TogoTV_Image_ID !== pic.TogoTV_Image_ID;
        });
      }
    },
    checkIfSelected(id) {
      let is_already_exist = false;
      this.selected_pics.forEach(pic => {
        if (pic.TogoTV_Image_ID === id) {
          is_already_exist = true;
        }
      });
      if (is_already_exist) {
        return "selected";
      } else {
        return "";
      }
    },
    downloadSelectedImages() {
      this.is_single_download = false;
      this.is_modal_on = true;
    },
    closeModal() {
      this.is_modal_on = false;
      this.is_edit_on = false;
      this.selected_pics = [];
    },
    toggleEditMode() {
      if (this.is_edit_on) {
        this.selected_pics = [];
      }
      this.is_edit_on = !this.is_edit_on;
    },
    hasChildren(array) {
      let flag = false;
      array.forEach(item => {
        if (item.key !== "") {
          flag = true;
        }
      });
      return flag;
    },
    toggleTaxon(e) {
      e.preventDefault();
      let class_list = e.target.classList;
      if (class_list.value.indexOf("close") === -1) {
        class_list.add("close");
        e.target.parentNode.nextElementSibling.classList.add("close");
      } else {
        class_list.remove("close");
        e.target.parentNode.nextElementSibling.classList.remove("close");
      }
    }
  }
});
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
    > p.clear_btn
      text-decoration: underline
      font-size: 12px
      display: flex
      align-items: center
      &:before
        width: 18px
        height: 18px
        margin-right: 2px
        margin-left: 3px
        @include icon('clear')
      &:hover
        cursor: pointer
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
                padding-top: 1px
              > .count
                @include numfound
                display: flex
                align-items: center
                justify-content: center
              > .toggle_btn
                @include toggle_arrow
            > input[type=checkbox]
              @include checkbox
              margin-left: 3px
          &.taxon_2,
          &.taxon_3
            margin-left: 28px
            position: relative
            max-height: auto
            transition: max-height .3s
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
            &.close
              max-height: 0
              overflow: hidden
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
    > .loader
      @include loader
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
            background-color: #fff
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
          pointer-events: none
          text-align: center
          position: absolute
          z-index: 4
          background-color: $MAIN_COLOR
          border-radius: 9px
          bottom: -40px
          left: 0
          color: #fff
          box-shadow: 0 3px 20px rgba(0, 0, 0, 0.4)
          padding: 2px 11px
          box-sizing: border-box
          min-width: 140px
          max-width: 160px
          // &:after
          //   content: ""
          //   position: absolute
          //   top: 0
          //   right: -30px
          //   width: 30px
          //   height: 100%
          //   background: transparent
          &:before
            content: ""
            position: absolute
            top: -18px
            left: 50%
            transform: translateX(-50%)
            border: 10px solid transparent
            border-bottom: 10px solid $MAIN_COLOR
          > p
            font-size: 14px
            // margin: 5px 0 21px
          // > p.name
          //   font-size: 20px
          //   margin: 0
          > a.button
            @include download_btn
          &.en
            width: 300px
            > p.name
              margin-bottom: 21px
        &:hover
          > .description_wrapper
            display: block
  > .modal_back
    @include modal_back

.pagination
  display: flex
  justify-content: center
  align-items: center
  gap: 20px
  margin: 40px 0
  padding: 20px
  .pagination_btn
    padding: 10px 20px
    background-color: $MAIN_COLOR
    color: #fff
    border: none
    border-radius: 4px
    font-size: 16px
    cursor: pointer
    transition: opacity 0.3s
    &:hover:not(:disabled)
      opacity: 0.8
    &:disabled
      background-color: #ccc
      cursor: not-allowed
  .page_info
    font-size: 16px
    font-weight: bold
    min-width: 80px
    text-align: center

@media screen and (max-width: 896px)
  .pictures_wrapper
    > .facet_wrapper
      display: none

@media screen and (max-width: 480px)
  .pictures_wrapper
    padding: 0 $VIEW_PADDING_SP
    flex-direction: column
    > .gallery_wrapper
      > ul.picture_list_card
        > li.single_picture
          > a
            > img
              width: calc((100vw - #{$VIEW_PADDING_SP} * 2 - 20px) / 2)
          &:hover
            > .description_wrapper
              display: none
      > .gallery_section_header
        > .control_wrapper
          > .control_btn
            display: none
          > ul.display_icon_wrapper
            margin-top: -30px
      > ul.picture_list
        > li
          > ul.picture_list_children
            > li
              height: auto
</style>
