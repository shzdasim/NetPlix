<template>
  <div class="page">
    <h1 class="title">Browse</h1>
    <p class="subtitle">Netflix-style browse UI (rows + cards). Filters/search later.</p>

    <ContentRow
      title="Trending Movies"
      mediaType="movie"
      :loading="movieRows.loading"
      :items="movieRows.items"
    />

    <ContentRow
      title="Trending TV"
      mediaType="tv"
      :loading="tvRows.loading"
      :items="tvRows.items"
      :tvSeason="1"
      :tvEpisode="1"
    />
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import ContentRow from '../components/ContentRow.vue'
import { tmdbClient } from '../services/tmdbClient'

const posterBase = 'https://image.tmdb.org/t/p/w342'

const movieRows = reactive({ loading: true, items: [] })
const tvRows = reactive({ loading: true, items: [] })

function mapMovie(m) {
  return {
    id: m.id,
    title: m.title || m.name,
    poster_url: m.poster_path ? `${posterBase}${m.poster_path}` : '',
  }
}

onMounted(async () => {
  try {
    const [movies, tv] = await Promise.all([
      tmdbClient.trendingMovie(),
      tmdbClient.trendingTv(),
    ])

    movieRows.items = (movies?.results || []).slice(0, 12).map(mapMovie)
    tvRows.items = (tv?.results || []).slice(0, 12).map(mapMovie)
  } catch (e) {
    console.error(e)
  } finally {
    movieRows.loading = false
    tvRows.loading = false
  }
})
</script>


