<template>
  <div class="page">
    <div class="hero hero--featured" aria-label="Featured slider">
      <div class="hero__shade" />

      <div class="hero__slides" :style="slidesStyle">
        <div
          v-for="(s, idx) in slides"
          :key="`${s.mediaType}-${s.id}-${idx}`"
          class="hero__slide"
          :class="{ 'is-active': idx === activeSlideIndex }"
          :style="getSlideStyle(s)"
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

      <div class="hero__progress" aria-label="Slide selector">
        <button
          v-for="(_, idx) in slides"
          :key="idx"
          type="button"
          class="hero__dot"
          :class="{ 'is-active': idx === activeSlideIndex }"
          :aria-label="`Go to slide ${idx + 1}`"
          @click="goTo(idx)"
        />
      </div>

    </div>


    <ContentRow
      title="Latest Movies"
      mediaType="movie"
      :loading="movieRows.loading"
      :items="movieRows.items"
    />

    <ContentRow
      title="Latest TV Series"
      mediaType="tv"
      :loading="tvRows.loading"
      :items="tvRows.items"
      :tvSeason="1"
      :tvEpisode="1"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, reactive } from 'vue'

import { tmdbClient } from '../services/tmdbClient'
import ContentRow from '../components/ContentRow.vue'

const posterBase = 'https://image.tmdb.org/t/p/w342'
const backdropBase = 'https://image.tmdb.org/t/p/original'

const movieRows = reactive({ loading: true, items: [] })
const tvRows = reactive({ loading: true, items: [] })

const slides = reactive([])
const activeSlideIndex = reactive({ value: 0 })

const featured = reactive({
  mediaType: 'movie',
  id: null,
  title: 'Loading...',
  overview: '',
  backdropPath: '',
})


function mapMovie(m) {
  return {
    id: m.id,
    title: m.title || m.name,
    poster_url: m.poster_path ? `${posterBase}${m.poster_path}` : '',
  }
}

function mapFeatured(m, mediaType) {
  return {
    mediaType,
    id: m?.id ?? null,
    title: m?.title || m?.name || 'Untitled',
    overview: m?.overview || ' ',
    // prefer backdrop for big slide
    backdropPath: m?.backdrop_path || m?.poster_path || '',
  }
}

const slidesStyle = computed(() => ({
  // translate based on active slide
  transform: `translateX(${-activeSlideIndex.value * 100}%)`,
}))

function getSlideStyle(s) {
  const backdropPath = s?.backdropPath
  if (!backdropPath) return {}
  const url = backdropPath.startsWith('http')
    ? backdropPath
    : `${backdropBase}${backdropPath}`
  return { backgroundImage: `url(${url})` }
}


function goPrev() {
  if (!slides.length) return
  activeSlideIndex.value =
    (activeSlideIndex.value - 1 + slides.length) % slides.length
  Object.assign(featured, slides[activeSlideIndex.value])
}

function goNext() {
  if (!slides.length) return
  activeSlideIndex.value = (activeSlideIndex.value + 1) % slides.length
  Object.assign(featured, slides[activeSlideIndex.value])
}

function goTo(idx) {
  if (!slides.length) return
  const next = ((idx % slides.length) + slides.length) % slides.length
  activeSlideIndex.value = next
  Object.assign(featured, slides[activeSlideIndex.value])
}


const featuredPlayTo = computed(() => {
  if (!featured.id) return ''
  if (featured.mediaType === 'movie') {
    return `/watch/movie/${featured.id}?autoplay=true&colour=00ff9d`
  }
  return `/watch/tv/${featured.id}?season=1&episode=1&autoplay=true&colour=00ff9d`
})

const featuredInfoTo = computed(() => {
  if (!featured.id) return ''
  if (featured.mediaType === 'movie') return `/movie/${featured.id}`
  return `/tv/${featured.id}`
})

onMounted(async () => {
  try {
    const [movies, tv] = await Promise.all([
      tmdbClient.trendingMovie(),
      tmdbClient.trendingTv(),
    ])

    const movieResults = movies?.results || []
    const tvResults = tv?.results || []

    movieRows.items = movieResults.slice(0, 12).map(mapMovie)
    tvRows.items = tvResults.slice(0, 12).map(mapMovie)

    // Build a small slide deck (mix movies + tv)
    const deck = []
    for (const m of movieResults.slice(0, 3)) deck.push(mapFeatured(m, 'movie'))
    for (const t of tvResults.slice(0, 2)) deck.push(mapFeatured(t, 'tv'))

    slides.splice(0, slides.length, ...deck)

    if (slides.length) {
      Object.assign(featured, slides[0])
    }

    // Auto-rotate like Netflix hero slider
    const interval = setInterval(() => {
      if (!slides.length) return
      activeSlideIndex.value = (activeSlideIndex.value + 1) % slides.length
      Object.assign(featured, slides[activeSlideIndex.value])
    }, 7000)

    onBeforeUnmount(() => clearInterval(interval))


  } catch (e) {
    console.error(e)
  } finally {
    movieRows.loading = false
    tvRows.loading = false
  }
})

</script>





