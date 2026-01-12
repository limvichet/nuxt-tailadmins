import { LocationRegionResponse } from "~/types/location";
const CACHE_TTL = 60 * 60 * 12; // 12 hours

export default defineEventHandler(async (event) => {
  // get API BASE URL from runtime config
  const { apiBaseUrl } = useRuntimeConfig(event);

  // get the body of request
  const token = getRequestToken(event);
  if (!token) {
    throw createError({
      statusCode: UNAUTHORIZED.code,
      statusMessage: UNAUTHORIZED.message,
    });
  }

  const cacheKey = "regions";

  try {
    const cachedRegions = await useStorage(
      "cache"
    ).getItem<LocationRegionResponse>(cacheKey);

    if (cachedRegions) {
      // If we found it in the cache, return it immediately.
      return cachedRegions;
    }

    const res = await $fetch<LocationRegionResponse>(
      `${apiBaseUrl}/admin-secure/locations/get-location-regions`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    await useStorage("cache").setItem(cacheKey, res, { ttl: 3600 });

    setResponseHeader(
      event,
      "Cache-Control",
      `public, max-age=${CACHE_TTL}, stale-while-revalidate=60`
    );

    return res;
  } catch (error: any) {
    throw customCreateError(error, "Can't get all regions!");
  }
});
