import type { NextConfig } from 'next'

function normalizeBasePath(raw: string | undefined): string {
    if (!raw) return ''

    // Allow passing a full URL by mistake (e.g. "https://host:8090/static/swipemenu")
    // but only keep the pathname to avoid mixed-content / wrong-origin requests.
    if (raw.includes('://')) {
        try {
            raw = new URL(raw).pathname
        } catch {
            // fall through
        }
    }

    // Ensure it starts with a slash and has no trailing slash.
    let path = raw.startsWith('/') ? raw : `/${raw}`
    if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1)

    // Next doesn't want "/" as a basePath.
    return path === '/' ? '' : path
}

const basePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH)

const nextConfig: NextConfig = {
    output: 'export',
    basePath: basePath || undefined,
    images: { unoptimized: true },
}

export default nextConfig
