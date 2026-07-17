<template>
  <div class="card carousel-card">
    <img
      :src="posterUrl"
      :alt="title"
      class="card__img"
      loading="lazy"
    />

    <div class="card__title">{{ title }}</div>

    <RouterLink v-if="playTo" class="card__play" :to="playTo">
      Play
    </RouterLink>
  </div>
</template>


<script setup>
import { computed } from 'vue'

const props = defineProps({
  mediaType: {
    type: String,
    required: true,
    validator: (v) => ['movie', 'tv'].includes(v),
  },
  id: {
    type: [String, Number],
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
  posterUrl: {
    type: String,
    default: '',
  },
  season: {
    type: [String, Number],
    default: 1,
  },
  episode: {
    type: [String, Number],
    default: 1,
  },
})

const playTo = computed(() => {
  if (!props.id) return ''

  if (props.mediaType === 'movie') {
    return `/watch/movie/${props.id}?autoplay=true&colour=00ff9d`
  }

  return `/watch/tv/${props.id}?season=${encodeURIComponent(
    props.season
  )}&episode=${encodeURIComponent(props.episode)}&autoplay=true&colour=00ff9d`
})
</script>

