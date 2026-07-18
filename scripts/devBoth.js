import { spawn } from 'node:child_process'

function run(command, args, opts = {}) {
  const child = spawn(command, args, {
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: false,
    ...opts
  })

  child.stdout.on('data', (d) => process.stdout.write(d))
  child.stderr.on('data', (d) => process.stderr.write(d))

  return child
}

const server = run('npm', ['run', 'dev'], { cwd: new URL('../server/', import.meta.url) })
const web = run('npm', ['run', 'dev'], { cwd: new URL('../web/', import.meta.url) })

function shutdown(signal) {
  const procs = [web, server].filter(Boolean)
  for (const p of procs) {
    try {
      p.kill(signal)
    } catch {
      // ignore
    }
  }
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))

const exitWithCode = (code) => {
  shutdown('SIGTERM')
  process.exit(code ?? 0)
}

server.on('exit', (code) => {
  if (code !== 0) exitWithCode(code)
})

web.on('exit', (code) => {
  if (code !== 0) exitWithCode(code)
})

