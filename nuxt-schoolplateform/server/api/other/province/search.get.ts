import { ProvinceSearchResponse } from "~/schemas/address/province";

export default defineEventHandler(async (event) => {
  // get API BASE URL from runtime config
  const { apiBaseUrl } = useRuntimeConfig(event);

  // get all query params
  const { nameEN: name_en, nameKH: name_kh, page } = getQuery(event);

  // get the cookie request
  const token = getRequestToken(event, "1EZ_auth");
  if (!token) {
    throw createError({
      statusCode: UNAUTHORIZED.code,
      statusMessage: UNAUTHORIZED.message,
    });
  }

  try {
    const searchedProvinces = await $fetch<ProvinceSearchResponse>(
      `${apiBaseUrl}/admin-secure/locations/provinces`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        query: {
          name_en: name_en ? name_en?.toString().trim() : undefined,
          name_kh: name_kh ? name_kh?.toString().trim() : undefined,
          page: page ? page?.toString().trim() : undefined,
        },
      }
    );

    return searchedProvinces;
  } catch (error: any) {
    throw customCreateError(error, "Can't search provinces!");
  }
});
