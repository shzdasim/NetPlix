<template>
  <section class="row">
    <div class="row__header">
      <h2>{{ title }}</h2>
    </div>

    <div class="row__rail">
      <div class="row__controls" aria-label="Row controls">
        <button
          class="row__arrow row__arrow--left"
          type="button"
          aria-label="Scroll row left"
          @click="scrollBy(-1)"
        >
          ‹
        </button>

        <button
          class="row__arrow row__arrow--right"
          type="button"
          aria-label="Scroll row right"
          @click="scrollBy(1)"
        >
          ›
        </button>
      </div>

      <div ref="carouselRef" class="carousel" :class="{ placeholder: loading }" :aria-busy="loading">
        <template v-if="loading">
          <div
            v-for="n in skeletonCount"
            :key="n"
            class="card placeholder-card carousel__item"
          />
        </template>

        <template v-else>
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
        </template>
      </div>
    </div>
  </section>
</template>


<script setup>
import { ref } from 'vue'
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

const carouselRef = ref(null)

function scrollBy(direction) {
  const el = carouselRef.value
  if (!el || el.scrollWidth <= el.clientWidth) return

  const amount = Math.max(320, Math.round(el.clientWidth * 0.8))
  el.scrollBy({
    left: direction * amount,
    behavior: 'smooth',
  })
}
</script>
