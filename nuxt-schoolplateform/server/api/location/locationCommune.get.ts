import { getRequestToken } from "~~/server/utils/helpers";
import { LocationCommuneResponse } from "~/types/location";

export default defineEventHandler(async (event) => {
  // get API BASE URL from runtime config
  const { apiBaseUrl } = useRuntimeConfig(event);
  const { dis_code } = getQuery(event);

  const token = getRequestToken(event);
  if (!token) {
    throw createError({
      statusCode: UNAUTHORIZED.code,
      statusMessage: UNAUTHORIZED.message,
    });
  }

  if (!dis_code) {
    throw createError({
      statusCode: BAD_REQUEST.code,
      statusMessage: "District code (dis_code) is required.",
    });
  }

  const cacheKey = `communes:${dis_code}`;

  try {
    const cachedCommunes = await useStorage(
      "cache"
    ).getItem<LocationCommuneResponse>(cacheKey);

    if (cachedCommunes) {
      // If we found it in the cache, return it immediately.
      return cachedCommunes;
    }

    const res = await $fetch<LocationCommuneResponse>(
      `${apiBaseUrl}/admin-secure/locations/get-communes`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        query: {
          dis_code: dis_code!,
        },
      }
    );

    await useStorage("cache").setItem(cacheKey, res, { ttl: 3600 });

    return res;
  } catch (error: any) {
    throw customCreateError(error, "Can't get communes!");
  }
});
