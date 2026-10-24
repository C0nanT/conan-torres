import { notFound } from 'next/navigation'

// Any URL no page matches lands here, so it gets the site-styled
// (site)/not-found.tsx inside the site layout instead of Next's bare 404.
// Sync on purpose: nothing suspends before the 404 status is set.
export default function UnmatchedRoute() {
  notFound()
}
