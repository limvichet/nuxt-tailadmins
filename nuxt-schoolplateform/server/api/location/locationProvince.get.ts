import { LocationProvinceResponse } from "~/types/location";
const CACHE_TTL = 60 * 60 * 12; // 12 hours

export default defineEventHandler(async (event) => {
  // get API BASE URL from runtime config
  const { apiBaseUrl } = useRuntimeConfig(event);

  // get the body of request
  try {
    const token = getRequestToken(event);
    if (!token)
      throw createError({
        statusCode: UNAUTHORIZED.code,
        statusMessage: UNAUTHORIZED.message,
      });

    const res = await $fetch<LocationProvinceResponse>(
      `${apiBaseUrl}/admin-secure/locations/get-provinces`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // caching the response for client-side usage
    setResponseHeader(
      event,
      "Cache-Control",
      `public, max-age=${CACHE_TTL}, stale-while-revalidate=60`
    );

    return res;
  } catch (error: any) {
    throw customCreateError(error, "Can't get provinces!");
  }
});
