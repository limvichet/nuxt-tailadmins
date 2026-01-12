export default defineEventHandler(async (event) => {
  // get API BASE URL from runtime config
  const { apiBaseUrl } = useRuntimeConfig(event);

  // get the code of location
  const code = getRouterParam(event, "code");
  if (!code) {
    throw createError({
      statusCode: BAD_REQUEST.code,
      statusMessage: "Code not found!",
    });
  }

  // get the cookies request
  const token = getRequestToken(event, "1EZ_auth");
  if (!token) {
    throw createError({
      statusCode: UNAUTHORIZED.code,
      statusMessage: UNAUTHORIZED.message,
    });
  }

  const location_code = getCookie(event, "1EZ_loc_code");
  if (!location_code) {
    throw createError({
      statusCode: UNAUTHORIZED.code,
      statusMessage: "No location code, please contact admin!",
    });
  }

  try {
    const res = await $fetch<{ message: string }>(
      `${apiBaseUrl}/admin-secure/timetables/manage-grades/${code}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res;
  } catch (error: any) {
    throw customCreateError(error, "Can't delete class!");
  }
});
