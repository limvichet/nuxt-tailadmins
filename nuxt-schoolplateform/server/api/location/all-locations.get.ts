import type {
  AllLocationsResponse,
  LocationSearchResponse,
} from "~/types/location";

export default defineEventHandler(async (event) => {
  // get API BASE URL from runtime config
  const { apiBaseUrl } = useRuntimeConfig(event);

  // get all query
  const {
    q: name,
    location_type: location_type_id,
    pro_code,
    dis_code,
    com_code,
    vil_code,
    page,
  } = getQuery(event);

  try {
    const searchedLocation = await $fetch<LocationSearchResponse>(
      `${apiBaseUrl}/admin-secure/locations/locations`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${getRequestToken(event, "1EZ_auth")}`,
        },
        query: {
          name: name ? name?.toString().trim() : undefined,
          location_type_id: location_type_id
            ? location_type_id?.toString().trim()
            : undefined,
          pro_code: pro_code ? pro_code?.toString().trim() : undefined,
          dis_code: dis_code ? dis_code?.toString().trim() : undefined,
          com_code: com_code ? com_code?.toString().trim() : undefined,
          vil_code: vil_code ? vil_code?.toString().trim() : undefined,
          page: page ? page?.toString().trim() : undefined,
        },
      }
    );

    return {
      data: searchedLocation.data.map((item) => {
        return {
          location_type_id: item.location_type_id,
          location_code: item.location_code,
          location_kh: item.location_kh,
        };
      }),
      links: searchedLocation.links,
      meta: searchedLocation.meta,
    } as AllLocationsResponse;
  } catch (error: any) {
    throw customCreateError(error, "Can't search locations!");
  }
});
