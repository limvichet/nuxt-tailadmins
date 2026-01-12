const CACHE_TTL = 60 * 5; // 5 minutes

export default defineEventHandler(async (event) => {
  // get API BASE URL from runtime config
  const { apiBaseUrl } = useRuntimeConfig(event);

  // get the body of request
  try {
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

    const genders = [
      { id: 1, value: "ប្រុស" },
      { id: 2, value: "ស្រី" },
    ];

    const res: typeof genders = genders;

    // caching the response for client-side usage
    setResponseHeader(
      event,
      "Cache-Control",
      `public, max-age=${CACHE_TTL}, stale-while-revalidate=60`
    );

    return res;
  } catch (error: any) {
    throw customCreateError(error, "Can't get all genders!");
  }
});
