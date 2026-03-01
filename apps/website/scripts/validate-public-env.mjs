function fail(msg) {
  console.error(`env validation failed: ${msg}`)
  process.exit(1)
}

const raw = process.env.NEXT_PUBLIC_BASE_PATH
if (!raw) process.exit(0)

if (raw.includes('://')) {
  fail(`NEXT_PUBLIC_BASE_PATH must be a path (no scheme/host/port). Got: ${raw}`)
}

if (raw.includes(':')) {
  fail(`NEXT_PUBLIC_BASE_PATH must not include ":" (ports). Got: ${raw}`)
}

if (!raw.startsWith('/')) {
  fail(`NEXT_PUBLIC_BASE_PATH must start with "/". Got: ${raw}`)
}

