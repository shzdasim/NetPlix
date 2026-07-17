/*
 * Metadata client placeholder.
 *
 * IMDb official developer APIs require auth and are not directly “free” in most cases.
 * For now, we scaffold a metadata client interface so we can plug in whichever
 * free IMDb/TV metadata provider you choose.
 */

async function notConfigured() {
  throw new Error(
    'Metadata API not configured. Please plug in an IMDb/TV metadata provider (trending/new/popular/search/details).'
  )
}

export const metadataClient = {
  // Lists
  trendingMovies: notConfigured,
  trendingTv: notConfigured,
  popularMovies: notConfigured,
  popularTv: notConfigured,
  newReleasesMovies: notConfigured,
  comingSoonTv: notConfigured,

  // Search + details
  search: notConfigured,
  movieDetails: notConfigured,
  tvDetails: notConfigured
}

