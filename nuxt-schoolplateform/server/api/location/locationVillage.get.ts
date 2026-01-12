import { LocationVillageResponse } from "~/types/location";
import { getRequestToken } from "~~/server/utils/helpers";

export default defineEventHandler(async (event) => {
  // get API BASE URL from runtime config
  const { apiBaseUrl } = useRuntimeConfig(event);
  const { com_code } = getQuery(event);

  const token = getRequestToken(event);
  if (!token) {
    throw createError({
      statusCode: UNAUTHORIZED.code,
      statusMessage: UNAUTHORIZED.message,
    });
  }
  if (!com_code) {
    throw createError({
      statusCode: BAD_REQUEST.code,
      statusMessage: "Commune code (com_code) is required.",
    });
  }

  const cacheKey = `villages:${com_code}`;

  try {
    const cachedVillages = await useStorage(
      "cache"
    ).getItem<LocationVillageResponse>(cacheKey);

    if (cachedVillages) {
      // If we found it in the cache, return it immediately.
      return cachedVillages;
    }

    const res = await $fetch<LocationVillageResponse>(
      `${apiBaseUrl}/admin-secure/locations/get-villages`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        query: {
          com_code: com_code!,
        },
      }
    );
    await useStorage("cache").setItem(cacheKey, res, { ttl: 3600 });

    return res;
  } catch (error: any) {
    throw customCreateError(error, "Can't get villages!");
  }
});
