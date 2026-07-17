<template>
  <div class="page">
    <div class="hero hero--featured" aria-label="Latest movies slider">
      <div class="hero__shade" />

      <div class="hero__slides" :style="slidesStyle">
        <div
          v-for="(movie, idx) in slides"
          :key="`${movie.mediaType}-${movie.id}-${idx}`"
          class="hero__slide"
          :class="{ 'is-active': idx === activeSlideIndex }"
          :style="getSlideStyle(movie)"
        />
      </div>

      <div class="hero__content">
        <div class="hero__eyebrow">NETPLIX</div>

        <h2 class="hero__headline">{{ featured.title }}</h2>
        <p class="hero__sub">{{ featured.overview }}</p>

        <div class="hero__actions">
          <RouterLink class="button button--primary" :to="featuredPlayTo">
            Play
          </RouterLink>

          <RouterLink class="button button--ghost" :to="featuredInfoTo">
            More Info
          </RouterLink>
        </div>
      </div>

      <button
        class="hero__arrow hero__arrow--left"
        type="button"
        aria-label="Previous slide"
        @click="goPrev"
      >
        ‹
      </button>

      <button
        class="hero__arrow hero__arrow--right"
        type="button"
        aria-label="Next slide"
        @click="goNext"
      >
        ›
      </button>

      <div class="hero__selector" aria-label="Slide selector">
        <button
          v-for="(movie, idx) in slides"
          :key="idx"
          type="button"
          class="hero__tab"
          :class="{ 'is-active': idx === activeSlideIndex }"
          @click="goTo(idx)"
        >
          {{ movie.title || `Slide ${idx + 1}` }}
        </button>
      </div>
    </div>

    <section class="movies__section movies__section--rows">
      <ContentRow
        title="Trending Movies"
        mediaType="movie"
        :loading="rowState.trending.loading"
        :items="rowState.trending.items"
      />

      <ContentRow
        title="Most Watched Movies"
        mediaType="movie"
        :loading="rowState.popular.loading"
        :items="rowState.popular.items"
      />

      <ContentRow
        title="Latest Movies"
        mediaType="movie"
        :loading="rowState.latest.loading"
        :items="rowState.latest.items"
      />
    </section>

    <section class="movies__section">
      <div class="movies__header">
        <h1 class="title">Latest Movies</h1>
        <p class="subtitle">Fresh releases from the TMDb now playing feed.</p>
      </div>

      <div class="cards-grid" :aria-busy="movieLoading">
        <MediaCard
          v-for="m in items"
          :key="m.id"
          :mediaType="'movie'"
          :id="m.id"
          :title="m.title"
          :posterUrl="m.poster_url"
          class="cards-grid__item"
        />

        <div v-if="movieLoading" class="cards-grid__skeleton">
          <div v-for="n in 10" :key="n" class="skeleton card" />
        </div>
      </div>

      <div class="load-more-wrap">
        <button
          class="button button--ghost"
          :disabled="movieLoading || !hasMore"
          @click="loadMore"
        >
          {{ movieLoading ? 'Loading...' : hasMore ? 'Load more movies' : 'No more movies' }}
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import ContentRow from '../components/ContentRow.vue'
import MediaCard from '../components/MediaCard.vue'
import { tmdbClient } from '../services/tmdbClient'

const posterBase = 'https://image.tmdb.org/t/p/w342'
const backdropBase = 'https://image.tmdb.org/t/p/original'

const movieLoading = ref(false)
const page = ref(1)
const hasMore = ref(true)
const items = ref([])

const slides = reactive([])
const activeSlideIndex = ref(0)
const featured = reactive({
  mediaType: 'movie',
  id: null,
  title: 'Loading latest movies...',
  overview: '',
  backdropPath: '',
})

const rowState = reactive({
  trending: { loading: true, items: [] },
  popular: { loading: true, items: [] },
  latest: { loading: true, items: [] },
})

let rotationId = null

function mapMovie(m) {
  return {
    id: m.id,
    title: m.title || m.name,
    poster_url: m.poster_path ? `${posterBase}${m.poster_path}` : '',
    _release_date: m.release_date || '',
    _popularity: m.popularity || 0,
    _backdrop_path: m.backdrop_path || m.poster_path || '',
    _overview: m.overview || '',
  }
}

function loadRowData(source, targetKey) {
  return source
    .then((res) => {
      rowState[targetKey].items = (res?.results || []).slice(0, 12).map(mapMovie)
    })
    .catch((e) => {
      console.error(e)
    })
    .finally(() => {
      rowState[targetKey].loading = false
    })
}

function mapFeatured(m) {
  return {
    mediaType: 'movie',
    id: m?.id ?? null,
    title: m?.title || m?.name || 'Untitled',
    overview: m?.overview || ' ',
    backdropPath: m?.backdrop_path || m?.poster_path || '',
  }
}

