export const useRoutesInDir = (path: string = useRoute().fullPath) => {
  const router = useRouter();

  const allRoutes = computed(() =>
    router.options.routes
      .filter((route) => route.path.startsWith(path))
      .map((route) => route.path)
  );

  return {
    allRoutes,
  };
};
