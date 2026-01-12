export default defineNuxtRouteMiddleware(async (to) => {
  const { isAuthenticated, fetchUser } = useAuth();

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const guestOnly = to.matched.some((record) => record.meta.guestOnly);

  if (requiresAuth || guestOnly) {
    // Prevents re-fetching on every client-side navigation.
    if (!isAuthenticated.value) {
      if (import.meta.server) {
        const headers = useRequestHeaders(["cookie"]);
        await fetchUser(headers);
      } else {
        await fetchUser();
      }
    }
  }

  // Redirect to login if auth is required and user is not authenticated.
  if (requiresAuth && !isAuthenticated.value) {
    return navigateTo(`/login?redirectTo=${encodeURIComponent(to.fullPath)}`, {
      replace: true,
    });
  }

  // Redirect to dashboard if it's a guest-only page and user is authenticated.
  if (guestOnly && isAuthenticated.value) {
    return navigateTo(`/app/dashboard`, { replace: true });
  }
});
