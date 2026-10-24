import { notFound } from 'next/navigation'

// Any URL no page matches lands here, so it gets the site-styled 404 inside
// the site layout instead of Next's bare one. Lives outside (site) so no
// loading.tsx wraps it: nothing streams before the 404 status is set.
export default function UnmatchedRoute() {
  notFound()
}
