// The full index of writing — including posts hidden from /writing — lives at
// /archive/<key>. This repo is public, so the real key belongs in ARCHIVE_KEY in
// the deployment environment; the fallback is only here so the route works in
// local development.
export const ARCHIVE_KEY = process.env.ARCHIVE_KEY || 'blue-note';
