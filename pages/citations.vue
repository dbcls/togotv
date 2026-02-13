<template>
  <div class="citations_wrapper">
    <div class="citations_section">
      <div class="citations_header">
        <h2 class="page_title tsukushi bold">{{ $t("citing_papers") }}</h2>
        <p class="citations_count mont bold" v-if="filtered_list.length > 0">
          {{ filtered_list.length }} {{ $t("results") }}
        </p>
      </div>
      <div class="citations_controls">
        <div class="search_box">
          <input
            type="text"
            v-model="search_query"
            :placeholder="$t('text_search')"
            class="search_input"
          />
        </div>
        <div class="sort_box">
          <select v-model="sort_by" class="sort_select">
            <option value="year_desc">Year (New → Old)</option>
            <option value="year_asc">Year (Old → New)</option>
            <option value="cited_desc">Cited by (High → Low)</option>
          </select>
        </div>
      </div>
      <div class="loading" v-if="is_loading">
        <div class="loader"></div>
      </div>
      <ul class="citations_list" v-else-if="filtered_list.length > 0">
        <li
          class="citation_item"
          v-for="(paper, index) in filtered_list"
          :key="paper.doi || index"
        >
          <a
            :href="paper.doi ? `https://doi.org/${paper.doi}` : '#'"
            target="_blank"
            rel="noopener noreferrer"
            class="item_link"
          >
            <div class="item_main">
              <p class="item_title">{{ paper.title }}</p>
              <p class="item_authors">{{ paper.authors }}</p>
              <div class="item_meta">
                <span class="item_journal" v-if="paper.journal">{{ paper.journal }}</span>
                <span class="item_year mont bold" v-if="paper.year">{{ paper.year }}</span>
                <span class="item_doi mont" v-if="paper.doi">DOI: {{ paper.doi }}</span>
              </div>
            </div>
            <div class="item_cited mont bold" v-if="paper.citedByCount > 0">
              <span class="cited_count">{{ paper.citedByCount }}</span>
              <span class="cited_label">cited</span>
            </div>
          </a>
        </li>
      </ul>
      <p class="no_result" v-else-if="!is_loading">{{ $t("no_result") }}</p>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'

export default Vue.extend({
  data() {
    return {
      citation_list: [],
      search_query: '',
      sort_by: 'year_desc',
      is_loading: true,
    }
  },
  head() {
    return {
      title: this.$t("citing_papers"),
      meta: [
        { hid: 'og:title', property: 'og:title', content: this.$t("citing_papers") },
        { hid: 'og:url', property: 'og:url', content: process.client ? location.href : '' },
      ]
    }
  },
  computed: {
    filtered_list() {
      let list = this.citation_list

      // Filter by search query
      if (this.search_query) {
        const q = this.search_query.toLowerCase()
        list = list.filter(p =>
          (p.title && p.title.toLowerCase().includes(q)) ||
          (p.authors && p.authors.toLowerCase().includes(q)) ||
          (p.journal && p.journal.toLowerCase().includes(q)) ||
          (p.doi && p.doi.toLowerCase().includes(q))
        )
      }

      // Sort
      const sorted = [...list]
      if (this.sort_by === 'year_desc') {
        sorted.sort((a, b) => Number(b.year) - Number(a.year))
      } else if (this.sort_by === 'year_asc') {
        sorted.sort((a, b) => Number(a.year) - Number(b.year))
      } else if (this.sort_by === 'cited_desc') {
        sorted.sort((a, b) => Number(b.citedByCount) - Number(a.citedByCount))
      }

      return sorted
    },
  },
  mounted() {
    this.fetchCitations()
  },
  methods: {
    async fetchCitations() {
      this.is_loading = true

      // Check localStorage cache (7-day expiry)
      try {
        const cached = localStorage.getItem('togotv_citations')
        if (cached) {
          const parsed = JSON.parse(cached)
          const ONE_WEEK = 7 * 24 * 60 * 60 * 1000
          if (Date.now() - parsed.timestamp < ONE_WEEK && parsed.data && parsed.data.length > 0) {
            this.citation_list = parsed.data
            this.is_loading = false
            return
          }
        }
      } catch (e) {
        // proceed to fetch
      }

      try {
        const EPMC_BASE = 'https://www.ebi.ac.uk/europepmc/webservices/rest/search'
        const OC_BASE = 'https://api.opencitations.net/index/v1'

        const [epmcRes1, epmcRes2, epmcRes3, ocRes] = await Promise.all([
          axios.get(`${EPMC_BASE}?query=%22TogoTV%22&format=json&pageSize=100`).catch(() => null),
          axios.get(`${EPMC_BASE}?query=%22Togo+picture+gallery%22&format=json&pageSize=100`).catch(() => null),
          axios.get(`${EPMC_BASE}?query=%22togo+picture+gallery%22&format=json&pageSize=100`).catch(() => null),
          axios.get(`${OC_BASE}/citations/10.1093/bib/bbr039`).catch(() => null),
        ])

        const paperMap = new Map()
        const epmcResults = [epmcRes1, epmcRes2, epmcRes3]
        epmcResults.forEach(res => {
          if (!res || !res.data || !res.data.resultList || !res.data.resultList.result) return
          res.data.resultList.result.forEach(item => {
            if (!item.doi) return
            if (paperMap.has(item.doi)) return
            paperMap.set(item.doi, {
              doi: item.doi,
              title: item.title || 'No title',
              authors: item.authorString || '',
              journal: item.journalTitle || '',
              year: item.pubYear || '',
              citedByCount: item.citedByCount || 0,
            })
          })
        })

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

        const results = Array.from(paperMap.values())
          .sort((a, b) => Number(b.year) - Number(a.year))

        this.citation_list = results

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
      } finally {
        this.is_loading = false
      }
    },
  },
})
</script>

