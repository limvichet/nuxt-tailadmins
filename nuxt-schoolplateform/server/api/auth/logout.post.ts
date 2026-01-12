export default defineEventHandler(async (event) => {
  const { apiBaseUrl } = useRuntimeConfig(event);

  try {
    await $fetch(`${apiBaseUrl}/admin-secure/logout`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${getRequestToken(event, "1EZ_auth")!}`,
      },
    });

    // Clear the httpOnly cookie
    deleteCookie(event, "1EZ_auth");
    deleteCookie(event, "1EZ_loc_code");
    return { success: true };
  } catch (error: any) {
    // remove cookie even the request fails
    deleteCookie(event, "1EZ_auth");
    deleteCookie(event, "1EZ_loc_code");
    throw customCreateError(error, "Can't logout!");
  }
});
