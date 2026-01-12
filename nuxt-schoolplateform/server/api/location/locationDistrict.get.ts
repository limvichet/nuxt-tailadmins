import { getRequestToken } from "~~/server/utils/helpers";
import { LocationDistrictResponse } from "~/types/location";

export default defineEventHandler(async (event) => {
  // get API BASE URL from runtime config
  const { apiBaseUrl } = useRuntimeConfig(event);
  const { pro_code } = getQuery(event);

  const token = getRequestToken(event);
  if (!token) {
    throw createError({
      statusCode: UNAUTHORIZED.code,
      statusMessage: UNAUTHORIZED.message,
    });
  }

  if (!pro_code) {
    throw createError({
      statusCode: BAD_REQUEST.code,
      statusMessage: "Province code (pro_code) is required.",
    });
  }

  const cacheKey = `districts:${pro_code}`;

  try {
    const cachedDistricts = await useStorage(
      "cache"
    ).getItem<LocationDistrictResponse>(cacheKey);

    if (cachedDistricts) {
      return cachedDistricts;
    }

    const res = await $fetch<LocationDistrictResponse>(
      `${apiBaseUrl}/admin-secure/locations/get-districts`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        query: {
          pro_code: pro_code,
        },
      }
    );

    await useStorage("cache").setItem(cacheKey, res, { ttl: 3600 });

    return res;
  } catch (error: any) {
    console.log(error);
    throw customCreateError(error, "Can't get districts!");
  }
});
