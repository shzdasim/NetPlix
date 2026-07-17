<template>
  <div class="page">
    <h1 class="title">Watch</h1>
    <p class="subtitle">Type: {{ type }} — ID: {{ id }}</p>

    <div v-if="embedUrl" class="player">
      <div class="player-inner">
        <iframe
          class="player-iframe"
          :src="embedUrl"
          allow="autoplay; encrypted-media"
          allowfullscreen
        ></iframe>
      </div>
    </div>

    <div v-else class="player">
      <div class="player-inner">
        <p>Select a valid title to start playback.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { buildWatchEmbedUrl } from '../services/vidsrcClient'

const route = useRoute()

const type = computed(() => route.params.type)
const id = computed(() => route.params.id)

const embedUrl = computed(() => {
  if (!type.value || !id.value) return ''

  // For TV: season + episode should be passed as query params (?season=1&episode=1)
  const season = route.query.season
  const episode = route.query.episode

  const query = {
    autoplay: false,
    // keep vidsrc defaults; user can override by adding more params later
  }

  if (type.value === 'tv') {
    query.season = season
    query.episode = episode
  }

  return buildWatchEmbedUrl({ type: type.value, id: id.value, query })
})
</script>

