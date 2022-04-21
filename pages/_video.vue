<template>
  <div class="video_wrapper">
    <section v-if="videoData.skillset_1" class="course_info">
      <p class="course_title tsukushi">{{ videoData.skillset_1.title }}</p>
    </section>
    <section class="video_description_wrapper">
      <div class="left_section">
        <div v-if="videoData.skillset_1" class="video_control">
          <div class="control" @click="player.previousVideo()">
            <img class="prev" src="~/assets/img/icon/icon_prev_video.svg" />
            <p class="control_text prev">{{ $t("prev") }}</p>
          </div>
          <p class="video_title tsukushi bold">
            <span v-if="finish_loading">{{ current_video_index + 1 }}.</span>
            {{ videoData.name }}
          </p>
          <div class="control" @click="player.nextVideo()">
            <p class="control_text next">{{ $t("next") }}</p>
            <img class="next" src="~/assets/img/icon/icon_next_video.svg" />
          </div>
        </div>
        <div class="iframe_wrapper">
          <div
            v-if="videoData.skillset_1"
            :class="['list_emphasize', is_first_time ? 'on' : '']"
          >
            <p class="list_description tsukushi">
              {{ $t("you_can_see_playlist") }}
            </p>
          </div>
          <youtube
            ref="youtube"
            :video-id="videoData.embedUrl"
            :player-vars="{
              rel: 0,
              listType: 'playlist',
              list:
                videoData.skillset_1 !== undefined
                  ? videoData.skillset_1.id
                  : null,
              autoplay: 0,
              controls: 1,
            }"
            @stateChange="stateChange"
            @ready="ready()"
            :resize="true"
          ></youtube>
        </div>
        <p class="original_link">
          この動画が再生されない場合は、YouTubeでご覧ください。<a
            :href="`https://youtu.be/${videoData.embedUrl}`"
            target="_blank"
            >{{ `https://youtu.be/${videoData.embedUrl}` }}</a
          >
        </p>
        <div class="meta_data_and_save">
          <div class="meta_data">
            <p class="update mont bold">
              {{
                videoData.uploadDate
                  ? videoData.uploadDate.replace(/-/g, ".")
                  : ""
              }}
            </p>
            <p
              class="total_time mont bold"
              v-html="converSecToHour(videoData['duration'], true, true)"
            >
              <span class="unit">{{ $t("minutes") }}</span>
            </p>
            <p class="author tsukushi bold">
              <span class="label">{{ `${$t("author")}:&nbsp;` }}</span>
              <span v-html="videoData.author"></span>
            </p>
            <p class="editor tsukushi bold">
              <span class="label">{{ `${$t("editor")}:&nbsp;` }}</span>
              <span v-html="videoData.editor"></span>
            </p>
          </div>
          <client-only>
            <div v-if="$auth.loggedIn" class="save">
              <button @click="popup.save = true">
                {{ $t("save_to_playlist") }}
              </button>
              <div v-if="popup.save" class="window">
                <p class="title tsukushi bold">{{ $t("destination") }}</p>
                <p class="description">
                  <template v-if="$i18n.locale === 'ja'">
                    YouTubeアカウントと連携し、再生リストを作成・編集することができます。作成した再生リストは、
                    <nuxt-link :to="localePath('/mypage.html')">{{
                      $t("mypage")
                    }}</nuxt-link>
                    で確認できます。
                  </template>
                  <template v-else-if="$i18n.locale === 'en'">
                    You can create and edit playlists by linking them to your
                    YouTube account.The playlists you have created can be viewed
                    in
                    <nuxt-link :to="localePath('/mypage.html')">{{
                      $t("mypage")
                    }}</nuxt-link
                    >.
                  </template>
                </p>
                <div class="contents">
                  <ul :class="['playlists', { loading: is_fetching_mylist }]">
                    <li
                      v-for="playlist in playlists"
                      :key="`playlist-${playlist.info.id}`"
                    >
                      <label :for="`checkbox-${playlist.info.id}`">
                        <input
                          type="checkbox"
                          :name="`checkbox-${playlist.info.id}`"
                          :id="`checkbox-${playlist.info.id}`"
                          :checked="
                            playlist.items.some(
                              (item) =>
                                item.youtubeVideoId === videoData.embedUrl
                            )
                          "
                          @change="
                            toggleVideoWithPlaylist(
                              playlist,
                              $event.target.checked
                            )
                          "
                        />
                        {{ playlist.info.snippet.title }}
                      </label>
                    </li>
                  </ul>
                  <a
                    v-if="!playlist_to_create.is_active"
                    @click="playlist_to_create.is_active = true"
                    :class="['create_new', { loading: is_fetching_mylist }]"
                    >{{ $t("create_new_list") }}</a
                  >
                  <div v-else-if="!is_fetching_mylist" class="new_list_setting">
                    <label for="playlist_title">{{ $t("name") }}</label>
                    <input
                      type="text"
                      id="playlist_title"
                      v-model="playlist_to_create.title"
                    />
                    <label for="playlist_description">{{
                      $t("description")
                    }}</label>
                    <textarea
                      id="playlist_description"
                      v-model="playlist_to_create.description"
                      rows="4"
                    ></textarea>
                    <label for="playlist_privacy">{{
                      $t("privacy_setting")
                    }}</label>
                    <select
                      id="playlist_privacy"
                      v-model="playlist_to_create.privacy"
                    >
                      <option value="public">
                        {{ $t("public") }}
                        ({{ $t("public_description") }})
                      </option>
                      <option value="unlisted">
                        {{ $t("unlisted") }}
                        ({{ $t("unlisted_description") }})
                      </option>
                      <option value="private">
                        {{ $t("private") }}
                        ({{ $t("private_description") }})
                      </option>
                    </select>
                    <button
                      @click="createPlaylist"
                      :class="{ disable: playlist_to_create.title === '' }"
                    >
                      {{ $t("confirm") }}
                    </button>
                  </div>
                  <div v-if="is_fetching_mylist" class="loader">Loading...</div>
                  <p v-if="complemete_new_list_creation">
                    {{ $t("complemete_new_list_creation") }}
                  </p>
                </div>
              </div>
            </div>
          </client-only>
        </div>
        <h2 class="title tsukushi bold">{{ videoData.name }}</h2>
        <div class="description" v-html="videoData.description"></div>
        <div class="related_videos related_videos_section">
          <h3 class="tsukushi bold">{{ $t("related_videos") }}</h3>
          <VideoListHorizontalScroll
            :props="{
              id: 'related_videos',
              playList: related_videos,
              bg: 'white',
            }"
          />
        </div>
      </div>
      <div
        :class="['right_section', videoData.skillset_1 ? 'is_in_course' : '']"
      >
        <div
          class="digest"
          v-if="videoData.headline && videoData.headline.length !== 0"
        >
          <h3 class="tsukushi bold">{{ $t("digest") }}</h3>
          <ul :class="videoData.headline.length >= 5 ? 'over5' : ''">
            <li
              v-for="(digest, index) in videoData.headline"
              :key="index"
              :style="calcYCoordinate(digest.time, videoData['duration'])"
            >
              <span
                class="time"
                v-html="converSecToHour(digest.time, false, true)"
                @click="player.seekTo(digest.time)"
              ></span>
              <span class="title" @click="player.seekTo(digest.time)"
                >{{ digest.name }}
              </span>
            </li>
          </ul>
        </div>
        <div class="tag_list">
          <h3 class="tsukushi bold">{{ $t("this_video_tags") }}</h3>
          <ul>
            <li v-for="(tag, index) in videoData.keywords" :key="index">
              <nuxt-link :to="localePath(`/tag.html?name=${tag}`)">{{
                tag
              }}</nuxt-link>
            </li>
          </ul>
        </div>
        <div class="related_videos related_videos_section">
          <h3 class="tsukushi bold">{{ $t("related_videos") }}</h3>
          <VideoListHorizontalScroll
            :props="{
              id: 'related_videos_sp',
              playList: related_videos,
              bg: 'white',
            }"
          />
        </div>
        <div class="document" v-if="ajacs_list && ajacs_list.length > 0">
          <h3 class="tsukushi bold">
            {{ $t("related_ajacs_tests") }}
            <span
              v-if="ajacs_list.length >= 5"
              :class="['toggle_btn', is_ajacs_open ? '' : 'close']"
              @click="is_ajacs_open = !is_ajacs_open"
            ></span>
          </h3>
          <ul :class="['ajacs_list', is_ajacs_open ? '' : 'close']">
            <li v-for="(ajacs, index) in ajacs_list" :key="index">
              <span>・</span>
              <nuxt-link :to="localePath(`/${ajacs.url.split('/').pop()}`)">{{
                ajacs.title
              }}</nuxt-link>
            </li>
          </ul>
        </div>
        <div class="original">
          <h3 class="tsukushi bold">{{ $t("download_video_data") }}</h3>
          <p @click="popup.download = true">
            {{
              videoData.contentUrl ? videoData.contentUrl.split("/").pop() : ""
            }}
          </p>
        </div>
        <div class="doi">
          <h3 class="tsukushi bold">DOI</h3>
          <a :href="videoData.id">{{ videoData.id }}</a>
        </div>
        <div class="license">
          <h3 class="tsukushi bold">{{ $t("license") }}</h3>
          <a :href="videoData.license" target="_blank">{{
            $t("creativecommons")
          }}</a>
          <nuxt-link
            :to="localePath(`/faq.html#copyrights`)"
            class="add_faq_icon"
          ></nuxt-link>
        </div>
      </div>
    </section>
    <section class="course_section bg_blue first">
      <h3 class="tsukushi bold">
        <nuxt-link :to="localePath('/courses.html')">{{
          $t("search_for_courses")
        }}</nuxt-link>
      </h3>
      <CourseList :props="{ bg: 'blue', courses: course_list }" />
    </section>
    <section class="newvideo_section bg_blue">
      <h3 class="tsukushi bold">
        <nuxt-link :to="localePath('/newvideo.html')">{{
          $t("new_videos")
        }}</nuxt-link>
      </h3>
      <VideoListHorizontalScroll
        :props="{ id: 'newvideo', playList: new_video_list, bg: 'blue' }"
      />
    </section>
    <section class="realtime_view_video_section bg_blue">
      <h3 class="tsukushi bold">
        <nuxt-link :to="localePath('/rankings.html')">{{
          $t("ranking")
        }}</nuxt-link>
      </h3>
      <VideoListHorizontalScroll
        :props="{
          id: 'realtime_view_video',
          playList: realtime_video_list,
          bg: 'blue',
        }"
      />
    </section>
    <section class="illustation_section bg_blue">
      <h3 class="tsukushi bold">
        <nuxt-link :to="localePath('/pics.html')">{{
          $t("new_illustrations")
        }}</nuxt-link>
      </h3>
      <IllustrationList :illustration_list="illustration_list" />
    </section>
    <DownloadModal
      v-if="popup.download"
      :props="{ selected_video: videoData.contentUrl }"
      @closeModal="popup.download = false"
    />
    <div
      v-if="Object.values(popup).includes(true)"
      @click="Object.keys(popup).forEach((k) => (popup[k] = false))"
      class="modal_back"
    ></div>
  </div>