const slidesStyle = computed(() => ({
  transform: `translateX(${-activeSlideIndex.value * 100}%)`,
}))

function getSlideStyle(movie) {
  const backdropPath = movie?.backdropPath
  if (!backdropPath) return {}

  const url = backdropPath.startsWith('http') ? backdropPath : `${backdropBase}${backdropPath}`
  return { backgroundImage: `url(${url})` }
}

function setFeatured(index) {
  if (!slides.length) return

  const next = ((index % slides.length) + slides.length) % slides.length
  activeSlideIndex.value = next
  Object.assign(featured, slides[next])
}

function goPrev() {
  if (!slides.length) return
  setFeatured(activeSlideIndex.value - 1)
}

function goNext() {
  if (!slides.length) return
  setFeatured(activeSlideIndex.value + 1)
}

function goTo(idx) {
  if (!slides.length) return
  setFeatured(idx)
}

const featuredPlayTo = computed(() => {
  if (!featured.id) return ''
  return `/watch/movie/${featured.id}?autoplay=true&colour=00ff9d`
})

const featuredInfoTo = computed(() => {
  if (!featured.id) return ''
  return `/movie/${featured.id}`
})

function sortRawLatest(list) {
  return [...list].sort((a, b) => {
    const da = a?.release_date ? new Date(a.release_date).getTime() : 0
    const db = b?.release_date ? new Date(b.release_date).getTime() : 0

    if (db !== da) return db - da
    return (b?.popularity || 0) - (a?.popularity || 0)
  })
}

async function fetchPage(nextPage) {
  const res = await tmdbClient.nowPlayingMovies({ page: nextPage })
  const rawResults = sortRawLatest(res?.results || [])
  return {
    rawResults,
    items: rawResults.map(mapMovie),
  }
}

async function loadMore() {
  if (movieLoading.value || !hasMore.value) return

  movieLoading.value = true
  try {
    const nextPage = page.value + 1
    const { items: newItems } = await fetchPage(nextPage)

    if (newItems.length === 0) {
      hasMore.value = false
      return
    }

    items.value = [...items.value, ...newItems]
    page.value = nextPage
  } catch (e) {
    console.error(e)
  } finally {
    movieLoading.value = false
  }
}

onMounted(async () => {
  movieLoading.value = true
  try {
    const [trendTask, popularTask, latestTask] = [
      loadRowData(tmdbClient.trendingMovie(), 'trending'),
      loadRowData(tmdbClient.popularMovies(), 'popular'),
    ]

    const { rawResults, items: firstItems } = await fetchPage(page.value)
    items.value = firstItems

    slides.splice(0, slides.length, ...rawResults.slice(0, 5).map(mapFeatured))
    if (slides.length) {
      setFeatured(0)
    }

    rowState.latest.items = rawResults.slice(0, 12).map(mapMovie)
    rowState.latest.loading = false

    if (firstItems.length === 0) {
      hasMore.value = false
    }

    rotationId = window.setInterval(() => {
      if (!slides.length) return
      setFeatured(activeSlideIndex.value + 1)
    }, 7000)

    await Promise.allSettled([trendTask, popularTask])
  } catch (e) {
    console.error(e)
    rowState.latest.loading = false
  } finally {
    movieLoading.value = false
  }
})

onBeforeUnmount(() => {
  if (rotationId) window.clearInterval(rotationId)
})
</script>

<style scoped>
.page {
  padding: 0;
}

.hero__selector {
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 18px;
  z-index: 6;
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
  pointer-events: none;
}

.hero__tab {
  pointer-events: auto;
  min-width: 44px;
  max-width: 170px;
  height: 34px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.85);
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.2px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.24);
  transition:
    transform 180ms ease,
    background 180ms ease,
    border-color 180ms ease,
    color 180ms ease,
    box-shadow 180ms ease;
}

.hero__tab.is-active {
  background: rgba(255, 255, 255, 0.92);
  border-color: rgba(255, 255, 255, 0.5);
  color: #000;
  box-shadow: 0 10px 28px rgba(0, 255, 157, 0.24);
  transform: translateY(-1px);
}

.hero__tab:hover {
  transform: translateY(-1px);
}

.movies__section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.movies__section--rows {
  padding-top: 8px;
  padding-bottom: 0;
}

.movies__header {
  margin-bottom: 18px;
}

.cards-grid {
  margin-top: 18px;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
}

.cards-grid__item {
  width: 100%;
}

.load-more-wrap {
  margin-top: 22px;
  display: flex;
  justify-content: center;
}

.cards-grid__skeleton {
  grid-column: 1 / -1;
  display: contents;
}

.skeleton {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  animation: pulse 1.4s ease-in-out infinite;
  aspect-ratio: 16 / 9;
}

@media (max-width: 1100px) {
  .cards-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 680px) {
  .movies__section {
    padding: 18px 16px 24px;
  }

  .cards-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
