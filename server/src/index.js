import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3001

const TMDB_API_KEY = process.env.TMDB_API_KEY
const TMDB_READ_TOKEN = process.env.TMDB_READ_ACCESS_TOKEN

if (!TMDB_API_KEY && !TMDB_READ_TOKEN) {
  console.warn(
    '[netplix-server] Missing TMDB credentials. Set TMDB_API_KEY or TMDB_READ_ACCESS_TOKEN in environment.'
  )
}

function tmdbHeaders() {
  // TMDb supports Bearer token style (v4 read access token) and/or API key.
  // We'll attach both when available.
  const headers = {
    accept: 'application/json'
  }

  if (TMDB_READ_TOKEN) {
    headers.Authorization = `Bearer ${TMDB_READ_TOKEN}`
  }

  // API key for some endpoints; bearer should work for most.
  if (TMDB_API_KEY) {
    headers['X-API-KEY'] = TMDB_API_KEY
  }

  return headers
}

async function tmdbFetch(pathWithQuery) {
  const url = `https://api.themoviedb.org/3${pathWithQuery}`
  const res = await fetch(url, {
    headers: tmdbHeaders()
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    const err = new Error(`TMDb request failed: ${res.status} ${res.statusText}`)
    err.details = text
    throw err
  }

  return res.json()
}

// ---- Lists ----
app.get('/api/tmdb/trending/movie', async (req, res) => {
  const data = await tmdbFetch('/trending/movie/day')
  res.json(data)
})

app.get('/api/tmdb/trending/tv', async (req, res) => {
  const data = await tmdbFetch('/trending/tv/day')
  res.json(data)
})

app.get('/api/tmdb/movie/popular', async (req, res) => {
  const page = req.query.page || 1
  const data = await tmdbFetch(`/movie/popular?page=${encodeURIComponent(page)}`)
  res.json(data)
})

app.get('/api/tmdb/tv/popular', async (req, res) => {
  const page = req.query.page || 1
  const data = await tmdbFetch(`/tv/popular?page=${encodeURIComponent(page)}`)
  res.json(data)
})

app.get('/api/tmdb/movie/upcoming', async (req, res) => {
  const page = req.query.page || 1
  const data = await tmdbFetch(`/movie/upcoming?page=${encodeURIComponent(page)}`)
  res.json(data)
})

app.get('/api/tmdb/tv/airing_today', async (req, res) => {
  const page = req.query.page || 1
  const data = await tmdbFetch(`/tv/airing_today?page=${encodeURIComponent(page)}`)
  res.json(data)
})

// ---- Search ----
app.get('/api/tmdb/search/movie', async (req, res) => {
  const q = req.query.q
  if (!q) return res.status(400).json({ error: 'q is required' })
  const page = req.query.page || 1
  const data = await tmdbFetch(`/search/movie?query=${encodeURIComponent(q)}&page=${encodeURIComponent(page)}`)
  res.json(data)
})

app.get('/api/tmdb/search/tv', async (req, res) => {
  const q = req.query.q
  if (!q) return res.status(400).json({ error: 'q is required' })
  const page = req.query.page || 1
  const data = await tmdbFetch(`/search/tv?query=${encodeURIComponent(q)}&page=${encodeURIComponent(page)}`)
  res.json(data)
})

// ---- Details ----
app.get('/api/tmdb/movie/:id', async (req, res) => {
  const data = await tmdbFetch(`/movie/${encodeURIComponent(req.params.id)}?append_to_response=credits`)
  res.json(data)
})

app.get('/api/tmdb/tv/:id', async (req, res) => {
  const data = await tmdbFetch(`/tv/${encodeURIComponent(req.params.id)}?append_to_response=credits`)
  res.json(data)
})

app.get('/api/health', (req, res) => res.json({ ok: true }))

app.get('/api', (req, res) => {
  res.json({ ok: true, service: 'netplix-server', routes: true })
})

app.listen(PORT, () => {
  console.log(`[netplix-server] listening on http://localhost:${PORT}`)
})


