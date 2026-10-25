// APP_ENV comes from .env: "production" on the VPS, "development" locally.
// Read at request time (callers must opt out of prerendering with
// `connection()`), because the image is built without the .env.
export function isProductionEnv() {
  return process.env.APP_ENV?.trim() === 'production'
}
