// Force API calls to the backend proxy (avoids Vite dev server swallowing /api/*).

const BACKEND_ORIGIN = 'http://localhost:3001'

async function getJSON(url) {
  const res = await fetch(url)
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Backend error: ${res.status} ${res.statusText} ${text}`)
  }
  return res.json()
}

export const serverClient = {
  health: () => getJSON(`${BACKEND_ORIGIN}/api/health`)
}

