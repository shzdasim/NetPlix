<template>
  <div class="page">
    <h1 class="title">Movies</h1>
    <p class="subtitle">Latest + Popular</p>

    <div class="cards-grid" aria-busy="movieLoading">
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
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import MediaCard from '../components/MediaCard.vue'
import { tmdbClient } from '../services/tmdbClient'


const posterBase = 'https://image.tmdb.org/t/p/w342'

const movieLoading = ref(false)
const page = ref(1)
const hasMore = ref(true)
const items = ref([])


function mapMovie(m) {
  return {
    id: m.id,
    title: m.title || m.name,
    poster_url: m.poster_path ? `${posterBase}${m.poster_path}` : '',
    _release_date: m.release_date || '',
    _popularity: m.popularity || 0,
  }
}

function sortMerged(list) {
  return [...list].sort((a, b) => {
    const da = a._release_date ? new Date(a._release_date).getTime() : 0
    const db = b._release_date ? new Date(b._release_date).getTime() : 0

    if (db !== da) return db - da
    return (b._popularity || 0) - (a._popularity || 0)
  })
}



async function fetchPage(nextPage) {
  // “latest” approximation using upcoming (release_date)
  const [latestRes, popularRes] = await Promise.all([
    tmdbClient.upcomingMovies({ page: nextPage }),
    tmdbClient.popularMovies({ page: nextPage }),
  ])

  const latestResults = latestRes?.results || []
  const popularResults = popularRes?.results || []

  // Merge, dedupe by id.
  const mergedById = new Map()
  for (const m of [...latestResults, ...popularResults]) {
    const mapped = mapMovie(m)
    if (!mergedById.has(mapped.id)) mergedById.set(mapped.id, mapped)
    else {
      // Prefer entries with a poster.
      const existing = mergedById.get(mapped.id)
      if (!existing.poster_url && mapped.poster_url) mergedById.set(mapped.id, mapped)
    }
  }

  const merged = sortMerged([...mergedById.values()])
  return merged.map(({ _release_date, _popularity, ...rest }) => rest)
}

async function loadMore() {
  if (movieLoading.value || !hasMore.value) return

  movieLoading.value = true
  try {
    const nextPage = page.value + 0
    const newItems = await fetchPage(nextPage)

    if (newItems.length === 0) {
      hasMore.value = false
      return
    }

    // Append.
    items.value = [...items.value, ...newItems]
    page.value = nextPage + 1
  } catch (e) {
    console.error(e)
  } finally {
    movieLoading.value = false
  }
}

onMounted(async () => {
  movieLoading.value = true
  try {
    const firstItems = await fetchPage(page.value)
    items.value = firstItems
    if (firstItems.length === 0) hasMore.value = false
  } catch (e) {
    console.error(e)
  } finally {
    movieLoading.value = false
  }
})
</script>

<style scoped>
.page {
  padding: 24px;
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
  .cards-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>

