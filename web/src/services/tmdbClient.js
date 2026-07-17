/*
 * TMDb client (through our backend proxy).
 * The backend keeps TMDb credentials off the browser.
 */

const BACKEND_ORIGIN = 'http://localhost:3001'
const API_BASE = `${BACKEND_ORIGIN}/api/tmdb`

async function getJSON(path) {
  const res = await fetch(`${API_BASE}${path}`)
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`TMDb proxy error: ${res.status} ${res.statusText} ${text}`)
  }
  return res.json()
}


export const tmdbClient = {
  trendingMovie: () => getJSON('/trending/movie'),
  trendingTv: () => getJSON('/trending/tv'),
  popularMovies: ({ page = 1 } = {}) => getJSON(`/movie/popular?page=${encodeURIComponent(page)}`),
  popularTv: ({ page = 1 } = {}) => getJSON(`/tv/popular?page=${encodeURIComponent(page)}`),
  upcomingMovies: ({ page = 1 } = {}) => getJSON(`/movie/upcoming?page=${encodeURIComponent(page)}`),
  nowPlayingMovies: ({ page = 1 } = {}) => getJSON(`/movie/now_playing?page=${encodeURIComponent(page)}`),
  airingTodayTv: ({ page = 1 } = {}) => getJSON(`/tv/airing_today?page=${encodeURIComponent(page)}`),

  searchMovie: ({ q, page = 1 } = {}) => getJSON(`/search/movie?q=${encodeURIComponent(q)}&page=${encodeURIComponent(page)}`),
  searchTv: ({ q, page = 1 } = {}) => getJSON(`/search/tv?q=${encodeURIComponent(q)}&page=${encodeURIComponent(page)}`),

  movieDetails: ({ id } = {}) => getJSON(`/movie/${encodeURIComponent(id)}`),
  tvDetails: ({ id } = {}) => getJSON(`/tv/${encodeURIComponent(id)}`)
}
