export default defineNuxtPlugin((nuxtApp) => {
  // all allow-scroll-top routes
  const scrollRoutes: Array<string | RegExp> = [
    "/app/dashboard/staff/search",
    "/app/dashboard/location/search",
    "/app/dashboard/other/province",
    "/app/dashboard/school/class",
    "/app/dashboard/school/staff-teaching",
  ];

  useRouter().afterEach((to) => {
    const shouldScroll = scrollRoutes.some((route) => {
      if (typeof route === "string") return to.path.startsWith(route);
      return to.path.match(route);
    });

    if (shouldScroll) {
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  });
});
