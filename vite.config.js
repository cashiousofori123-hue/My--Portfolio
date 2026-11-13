import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// Runs the /api server functions (the chat assistant) inside `npm run dev`, the way Vercel runs them when the site
// is live. Each file in api/ exports a function per method, e.g. export async function POST(request) { ... }.
function localApi() {
  return {
    name: 'local-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url, 'http://localhost')
        if (!url.pathname.startsWith('/api/')) return next()
        const name = url.pathname.slice(5).replace(/\/+$/, '')
        let handler
        try {
          if (!/^[a-z0-9-]+$/.test(name)) throw new Error('bad name')
          handler = (await server.ssrLoadModule(`/api/${name}.js`))[req.method]
        } catch {
          handler = null
        }
        if (!handler) {
          res.statusCode = 404
          return res.end('Not found')
        }
        const chunks = []
        for await (const c of req) chunks.push(c)
        const headers = new Headers()
        for (const [k, v] of Object.entries(req.headers)) if (v != null) headers.set(k, Array.isArray(v) ? v.join(', ') : v)
        const hasBody = !['GET', 'HEAD'].includes(req.method)
        try {
          const response = await handler(new Request(url, { method: req.method, headers, body: hasBody ? Buffer.concat(chunks) : undefined }))
          res.statusCode = response.status
          response.headers.forEach((v, k) => res.setHeader(k, v))
          if (response.body) for await (const chunk of response.body) res.write(chunk)
          res.end()
        } catch (e) {
          console.error(e)
          if (!res.headersSent) res.statusCode = 500
          res.end('Server error')
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Server-only keys from .env (like GOOGLE_GENERATIVE_AI_API_KEY) reach the /api functions during local work.
  const env = loadEnv(mode, process.cwd(), '')
  for (const k of Object.keys(env)) if (!(k in process.env)) process.env[k] = env[k]
  return {
    plugins: [react(), localApi()],
  }
})
