export default defineNuxtConfig({
  // SPA : l'app repose sur localStorage, on évite les soucis d'hydratation SSR
  ssr: false,
  modules: ['@pinia/nuxt'],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'Dashboard Muscu',
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }]
    }
  }
})
