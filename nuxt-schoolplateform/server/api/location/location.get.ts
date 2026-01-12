import { getRequestToken } from "~~/server/utils/helpers";
import { LocationLocationResponse } from "~/types/location";

export default defineEventHandler(async (event) => {
  // get API BASE URL from runtime config
  const { apiBaseUrl } = useRuntimeConfig(event);
  const { com_code } = getQuery(event);

  // get the body of request
  const token = getRequestToken(event);
  if (!token) {
    throw createError({
      statusCode: UNAUTHORIZED.code,
      statusMessage: UNAUTHORIZED.message,
    });
  }

  // const location_code = getCookie(event, "1EZ_loc_code");
  // if (!location_code) {
  //   throw createError({
  //     statusCode: UNAUTHORIZED.code,
  //     statusMessage: "No location code, please contact admin!",
  //   });
  // }

  let cacheKey = "";
  if (!com_code) {
    cacheKey = `school-locations`;
  }

  cacheKey = `school-locations:${com_code}`;

  try {
    const cachedLocations = await useStorage(
      "cache"
    ).getItem<LocationLocationResponse>(cacheKey);

    if (cachedLocations) {
      // If we found it in the cache, return it immediately.
      return cachedLocations;
    }

    const res = await $fetch<LocationLocationResponse>(
      `${apiBaseUrl}/admin-secure/locations/get-locations`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        query: { com_code: com_code ?? undefined },
      }
    );
    await useStorage("cache").setItem(cacheKey, res, { ttl: 3600 });

    return res;
  } catch (error: any) {
    throw customCreateError(error, "Can't get all schools!");
  }
});
