// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      appUrl: process.env.APP_URL
    }
  },
  routeRules: {
    '/files/**': { proxy: `${process.env.APP_URL}/files/**` },
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