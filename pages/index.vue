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
        <div class="news_section">
          <h2 class="news_title">TogoTV ニュース</h2>
          <ul class="news_list">
            <li>
              <span class="news_date">2026.6.24</span>
              <span class="news_badge">New!</span>
              Togo pic の画像が
              <a href="https://doi.org/10.1038/s41556-026-01982-0" target="_blank" rel="noopener noreferrer">Xie et al. <em>Nature Cell Biology</em> 2026</a>
              に利用されました！
            </li>
            <li>
              <span class="news_date">2026.6.21</span>
              Togo pic の画像が
              <a href="https://doi.org/10.1126/sciadv.aed1407" target="_blank" rel="noopener noreferrer">Qu et al. <em>Science Advances</em> 2026</a>
              に利用されました！
            </li>
            <li>
              <span class="news_date">2026.6.17</span>
              Togo pic の画像が
              <a href="https://doi.org/10.1039/D6NP00011H" target="_blank" rel="noopener noreferrer">Jaczkowski et al. <em>Natural Product Reports</em> 2026</a>
              に利用されました！
            </li>
            <li>
              <span class="news_date">2026.6.11</span>
              <nuxt-link :to="localePath('/heritage-trees.html')">京都府立植物園コラボレーション企画 Heritage Trees 特設サイトオープン！</nuxt-link>
            </li>
          </ul>
        </div>
      </div>
      <img class="main_visual_2" src="~/assets/img/main_visual_2.svg" alt="">
      <!-- アクセスカウンター タコメーター (dev server only) 右上絶対配置 -->
      <div class="access_gauge_container" v-if="access_stats !== null">
        <svg class="access_gauge_svg" viewBox="0 0 180 160" xmlns="http://www.w3.org/2000/svg">
          <path :d="trackAccessPath" fill="none" stroke="#e5e7eb" stroke-width="11" stroke-linecap="round"/>
          <path
            v-if="access_stats.today > 0"
            :d="activeAccessPath"
            fill="none"
            :stroke="heatColorAccess"
            stroke-width="11"
            stroke-linecap="round"
            :class="['access_gauge_arc', { hot: access_stats.average > 0 && access_stats.today >= access_stats.average }]"
          />
          <line v-for="(tick, i) in accessTicks" :key="i" :x1="tick.x1" :y1="tick.y1" :x2="tick.x2" :y2="tick.y2" stroke="#d1d5db" stroke-width="1.5" stroke-linecap="round"/>
          <text x="90" y="72" text-anchor="middle" class="ag_today mont">{{ access_stats.today }}</text>
          <text x="90" y="87" text-anchor="middle" class="ag_label">today</text>
          <line x1="66" y1="95" x2="114" y2="95" stroke="#e9ecef" stroke-width="1"/>
          <text x="90" y="112" text-anchor="middle" class="ag_avg mont" :style="{ fill: heatColorAccess }">
            {{ access_stats.average > 0 ? access_stats.average.toFixed(1) : '—' }}
          </text>
          <text x="90" y="125" text-anchor="middle" class="ag_label">avg / day</text>
          <text x="52" y="147" text-anchor="middle" class="ag_end_label">0</text>
          <text x="128" y="147" text-anchor="middle" class="ag_end_label">avg</text>
        </svg>
        <p class="access_gauge_caption mont" v-if="access_stats.daysTracked > 0">
          {{ access_stats.total }} visits · {{ access_stats.daysTracked }}日分
        </p>
      </div>
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
    // Heritage Trees 公開予定日（この日以降は新着に通常表示）
    // ※ 公開後はこの定数を過去日付に変更するか、フィルタ処理ごと削除してください
    const HT_PUBLISH_DATE = new Date('2026-07-01T00:00:00+09:00');
    const isBeforeHTLaunch = new Date() < HT_PUBLISH_DATE;

    if (isBeforeHTLaunch) {
      // 公開前: Heritage Trees タグ画像を新着から除外
      Promise.all([
        axios.get(`https://togotv-api.dbcls.jp/api/entries?target=pictures&from=1&rows=30`),
        axios.get('https://togotv-api.dbcls.jp/api/bool_search', { params: { target: 'pictures', other_tags: 'Heritage Trees', rows: 1000 } })
      ]).then(([entriesRes, htRes]) => {
        const htIds = new Set((htRes.data.data || []).map(img => img.id));
        this.illustration_list = (entriesRes.data.data || [])
          .filter(img => {
            // IDで除外 + other_tags_commaにHeritage Treesが含まれる場合も除外
            const hasCsvTag = (img.other_tags_comma || '').includes('Heritage Trees');
            return !htIds.has(img.id) && !hasCsvTag;
          })
          .slice(0, 11);
      }).catch(error => {
        console.log('error', error);
      });
    } else {
      // 公開後: 通常どおり取得
      axios
        .get(`https://togotv-api.dbcls.jp/api/entries?target=pictures&from=1&rows=11`)
        .then(data => {
          this.illustration_list = data.data.data;
        })
        .catch(error => {
          console.log('error', error);
        });
    }
  },
  data() {
    return {
      course_list: [],
      new_video_list: [],
      realtime_video_list: [],
      illustration_list: [],
      citation_list: [],
      access_stats: null,
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
  computed: {
    heatColorAccess() {
      if (!this.access_stats || this.access_stats.average <= 0) return '#60a5fa'
      const pct = Math.min(this.access_stats.today / this.access_stats.average, 1)
      const stops = ['#60a5fa', '#34d399', '#fbbf24', '#f97316', '#ef4444']
      const idx = pct * (stops.length - 1)
      const lo = Math.floor(idx)
      const hi = Math.min(lo + 1, stops.length - 1)
      return this.lerpHex(stops[lo], stops[hi], idx - lo)
    },
    trackAccessPath() {
      return this.describeArc(90, 84, 60, 210, 150)
    },
    activeAccessPath() {
      if (!this.access_stats || this.access_stats.today <= 0) return ''
      const avg = this.access_stats.average > 0 ? this.access_stats.average : 50
      const endDeg = 210 + Math.min(this.access_stats.today / avg, 1) * 300
      return this.describeArc(90, 84, 60, 210, endDeg)
    },
    accessTicks() {
      const cx = 90, cy = 84, outerR = 60, innerR = 51
      const toRad = d => (d - 90) * Math.PI / 180
      return [0, 25, 50, 75, 100].map(pct => {
        const rad = toRad(210 + (pct / 100) * 300)
        return {
          x1: (cx + innerR * Math.cos(rad)).toFixed(2),
          y1: (cy + innerR * Math.sin(rad)).toFixed(2),
          x2: (cx + outerR * Math.cos(rad)).toFixed(2),
          y2: (cy + outerR * Math.sin(rad)).toFixed(2),
        }
      })
    },
  },
  mounted() {
    this.fetchCitations()
    if (process.client) {
      axios.get('/api/access-stats')
        .then(res => { this.access_stats = res.data })
        .catch(() => { /* not available in production */ })
    }
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
              year: item.pubYear || '',
              publishedDate: item.firstPublicationDate || '',
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
                    publishedDate: item.firstPublicationDate || '',
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
                    publishedDate: item.firstPublicationDate || '',
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
                    const publishedDate = pubParts
                      ? [pubParts[0], pubParts[1], pubParts[2]]
                          .filter(Boolean)
                          .map((v, i) => i === 0 ? String(v) : String(v).padStart(2, '0'))
                          .join('-')
                      : ''
                    return {
                      doi: (msg.DOI || doi).toLowerCase(),
                      title: (msg.title && msg.title[0]) || 'No title',
                      authors,
                      journal: (msg['container-title'] && msg['container-title'][0]) || '',
                      year: String((pubParts && pubParts[0]) || ''),
                      publishedDate,
                      citedByCount: msg['is-referenced-by-count'] || 0,
                      isNew,
                    }
                  })
                  .catch(() => null)
              })
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

        // Sort by publishedDate descending (fall back to year)
        const results = Array.from(paperMap.values())
          .sort((a, b) => {
            const da = a.publishedDate || `${a.year || '0000'}-00`
            const db = b.publishedDate || `${b.year || '0000'}-00`
            return db.localeCompare(da)
          })

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
    describeArc(cx, cy, r, startDeg, endDeg) {
      const toRad = d => (d - 90) * Math.PI / 180
      const sx = cx + r * Math.cos(toRad(startDeg))
      const sy = cy + r * Math.sin(toRad(startDeg))
      const ex = cx + r * Math.cos(toRad(endDeg))
      const ey = cy + r * Math.sin(toRad(endDeg))
      let sweep = endDeg - startDeg
      if (sweep <= 0) sweep += 360
      const large = sweep > 180 ? 1 : 0
      return `M ${sx.toFixed(2)} ${sy.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${ex.toFixed(2)} ${ey.toFixed(2)}`
    },
    lerpHex(c1, c2, t) {
      const p = c => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)]
      const [r1, g1, b1] = p(c1)
      const [r2, g2, b2] = p(c2)
      return `rgb(${Math.round(r1 + (r2 - r1) * t)},${Math.round(g1 + (g2 - g1) * t)},${Math.round(b1 + (b2 - b1) * t)})`
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
  position: relative
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
      border-left: none !important
      padding-left: 0 !important
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
    > .news_section
      margin-top: 20px
      width: 485px
      padding: 12px 16px
      border: 2px solid #1976d2
      border-radius: 4px
      > .news_title
        font-size: 15px
        font-weight: bold
        color: #1976d2
        margin: 0 0 6px
      > .news_list
        list-style: none
        margin: 0
        padding: 0
        > li
          font-size: 14px
          line-height: 1.6
          display: flex
          flex-wrap: wrap
          align-items: baseline
          gap: 4px
          & + li
            margin-top: 5px
          > .news_date
            color: #555
            white-space: nowrap
          > .news_badge
            background: #e53935
            color: #fff
            font-size: 12px
            font-weight: bold
            padding: 1px 5px
            border-radius: 3px
            white-space: nowrap
          > a
            color: #1976d2
            text-decoration: none
            &:hover
              text-decoration: underline
  > .access_gauge_container
    position: absolute
    top: 16px
    right: 16px
    display: flex
    flex-direction: column
    align-items: flex-end
    .access_gauge_svg
      width: 165px
      height: 147px
      display: block
    .ag_today
      font-size: 34px
      font-weight: 800
      fill: #1e293b
    .ag_avg
      font-size: 22px
      font-weight: 700
    .ag_label
      font-size: 10px
      fill: #94a3b8
      letter-spacing: 0.04em
    .ag_end_label
      font-size: 9px
      fill: #cbd5e1
    .access_gauge_arc
      transition: filter 0.3s ease
      &.hot
        animation: access-hot 1.8s ease-in-out infinite
    .access_gauge_caption
      font-size: 11px
      color: #94a3b8
      margin: 3px 4px 0 0
      text-align: right

@keyframes access-hot
  0%, 100%
    filter: drop-shadow(0 0 5px rgba(239, 68, 68, 0.6))
  50%
    filter: drop-shadow(0 0 14px rgba(239, 68, 68, 0.9))

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
        border-left: none !important
        padding-left: 0 !important
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
      > .news_section
        margin: 20px 15px 0
        width: auto
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
