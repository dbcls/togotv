<template>
  <div>
    <div class="main">
      <img class="main_visual_1" src="~/assets/img/main_visual_1.svg" alt="">
      <div class="main_text">
        <h1>
          <img class="logo" src="~/assets/img/logo.svg" alt="togo tv">
        </h1>
        <p class="description">{{ $t("top_description_1") }}<span class="br"><br></span>{{ $t("top_description_2") }}<nuxt-link :to="localePath(`/faq.html#copyrights`)" class="add_faq_icon"></nuxt-link></p>
        <ul :class="['description_list', $i18n.locale]">
          <li>・{{ $t("manual_of_database_and_tool") }}</li>
          <li>・{{ $t("ajacs_videos_and_documents") }}</li>
          <li>・{{ $t("illustration") }}</li>
        </ul>
        <TextSearch props="index"/>
        <div class="search_example">
          <p class="search_example_title">{{ `${$t('example_query')}:&nbsp;` }}</p>
          <nuxt-link :to="(localePath({ path: '/result.html', query: { query: 'PubMed', type: 'manual', page: '1' } }))">PubMed</nuxt-link>
          <span class="comma">,</span>
          <nuxt-link :to="(localePath({ path: '/result.html', query: { query: 'BLAST', type: 'manual', page: '1' } }))">BLAST</nuxt-link>
          <span class="comma">,</span>
          <nuxt-link :to="(localePath({ path: '/result.html', query: { query: 'NGS', type: 'handson', page: '1' } }))">{{ $t('NGS_Hands-on_training') }}</nuxt-link>
        </div>
        <!-- お知らせ 普段はコメントアウト
        <div class="announcement" v-if="$t('top_announcement')">
          <p>{{ $t('top_announcement') }}</p>
        </div> -->
      </div>
      <img class="main_visual_2" src="~/assets/img/main_visual_2.svg" alt="">
    </div>
    <section class="course_section" v-if="course_list">
      <h2 class="sections_title tsukushi bold">
        <nuxt-link :to="localePath('/courses.html')">{{ $t("search_for_courses") }}</nuxt-link>
      </h2>
      <CourseList :props="{bg: 'white', courses: course_list}"/>
    </section>
    <section class="newvideo_section bg_blue" v-if="new_video_list">
      <h2 class="sections_title tsukushi bold">
        <nuxt-link :to="localePath('/newvideo.html')">{{ $t("new_videos") }}</nuxt-link>
      </h2>
      <VideoListHorizontalScroll :props="{id: 'newvideo', playList: new_video_list, bg: 'blue'}"/>
    </section>
    <section class="realtime_view_video_section bg_blue" v-if="realtime_video_list">
      <h2 class="sections_title tsukushi bold">
        <nuxt-link :to="localePath('/rankings.html')">{{ $t("ranking") }}</nuxt-link>
      </h2>
      <VideoListHorizontalScroll :props="{id: 'realtime_view_video', playList: realtime_video_list, bg: 'blue'}"/>
    </section>
    <section class="illustation_section bg_blue">
      <h2 class="sections_title tsukushi bold">
        <nuxt-link :to="localePath('/pics.html')">{{ $t('new_illustrations') }}</nuxt-link>
      </h2>
      <IllustrationList :illustration_list="illustration_list" />
    </section>
    <section class="citation_section bg_blue" v-if="citation_list.length > 0">
      <h2 class="sections_title tsukushi bold">
        <nuxt-link :to="localePath('/citations')">{{ $t("citing_papers") }}</nuxt-link>
      </h2>
      <CitationCarousel :citations="citation_list" />
    </section>
  </div>
</template>

<script>
import Vue from 'vue'
import CourseList from '~/components/CourseList.vue'
import VideoListHorizontalScroll from '~/components/VideoListHorizontalScroll.vue'
import IllustrationList from '~/components/IllustrationList.vue'
import CitationCarousel from '~/components/CitationCarousel.vue'
import TextSearch from '~/components/TextSearch.vue'
import axios from 'axios'