<style lang="sass" scoped>
.citations_wrapper
  max-width: 1000px
  margin: 0 auto
  padding: 0 $VIEW_PADDING
  .citations_header
    display: flex
    align-items: center
    justify-content: space-between
    .page_title
      @include page_title('doi')
    .citations_count
      font-size: 14px
      color: $MAIN_COLOR
  .citations_controls
    display: flex
    align-items: center
    gap: 12px
    margin: 20px 0
    .search_box
      flex: 1
      .search_input
        width: 100%
        border: 1px solid #ccc
        border-radius: 100px
        padding: 8px 16px
        font-size: 14px
        box-sizing: border-box
        &:focus
          outline: none
          border-color: $MAIN_COLOR
    .sort_box
      .sort_select
        border: 1px solid #ccc
        border-radius: 6px
        padding: 8px 12px
        font-size: 13px
        background-color: #fff
        &:focus
          outline: none
          border-color: $MAIN_COLOR
  .loading
    display: flex
    justify-content: center
    padding: 60px 0
    .loader
      @include loader
  .citations_list
    list-style: none
    padding: 0
    .citation_item
      margin-bottom: 1px
      &:last-child
        margin-bottom: 0
      .item_link
        display: flex
        align-items: flex-start
        justify-content: space-between
        padding: 18px 20px
        background-color: #fff
        border-left: 3px solid transparent
        text-decoration: none
        color: $BLACK
        transition: .2s
        &:hover
          background-color: #f5fcfd
          border-left-color: $MAIN_COLOR
        .item_main
          flex: 1
          min-width: 0
          .item_title
            font-size: 15px
            font-weight: bold
            line-height: 1.6
            margin: 0 0 6px
          .item_authors
            font-size: 12px
            color: #666
            line-height: 1.4
            margin: 0 0 6px
          .item_meta
            display: flex
            align-items: center
            flex-wrap: wrap
            gap: 8px
            .item_journal
              font-size: 12px
              color: $MAIN_COLOR
              font-weight: bold
            .item_year
              font-size: 12px
              color: #999
            .item_doi
              font-size: 11px
              color: #aaa
        .item_cited
          min-width: 50px
          text-align: center
          margin-left: 16px
          padding: 8px
          .cited_count
            display: block
            font-size: 20px
            color: $DEEP_MAIN_COLOR
          .cited_label
            display: block
            font-size: 10px
            color: #999
  .no_result
    text-align: center
    padding: 60px 0
    color: #999
    font-size: 14px

@media screen and (max-width: 896px)
  .citations_wrapper
    padding: 0 $VIEW_PADDING_SP
    .citations_controls
      flex-direction: column
      .search_box
        width: 100%
      .sort_box
        width: 100%
        .sort_select
          width: 100%
    .citations_list
      .citation_item
        .item_link
          flex-direction: column
          padding: 14px 16px
          .item_main
            .item_title
              font-size: 14px
            .item_meta
              gap: 6px
          .item_cited
            margin-left: 0
            margin-top: 8px
            display: flex
            align-items: center
            gap: 4px
            .cited_count
              display: inline
              font-size: 14px
            .cited_label
              display: inline
              font-size: 11px
</style>