</template>

<script>
import Vue from "vue";
import VueYoutube from "vue-youtube";
import CourseList from "~/components/CourseList.vue";
import VideoListHorizontalScroll from "~/components/VideoListHorizontalScroll.vue";
import IllustrationList from "~/components/IllustrationList.vue";
import DownloadModal from "~/components/DownloadModal.vue";
import axios from "axios";
import {
  fetchMyLists,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  createPlaylist,
} from "~/assets/js/youtube.js";

Vue.use(VueYoutube);

export default Vue.extend({
  watchQuery: ["course"],
  key: (route) => route.fullPath,
  async asyncData({ params, error, payload }) {
    if (payload) {
      return { videoData: payload };
    } else {
      let upload_date = params.video;
      upload_date = `${upload_date.slice(0, 4)}-${upload_date.slice(4)}`;
      upload_date = `${upload_date.slice(0, 7)}-${upload_date.slice(7)}`;
      let data = await axios.get(
        `https://togotv-api.dbcls.jp/api/search?uploadDate=${upload_date}`
      );
      return {
        videoData: data.data.data[0],
      };
    }
  },
  async created() {
    this.fetchRelatedVideos(this.videoData.TogoTV_Video_ID);
    if (this.videoData.TogoTV_Handson_ID !== null) {
      this.fetchAjacs(this.videoData.TogoTV_Handson_ID);
    }

    axios
      .get(`https://togotv-api.dbcls.jp/api/skillset`)
      .then((data) => {
        this.course_list = data.data.cources;
      })
      .catch((error) => {
        console.log("error", error);
      });

    axios
      .get(`https://togotv-api.dbcls.jp/api/entries?rows=20`)
      .then((data) => {
        this.new_video_list = data.data.data;
      })
      .catch((error) => {
        console.log("error", error);
      });

    axios
      .get(`https://togotv-api.dbcls.jp/api/yt_view/weekly`)
      .then((data) => {
        this.realtime_video_list = data.data;
      })
      .catch((error) => {
        console.log("error", error);
      });

    axios
      .get(
        `https://togotv-api.dbcls.jp/api/entries?target=pictures&from=1&rows=11`
      )
      .then((data) => {
        this.illustration_list = data.data.data;
      })
      .catch((error) => {
        console.log("error", error);
      });

    if (process.client && this.$auth.loggedIn) {
      this.is_fetching_mylist = true;
      const access_token =
        this.$auth?.strategies?.google?.token?.$storage?._state[
          "_token.google"
        ];
      this.playlists = await fetchMyLists(access_token).catch((err) =>
        console.error(err)
      );
      this.is_fetching_mylist = false;
    }
  },
  head() {
    return {
      title: this.videoData.name,
      script: [
        {
          type: "application/ld+json",
          innerHTML: JSON.stringify(this.jsonld, null, 2),
        },
      ],
      meta: [
        { hid: "og:title", property: "og:title", content: this.videoData.name },
        {
          hid: "og:description",
          property: "og:description",
          content: this.videoData.description,
        },
        {
          hid: "og:url",
          property: "og:url",
          content: process.client ? location.href : "",
        },
        {
          hid: "og:image",
          property: "og:image",
          content: this.videoData.thumbnailUrl,
        },
      ],
    };
  },
  computed: {
    player() {
      return this.$refs.youtube.player;
    },
    jsonld() {
      return {
        "@context": "http://schema.org",
        "@type": "Dataset",
        name: this.videoData.name,
        description: this.videoData.description,
        url: process.client ? location.href : "",
        identifier: this.videoData.id,
        keywords: this.videoData.keywords,
        license: "https://creativecommons.org/licenses/by/4.0/",
        liscense: this.videoData.liscense,
        creator: [
          {
            "@type": "Organization",
            url: "http://dbcls.rois.ac.jp/",
            name: "Database Center for Life Science",
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "customer service",
              telephone: "81-4-7135-5508",
            },
          },
          {
            "@type": "Person",
            name: this.videoData.author,
          },
        ],
      };
    },
    access_token() {
      if (!process.client || !this.$auth.loggedIn) return null;
      return this.$auth.strategies.google.token.$storage._state[
        "_token.google"
      ];
    },
  },
  components: {
    CourseList,
    VideoListHorizontalScroll,
    IllustrationList,
    DownloadModal,
  },
  mounted() {
    if (!localStorage.getItem("is_first_time")) {
      this.is_first_time = true;
      localStorage.setItem("is_first_time", true);
    }

    function onPlayerStateChange() {
      this.player.getPlaylist().then((data) => {
        this.playlist_array = data;
      });

      this.player.getPlaylistIndex().then((data) => {
        if (this.current_video_index !== data) {
          this.finish_loading = false;
          this.current_video_index = data;
          this.fetchVideoData();
        }
      });
    }
  },
  data() {
    return {
      // video_id: this.$route.query.id,
      current_video_index: 0,
      playlist_array: [],
      is_first_time: false,
      finish_loading: false,
      related_videos: [],
      related_docs: [],
      ajacs_list: [],
      is_ajacs_open: false,
      popup: {
        download: false,
        save: false,
      },
      course_list: [],
      new_video_list: [],
      realtime_video_list: [],
      illustration_list: [],
      videoData: {},
      playlists: [],
      is_fetching_mylist: false,
      playlist_to_create: {
        is_active: false,
        title: "",
        description: "",
        privacy: "public", //private:本人のみ視聴可能 unlisted:限定公開（リンクを知っている人のみ） public:公開（誰でも検索と視聴が可能）
      },
      complemete_new_list_creation: false,
    };
  },
  methods: {
    converSecToHour(time, is_ISO, html) {
      if (time === "") {
        return;
      }
      let hour = 0,
        min = 0,
        sec = 0,
        totalsec;
      if (is_ISO) {
        const reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
        if (reptms.test(time)) {
          const matches = reptms.exec(time);
          if (matches[1]) hour = Number(matches[1]);
          if (matches[2]) min = Number(matches[2]);
          if (matches[3]) sec = Number(matches[3]);
          totalsec = hour * 3600 + min * 60 + sec;
        }
      } else {
        sec = (time % 60) % 60;
        min = Math.floor(time / 60) % 60;
        hour = Math.floor(time / 3600);
      }

      if (html) {
        min = ("00" + min).slice(-2);
        sec = ("00" + sec).slice(-2);

        if (hour === 0) {
          return `<span class="time mont bold">${min}</span>:<span class="time mont bold">${sec}</span>`;
        } else {
          hour = ("00" + hour).slice(-2);
          return `<span class="time mont bold">${hour}</span>:<span class="time mont bold">${min}</span>:<span class="time mont bold">${sec}</span>`;
        }
      } else {
        return totalsec;
      }
    },
    calcYCoordinate(sec, total_sec) {
      return `top: ${
        (sec / this.converSecToHour(total_sec, true, false)) * 348
      }px`;
    },
    ready() {
      this.finish_loading = true;
      this.player.getPlaylistIndex().then((data) => {
        this.current_video_index = data;
      });
    },
    stateChange() {
      this.player.getPlaylist().then((data) => {
        this.playlist_array = data;
      });

      this.player.getPlaylistIndex().then((data) => {
        if (this.current_video_index !== data) {
          this.finish_loading = false;
          this.current_video_index = data;
          this.fetchVideoData();
        }
      });
    },
    fetchVideoData() {
      if (this.playlist_array !== null) {
        let next_video_id = this.playlist_array[this.current_video_index];
        axios
          .get(
            `https://togotv-api.dbcls.jp/api/search?embedUrl=${next_video_id}`
          )
          .then((data) => {
            let next_video = data.data.data[0];
            this.$router.push(
              this.localePath({
                name: "video",
                params: { video: next_video.uploadDate.replace(/-/g, "") },
              })
            );
          });
      }
      this.finish_loading = true;
    },
    fetchRelatedVideos(id) {
      axios
        .get(`https://togotv-api.dbcls.jp/api/recommend/movies/${id}`)
        .then((data) => {
          this.related_videos = data.data.items;
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    fetchAjacs(id) {
      axios
        .get(`https://togotv-api.dbcls.jp/api/recommend/ajacs-training/${id}`)
        .then((data) => {
          this.ajacs_list = data.data.items;
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    fetchRelatedDocs(id) {
      axios
        .get(`https://togotv-api.dbcls.jp/api/recommend/ajacs-training/${id}`)
        .then((data) => {
          this.related_docs = data.data;
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    async toggleVideoWithPlaylist(playlist, checked) {
      this.is_fetching_mylist = true;
      if (checked) {
        const playlist_id = playlist.info.id;
        await addVideoToPlaylist(
          this.access_token,
          playlist_id,
          this.videoData.embedUrl
        ).catch((err) => console.error(err));
      } else {
        const video_id = playlist.items.find(
          (item) => item.youtubeVideoId === this.videoData.embedUrl
        )?.id;
        await removeVideoFromPlaylist(
          this.access_token,
          video_id,
          this.videoData.embedUrl
        ).catch((err) => console.error(err));
      }
      this.playlists = await fetchMyLists(this.access_token).catch((err) =>
        console.error(err)
      );
      this.is_fetching_mylist = false;
    },
    async createPlaylist() {
      this.is_fetching_mylist = true;
      await createPlaylist(
        this.access_token,
        this.playlist_to_create.title,
        this.playlist_to_create.description,
        this.playlist_to_create.privacy,
        this.videoData.embedUrl
      ).catch((err) => console.error(err));
      // this.playlists = await fetchMyLists(this.access_token).catch((err) =>
      //   console.error(err)
      // );
      this.is_fetching_mylist = false;
      this.playlist_to_create.is_active = false;
      this.complemete_new_list_creation = true;
      setTimeout(() => {
        this.complemete_new_list_creation = false;
      }, 1500);
    },
  },
});
</script>

<style lang="sass">
.video_wrapper
  > .course_info
    margin-bottom: -28px
    > p.course_title
      margin: 0
      padding: 2px 0 2px $VIEW_PADDING
      font-size: 16px
      display: flex
      align-items: center
      color: white
      background-color: $MAIN_COLOR
      &:before
        width: 24px
        height: 24px
        margin-right: 3px
        display: inline-block
        @include icon('course-white')
  > .video_description_wrapper
    display: flex
    width: calc(100% - #{$VIEW_PADDING} * 2)
    margin: 34px auto 0
    > .left_section
      width: calc(100% - 280px)
      > .video_control
        display: flex
        justify-content: center
        align-items: center
        margin: 20px 0 12px
        > div.control
          display: flex
          margin-top: 1px
          align-items: center
          > p.control_text
            margin: 0
            font-size: 12px
            color: $MAIN_COLOR
          > img
            width: 18px
          &:hover
            cursor: pointer
        > .video_title
          font-size: 20px
          margin: 0
          padding: 0 15px
      > .iframe_wrapper
        position: relative
        padding-bottom: 56%
        > .list_emphasize
          width: 55px
          height: 55px
          border: 5px solid $POINT_COLOR
          top: 4px
          right: 13px
          z-index: $LAYER_4
          position: absolute
          border-radius: 50px
          pointer-events: none
          opacity: 0
          overflow: hidden
          &.on
            animation-name: fade-in-out
            animation-duration: 5s
          > .list_description
            position: absolute
            left: 72px
            top: -10px
            width: 161px
            background-color: $MAIN_COLOR
            color: #ffffff
            padding: 11px 14px
            border-radius: 6px
            line-height: 20px
            box-shadow: 0px 3px 6px rgba(0, 0, 0, .4)
            trasistion: .3s
            animation-name: tremble
            animation-duration: 3s
            &:before
              content: ""
              position: absolute
              top: 15px
              left: -16px
              border: 8px solid transparent
              border-right: 8px solid $MAIN_COLOR
        > iframe
          border-radius: 5px
          position: absolute
          top: 0
          left: 0
          width: 100%
          height: 100%
      > p.original_link
        margin: 4px 0 0
        font-size: 12px
        color: #6b6b6b
      > .meta_data_and_save
        display: flex
        align-items: center
        justify-content: space-between
        > .meta_data
          margin-top: 10px
          margin-bottom: 10px
          display: flex
          align-items: center
          flex-wrap: wrap
          > p
            margin: 0 11px 0 0
            display: flex
            align-items: center
            &:before
              width: 20px
              height: 20px
            &.author
              &:before
                @include icon('author')
            &.editor
              &:before
                @include icon('editor')
            &.update
              &:before
                @include icon('update')
            &.total_time
              @include total_time
              margin-left: 0
              &:before
                transform: none
            > span
              white-space: nowrap
              .label
                font-size: 14px
                white-space: nowrap
        > .save
          position: relative
          > button
            font-size: 13px
            color: #ffffff
            background-color: $MAIN_COLOR
            border-radius: 100px
            border: none
            padding: 8px 20px
            display: flex
            align-items: center
            white-space: nowrap
            &:hover
              cursor: pointer
            &:before
              width: 15px
              height: 15px
              margin-right: 2px
              @include icon('save')
          > .window
            position: absolute
            top: calc(100% + 10px)
            right: 0
            background-color: $MAIN_COLOR
            color: #fff
            z-index: $LAYER_MODAL
            width: 282px
            border-radius: 10px
            padding: 20px 24px
            box-sizing: border-box
            &:before
              content: ""
              position: absolute
              top: -18px
              right: 20px
              transform: translateX(-50%)
              border: 10px solid transparent
              border-bottom: 10px solid $MAIN_COLOR
            > .title
              font-size: 20px
              margin: 0 0 5px 0
            > .description
              font-size: 12px
              margin: 0 0 6px 0
              > a
                color: #ffffff
                font-weight: bold
            > .contents
              font-size: 14px
              color: $BLACK
              background-color: rgba(255, 255, 255, 0.85)
              border-radius: 10px
              padding: 16px 13px
              margin-bottom: 12px
              min-height: 200px
              max-height: 300px
              overflow: auto
              > .loader
                @include loader
              > ul.playlists
                > li
                  line-height: 22px
              > .create_new
                text-decoration: underline
                margin-top: 10px
                display: block
                &:hover
                  cursor: pointer
              > .create_new,
              > ul.playlists
                &.loading
                  opacity: .5
                  pointer-events: none
              > .new_list_setting
                padding: 10px 0 0
                border-top: .5px solid $BLACK
                margin-top: 12px
                > label, input, textarea
                  display: block
                > label
                  font-size: 10px
                  font-weight: bold
                  margin-bottom: 2px
                  &:not(:first-of-type)
                    margin-top: 12px
                > input, textarea, select
                  width: 100%
                  border-radius: 14px
                  border: none
                  padding: 2px 8px
                  box-sizing: border-box
                > button
                  font-size: 13px
                  color: #ffffff
                  background-color: $MAIN_COLOR
                  border-radius: 100px
                  border: none
                  padding: 8px 30px
                  display: flex
                  align-items: center
                  white-space: nowrap
                  margin: 16px auto 0
                  &:hover
                    cursor: pointer
                  &.disable
                    opacity: .5
                    pointer-events: none
      > h2.title
        font-size: 27px
        line-height: 39px
        @include blue_underline
      > div.description
        font-size: 16px
        line-height: 27px
        margin-top: 16px
    .related_videos
      > h3
        font-size: 18px
        display: flex
        align-items: center
        margin: 28px 0 9px
        &:before
          @include icon('relation')
          width: 27px
          height: 27px
          margin-right: 4px
      .video_list_wrapper
        margin-left: -$VIEW_PADDING
    > .right_section
      padding-top: 4px
      width: 280px
      padding-left: 10px
      box-sizing: border-box
      z-index: $LAYER_UNDER_HEADER
      &.is_in_course
        padding-top: 58px
      > .related_videos
        display: none
      > div
        > h3
          font-size: 18px
          display: flex
          align-items: center
          margin: 0
          white-space: nowrap
          &:before
            width: 27px
            height: 27px
            margin-right: 4px
      > div.digest
        > h3
          &:before
            @include icon('doc')
        > ul
          position: relative
          height: 348px
          margin-top: 9px
          margin-left: 14px
          padding-left: 4px
          border-left: 2px solid $SUB_COLOR
          &.over5
            height: auto
            margin-left: 0
            padding-left: 0
            border: none
            > li
              position: static
              margin-bottom: 12px
              &:before
                display: none
          > li
            position: absolute
            display: flex
            &:before
              content: ''
              min-width: 8px
              height: 8px
              border-radius: 10px
              background-color: $SUB_COLOR
              margin-top: 4px
              transform: translateX(-9px)
            > .time
              min-width: 60px
              font-size: 14px
              &:hover
                cursor: pointer
            > .title
              font-size: 14px
              max-width: 169px
              text-decoration: underline
              &:hover
                cursor: pointer
            span.unit
              font-size: 10px
      > div.tag_list
        // margin-top: 34px
        > h3
          margin-bottom: 8px
          &:before
            @include icon('tag')
        > ul
          display: flex
          flex-wrap: wrap
          > li
            margin-right: 10px
            line-height: 30px
            > a
              @include tag
      > div.tag_list
        margin-top: 30px
      > div.document
        margin-top: 30px
        position: relative
        > h3
          margin-bottom: 3px
          &:before
            @include icon('file')
          > .toggle_btn
            width: 28px
            height: 28px
            border-radius: 100px
            background-color: $MAIN_COLOR
            box-shadow: -1px -2px 6px rgba(0, 0, 0, 0.16)
            border: none
            position: absolute
            left: 50%
            bottom: -32px
            transition: .3s
            z-index: $LAYER_1
            transform: translateX(-50%) rotate(180deg)
            &:hover
              cursor: pointer
            &:after
              content: ''
              border: 5px solid transparent
              border-top: 7px solid #fff
              position: absolute
              top: 63%
              left: 50%
              transform: translate(-50%, -50%)
            &.close
              bottom: 0
              transform: translateX(-50%) rotate(0deg)
              box-shadow: 0 3px 6px rgba(0, 0, 0, .16)
        > ul.ajacs_list
          max-height: 100vh
          transition: .5s
          overflow: hidden
          position: relative
          margin-bottom: 50px
          &.close
            max-height: 166px
            margin-bottom: 0
            &:after
              content: ''
              width: 100%
              height: 70px
              background: linear-gradient(to top, #fff 0%, #fff 30%, rgba(255, 255, 255, 0))
              position: absolute
              left: 0
              bottom: 0
          > li
            display: flex
            align-items: flex-start
            > span
              margin-top: 2px
            > a
              color: $BLACK
              font-size: 14px
              line-height: 25px
      > div.original
        margin-top: 30px
        > h3
          margin-bottom: 6px
          &:before
            @include icon('download')
        > p
          color: $MAIN_COLOR
          text-decoration: underline
          margin: 0
          &:hover
            cursor: pointer
      > div.license
        margin-top: 30px
        > h3
          margin-bottom: 6px
          &:before
            @include icon('cc')
        > a
          // word-break: break-all
          &.add_faq_icon
            margin-left: 3px
      > div.doi
        margin-top: 30px
        > h3
          margin-bottom: 6px
          &:before
            @include icon('doi')
  section.bg_blue
    padding: 15px 0
    &.first
      margin-top: 30px
      padding-top: 30px
    > h3
      margin-left: $VIEW_PADDING
      margin-top: 0
      > a
        text-decoration: none
        color: $BLACK
        transition: .2s
        &:hover
          color: $MAIN_COLOR
    &.course_section > h3
      @include section_title('course')
    &.newvideo_section > h3
      @include section_title('new')
    &.realtime_view_video_section > h3
      @include section_title('barchart')
    &.illustation_section > h3
      @include section_title('img')
  > .modal_back
    @include modal_back

@keyframes fade-in-out
  0%
    opacity: 0
    overflow: visible
  30%
    opacity: 0
  40%
    opacity: 1
  90%
    opacity: 1
  100%
    opacity: 0
    overflow: visible

@keyframes tremble
  0%
    transform: rotate(0deg)
  70%
    transform: rotate(0deg)
  80%
    transform: rotate(5deg)
  85%
    transform: rotate(-5deg)
  90%
    transform: rotate(5deg)
  100%
    transform: rotate(0deg)

@media screen and (max-width: 896px)
  .video_wrapper
    > .course_info
      > p.course_title
        padding: 2px 0 2px $VIEW_PADDING_SP
    > .video_description_wrapper
      width: calc(100% - #{$VIEW_PADDING_SP} * 2)
      flex-direction: column
      .related_videos_section
        margin-top: 30px
        .related_videos
          margin-top: 10px
        .video_list_wrapper
          margin-left: -$VIEW_PADDING_SP
      > .left_section
        width: 100%
        > .meta_data_and_save
          > .meta_data
            line-height: 24px
        > .related_videos_section
          display: none
      > .right_section
        max-width: 100%
        width: 100%
        padding-top: 35px
        padding-left: 0
        &.is_in_course
          padding-top: 35px
        > div.digest
          margin-bottom: 43px
          > ul
            > li
              > .title
                max-width: 100%
        > .related_videos_section
          display: block
    section.bg_blue
      > h3
        margin-left: $VIEW_PADDING_SP
</style>