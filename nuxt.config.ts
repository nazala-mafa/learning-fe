// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      appUrl: process.env.APP_URL,
      uploadChunkSizeMb: process.env.UPLOAD_CHUNK_SIZE_MB
    }
  },
  routeRules: {
    '/files/**': { proxy: `${process.env.APP_URL}/files/**` },
    '/api/**': { proxy: `${process.env.APP_URL}/api/**` },
  },
  typescript: {
    strict: true,
  },
  modules: [
    "@nuxt/ui",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
  ],
})