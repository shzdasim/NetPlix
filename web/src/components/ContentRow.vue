<template>
  <section class="row">
    <h2>{{ title }}</h2>

    <div v-if="loading" class="carousel placeholder" aria-busy="true">
      <div
        v-for="n in skeletonCount"
        :key="n"
        class="card placeholder-card carousel__item"
      />
    </div>

    <div v-else class="carousel" role="list">
      <MediaCard
        v-for="m in items"
        :key="m.id"
        class="carousel__item"
        :mediaType="mediaType"
        :id="m.id"
        :title="m.title"
        :posterUrl="m.poster_url"
        v-bind="mediaType === 'tv' ? { season: tvSeason, episode: tvEpisode } : {}"
      />
    </div>
  </section>
</template>


<script setup>
import MediaCard from './MediaCard.vue'

const props = defineProps({
  title: { type: String, required: true },
  mediaType: {
    type: String,
    required: true,
    validator: (v) => ['movie', 'tv'].includes(v),
  },
  loading: { type: Boolean, default: false },
  items: { type: Array, default: () => [] },
  skeletonCount: { type: Number, default: 12 },

  // TV-specific (used only for tv rows)
  tvSeason: { type: [String, Number], default: 1 },
  tvEpisode: { type: [String, Number], default: 1 },
})
</script>