export default Vue.extend({
  // async asyncData() {
  //   const [course_list, new_video_list, realtime_video_list] = await Promise.all([
  //     axios.get(`https://togotv-api.dbcls.jp/api/skillset`),
  //     axios.get(`https://togotv-api.dbcls.jp/api/entries?rows=20`),
  //     axios.get(`https://togotv-api.dbcls.jp/api/yt_view/weekly`)
  //   ]);
  //   return { course_list: course_list.data.cources, new_video_list: new_video_list.data.data, realtime_video_list: realtime_video_list.data };
  // },
  beforeCreate() {
    axios
      .get(`https://togotv-api.dbcls.jp/api/skillset_s`)
      .then(data => {
        this.course_list = data.data.cources
      })
      .catch(error => {
        console.log('error', error)
      })
    axios
      .get(`https://togotv-api.dbcls.jp/api/entries?rows=20`)
      .then(data => {
        this.new_video_list = data.data.data
      })
      .catch(error => {
        console.log('error', error)
      })
    axios
      .get(`https://togotv-api.dbcls.jp/api/yt_view/weekly`)
      .then(data => {
        this.realtime_video_list = data.data
      })
      .catch(error => {
        console.log('error', error)
      })
    axios
      .get(`https://togotv-api.dbcls.jp/api/entries?target=pictures&from=1&rows=11`)
      .then(data => {
        this.illustration_list = data.data.data
      })
      .catch(error => {
        console.log('error', error)
      })
  },
  data() {
    return {
      course_list: [],
      new_video_list: [],
      realtime_video_list: [],
      illustration_list: [],
      citation_list: [],
    }
  },
  head() {
    return {
      title: this.$t('top'),
      meta: [
        { hid: 'og:title', property: 'og:title', content: "TogoTV"},
        { hid: 'og:description', property: 'og:description', content: this.$t('about_description') },
        { hid: 'og:url', property: 'og:url', content: process.client ? location.href : '' },
        { hid: 'og:image', property: 'og:image', content: 'https://togotv.dbcls.jp/top_screen_captcha.png'},
      ]

    }
  },
  mounted() {
    this.fetchCitations()
  },
  methods: {
    async fetchCitations() {
      // Check localStorage cache (7-day expiry)
      try {
        const cached = localStorage.getItem('togotv_citations')
        if (cached) {
          const parsed = JSON.parse(cached)
          const ONE_WEEK = 7 * 24 * 60 * 60 * 1000
          if (Date.now() - parsed.timestamp < ONE_WEEK && parsed.data && parsed.data.length > 0) {
            this.citation_list = parsed.data
            return
          }
        }
      } catch (e) {
        // localStorage unavailable or corrupt, proceed to fetch
      }

      try {
        const stripHtml = str => str
          ? str
            .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"')
            .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
            .replace(/<[^>]+>/g, '')
            .trim()
          : ''

        const EPMC_BASE = 'https://www.ebi.ac.uk/europepmc/webservices/rest/search'
        const OC_BASE = 'https://api.opencitations.net/index/v1'

        // Fetch from Europe PMC (3 queries) + OpenCitations in parallel
        const [epmcRes1, epmcRes2, epmcRes3, ocRes] = await Promise.all([
          axios.get(`${EPMC_BASE}?query=%22TogoTV%22&format=json&pageSize=100`).catch(() => null),
          axios.get(`${EPMC_BASE}?query=%22Togo+picture+gallery%22&format=json&pageSize=100`).catch(() => null),
          axios.get(`${EPMC_BASE}?query=%22togo+picture+gallery%22&format=json&pageSize=100`).catch(() => null),
          axios.get(`${OC_BASE}/citations/10.1093/bib/bbr039`).catch(() => null),
        ])

        // Collect Europe PMC results
        const paperMap = new Map()
        const epmcResults = [epmcRes1, epmcRes2, epmcRes3]
        epmcResults.forEach(res => {
          if (!res || !res.data || !res.data.resultList || !res.data.resultList.result) return
          res.data.resultList.result.forEach(item => {
            if (!item.doi) return
            if (paperMap.has(item.doi)) return
            paperMap.set(item.doi, {
              doi: item.doi,
              title: stripHtml(item.title) || 'No title',
              authors: stripHtml(item.authorString) || '',
              journal: stripHtml(item.journalTitle) || '',
              title: item.title || 'No title',
              authors: item.authorString || '',
              journal: item.journalTitle || '',
              year: item.pubYear || '',
              citedByCount: item.citedByCount || 0,
            })
          })
        })

        // Collect OpenCitations results and enrich via Europe PMC
        if (ocRes && ocRes.data && Array.isArray(ocRes.data)) {
          const ocDois = ocRes.data
            .map(c => c.citing)
            .filter(doi => doi && !paperMap.has(doi))

          const ocMetadata = await Promise.all(
            ocDois.map(doi =>
              axios
                .get(`${EPMC_BASE}?query=DOI:${encodeURIComponent(doi)}&format=json&pageSize=1`)
                .then(res => {
                  const items = res.data && res.data.resultList && res.data.resultList.result
                  if (!items || items.length === 0) return null
                  const item = items[0]
                  return {
                    doi: item.doi || doi,
                    title: item.title || 'No title',
                    authors: item.authorString || '',
                    journal: item.journalTitle || '',
                    year: item.pubYear || '',
                    citedByCount: item.citedByCount || 0,
                  }
                })
                .catch(() => null)
            )
          )

          ocMetadata.forEach(paper => {
            if (paper && paper.doi && !paperMap.has(paper.doi)) {
              paperMap.set(paper.doi, paper)
            }
          })
        }

        // Fetch manually curated DOIs from static/citations/manualcurated.txt
        try {
          const curatedRes = await axios.get('/citations/manualcurated.txt').catch(() => null)
          if (curatedRes && curatedRes.data) {
            const curatedDois = curatedRes.data
              .split('\n')
              .map(line => line.replace(/^https?:\/\/(dx\.)?doi\.org\//, '').trim())
              .filter(doi => doi && !paperMap.has(doi))

            const curatedMetadata = await Promise.all(
              curatedDois.map(async doi => {
                // Try EPMC first
                const epmcRes = await axios
                  .get(`${EPMC_BASE}?query=DOI:${encodeURIComponent(doi)}&format=json&pageSize=1`)
                  .catch(() => null)
                const items = epmcRes && epmcRes.data && epmcRes.data.resultList && epmcRes.data.resultList.result
                if (items && items.length > 0) {
                  const item = items[0]
                  return {
                    doi: item.doi || doi,
                    title: item.title || 'No title',
                    authors: item.authorString || '',
                    journal: item.journalTitle || '',
                    year: item.pubYear || '',
                    citedByCount: item.citedByCount || 0,
                    isNew: false,
                  }
                }
                // Fallback: CrossRef API (for papers not indexed in EPMC)
                return axios
                  .get(`https://api.crossref.org/works/${encodeURIComponent(doi)}`)
                  .then(res => {
                    const msg = res.data && res.data.message
                    if (!msg) return null
                    const authors = (msg.author || [])
                      .map(a => [a.family, a.given].filter(Boolean).join(' '))
                      .join(', ')
                    const pubParts = msg.published && msg.published['date-parts'] && msg.published['date-parts'][0]
                    const isNew = pubParts
                      ? (Date.now() - new Date(pubParts[0], (pubParts[1] || 1) - 1, pubParts[2] || 1).getTime()) / 86400000 <= 30
                      : false
                    return {
                      doi: (msg.DOI || doi).toLowerCase(),
                      title: (msg.title && msg.title[0]) || 'No title',
                      authors,
                      journal: (msg['container-title'] && msg['container-title'][0]) || '',
                      year: String((pubParts && pubParts[0]) || ''),
                      citedByCount: msg['is-referenced-by-count'] || 0,
                      isNew,
                    }
                  })
                  .catch(() => null)
              })
              curatedDois.map(doi =>
                axios
                  .get(`${EPMC_BASE}?query=DOI:${encodeURIComponent(doi)}&format=json&pageSize=1`)
                  .then(res => {
                    const items = res.data && res.data.resultList && res.data.resultList.result
                    if (!items || items.length === 0) return null
                    const item = items[0]
                    return {
                      doi: item.doi || doi,
                      title: item.title || 'No title',
                      authors: item.authorString || '',
                      journal: item.journalTitle || '',
                      year: item.pubYear || '',
                      citedByCount: item.citedByCount || 0,
                    }
                  })
                  .catch(() => null)
              )
            )

            curatedMetadata.forEach(paper => {
              if (paper && paper.doi && !paperMap.has(paper.doi)) {
                paperMap.set(paper.doi, paper)
              }
            })
          }
        } catch (e) {
          // manualcurated.txt not found or parse error, skip
        }

        // Sort by year descending
        const results = Array.from(paperMap.values())
          .sort((a, b) => Number(b.year) - Number(a.year))

        this.citation_list = results

        // Cache in localStorage
        try {
          localStorage.setItem(
            'togotv_citations',
            JSON.stringify({ timestamp: Date.now(), data: results })
          )
        } catch (e) {
          // localStorage full or unavailable
        }
      } catch (error) {
        console.log('citation fetch error', error)
      }
    },
  },
  components: {
    CourseList,
    VideoListHorizontalScroll,
    IllustrationList,
    CitationCarousel,
    TextSearch
  }
})
</script>

<style lang="sass" scoped>
.main
  display: flex
  align-items: center
  justify-content: center
  width: 100%
  max-width: 1464px
  margin: 0 auto
  > img
    object-fit: contain
  > .main_visual_1
    width: 32.6%
    min-width: 404px
    transform: translateY(-6px)
    z-index: 20
  > .main_visual_2
    width: 19.8%
    min-width: 233px
    transform: translateY(77px)
  > .main_text
    margin-top: 58px
    margin-left: 42px
    margin-right: 15px
    > h1
      > img.logo
        width: 327px
    > .description
      margin-bottom: 8px
      white-space: nowrap
      line-height: 24px
    > .description_list
      display: flex
      flex-wrap: wrap
      width: 342px
      font-size: 18px
      line-height: 28px
      font-weight: bold
      li
        &:last-child
          margin-left: 10px
      &.en
        width: 382px
        li
          &:last-child
            margin-left: 0px
    > .search_example
      display: flex
      align-items: center
      font-size: 12px
      margin-top: -4px
      margin-left: 14px
      text-align: center
      > .comma
        margin: 0 3px
    > .announcement
      margin-top: 20px
      width: 334px
      padding: 15px 20px
      border: 2px solid #d32f2f
      border-radius: 4px
      text-align: center
      > p
        color: #d32f2f
        font-weight: bold
        margin: 0
        line-height: 1.6
section
  padding: 15px 0
  &:nth-of-type(2)
    margin-top: 30px
    padding-top: 30px
  > h2
    margin-left: $VIEW_PADDING
    > a
      text-decoration: none
      color: $BLACK
      transition: .2s
      &:hover
        color: $MAIN_COLOR
  &.course_section > h2
    @include section_title('course')
  &.newvideo_section > h2
    @include section_title('new')
  &.realtime_view_video_section > h2
    @include section_title('barchart')
  &.illustation_section > h2
    @include section_title('img')
  &.citation_section > h2
    @include section_title('doi')

@media screen and (max-width: 896px)
  .main
    flex-direction: column
    text-align: center
    width: 100vw
    overflow: hidden
    > .main_visual_1,
    > .main_visual_2
      display: none
    > .main_text
      margin: 0
      > h1
        > img.logo
          width: 60%
      > .description
        font-size: 14px
        line-height: 20px
        white-space: break-spaces
        width: 80%
        margin: 0 auto
        > .br
          display: none
      > .description_list
        width: 100%
        justify-content: center
        font-size: 14px
        line-height: 22px
        margin-top: 12px
      > .search_example
        justify-content: center
      > .announcement
        margin: 20px 15px 0
        padding: 12px 15px
        font-size: 13px
        max-width: none
      > .input_wrapper
        &.index
          margin: 20px auto 0
  .course_section,
  .newvideo_section,
  .realtime_view_video_section,
  .illustation_section,
  .citation_section
    > h2
      margin-left: $VIEW_PADDING_SP
  </style>
