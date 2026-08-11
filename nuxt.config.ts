// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css', 'leaflet/dist/leaflet.css'],
  runtimeConfig: {
    public: {
      appUrl: 'https://api-learning.mafadev.com',
      uploadChunkSizeMb: '5'
    }
  },
  routeRules: {
    '/files/**': { proxy: `https://api-learning.mafadev.com/files/**` },
    '/api/**': { proxy: `https://api-learning.mafadev.com/api/**` },
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