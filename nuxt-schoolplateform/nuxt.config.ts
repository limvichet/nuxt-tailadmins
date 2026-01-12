import tailwindcss from "@tailwindcss/vite";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  css: ["@/assets/css/tailwind.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  modules: [
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "shadcn-nuxt",
    "@nuxtjs/color-mode",
    "nuxt-og-image",
  ],
  colorMode: {
    storageKey: "1EZ-color-theme",
  },
  shadcn: {
    prefix: "",
    componentDir: "./app/components/ui",
  },
  fonts: {
    families: [
      {
        name: "Roboto",
        weights: [400, 500, 600, 700, 800, 900],
      },
      {
        name: "Kantumruy Pro",
        weights: [500, 600, 700, 800, 900],
      },
    ],
  },
  $development: {
    runtimeConfig: {
      apiBaseUrl: process.env.NUXT_API_BASE_URL,
      secretKey: process.env.NUXT_SECRET_KEY,
      public: {
        siteUrl: "http://localhost:3000",
      },
    },
  },
  $production: {
    runtimeConfig: {
      apiBaseUrl: process.env.NUXT_API_BASE_URL,
      secretKey: process.env.NUXT_SECRET_KEY,
      public: {
        siteUrl:
          process.env.NUXT_PUBLIC_SITE_URL ||
          "https://jroch-school-web.vercel.app",
      },
    },
  },
  ogImage: {
    defaults: {
      renderer: "satori",
    },
  },
  experimental: {
    viewTransition: true,
  },
  routeRules: {
    "/": { static: true },
  },
});
