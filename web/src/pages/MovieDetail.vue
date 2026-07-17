<template>
  <div class="page">
    <div class="detail">
      <div class="detail__hero placeholder-card" />

      <div class="detail__meta">
        <div class="detail__title placeholder-line" />
        <div class="detail__sub placeholder-line" />

        <div class="detail__actions">
          <div class="button placeholder-line">Play</div>
          <div class="button button--ghost placeholder-line">More Info</div>
        </div>

        <div class="detail__desc placeholder-line" />
      </div>
    </div>

    <section class="row">
      <h2>More Like This</h2>
      <div class="grid placeholder">
        <div v-for="n in 10" :key="n" class="card placeholder-card" />
      </div>
    </section>
  </div>
</template>

<script setup>
// Skeleton only for Milestone C.
// Data + layout will be wired in later milestones.
</script>


