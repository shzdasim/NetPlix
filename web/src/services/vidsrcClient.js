/*
 * Vidsrc client (docs: https://vidsrc.ru/docs)
 * Docs in this repo are limited to iframe-based endpoints.
 * We provide helpers to generate the correct player URL.
 */

const BASE_URL = 'https://vidsrc.ru'

/**
 * @param {Object} params
 * @param {'movie'|'tv'} params.type
 * @param {string|number} params.id - TMDB id (number) or IMDb id (string like tt123)
 * @param {Object<string, string|number|boolean>} [params.query]
 */
function buildQueryString(query = {}) {
  const usp = new URLSearchParams()
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined || v === null) continue
    if (typeof v === 'boolean') {
      // Vidsrc expects true/false style query values
      usp.set(k, v ? 'true' : 'false')
    } else {
      usp.set(k, String(v))
    }
  }
  const qs = usp.toString()
  return qs ? `?${qs}` : ''
}

/**
 * Movie player iframe URL.
 * Example: /movie/299534?autoplay=true
 */
export function buildMovieEmbedUrl({ id, query } = {}) {
  if (!id) throw new Error('buildMovieEmbedUrl: id is required')
  return `${BASE_URL}/movie/${encodeURIComponent(id)}${buildQueryString(query)}`
}

/**
 * TV player iframe URL.
 * Docs examples:
 * - /tv/1396/1/1
 * - /tv/tt0903747/1/1
 *
 * @param {Object} params
 * @param {string|number} params.id - TMDB or IMDb
 * @param {number|string} params.season
 * @param {number|string} params.episode
 * @param {Object<string, string|number|boolean>} [params.query]
 */
export function buildTvEmbedUrl({ id, season, episode, query } = {}) {
  if (!id) throw new Error('buildTvEmbedUrl: id is required')
  if (season === undefined || season === null) {
    throw new Error('buildTvEmbedUrl: season is required')
  }
  if (episode === undefined || episode === null) {
    throw new Error('buildTvEmbedUrl: episode is required')
  }

  return `${BASE_URL}/tv/${encodeURIComponent(id)}/${encodeURIComponent(season)}/${encodeURIComponent(episode)}${buildQueryString(query)}`
}

/**
 * Convenience: generate a watch embed URL based on route params.
 *
 * Expected usage:
 * - For /watch/movie/:id -> { type:'movie', id, query }
 * - For /watch/tv/:id?season=1&episode=1 -> uses query season/episode.
 */
export function buildWatchEmbedUrl({ type, id, query = {} } = {}) {
  if (type === 'movie') {
    return buildMovieEmbedUrl({ id, query })
  }

  if (type === 'tv') {
    const season = query.season
    const episode = query.episode

    // remove local-only keys so they don't get sent twice
    const { season: _s, episode: _e, ...rest } = query
    return buildTvEmbedUrl({ id, season, episode, query: rest })
  }

  throw new Error(`buildWatchEmbedUrl: invalid type: ${type}`)
}

