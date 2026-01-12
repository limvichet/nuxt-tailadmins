import { getRequestToken } from "~~/server/utils/helpers";
import {
  LocationShowResponse,
  LocationStoreResponseData,
} from "~/types/location";
import { INVALID_VALUE } from "~/lib/constant";

export default defineEventHandler(async (event) => {
  // get API BASE URL from runtime config
  const { apiBaseUrl } = useRuntimeConfig(event);

  // get code & id_only from query
  const { code, id_only } = getQuery(event);

  const token = getRequestToken(event);
  if (!token) {
    throw createError({
      statusCode: UNAUTHORIZED.code,
      statusMessage: UNAUTHORIZED.message,
    });
  }

  if (!code) {
    throw createError({
      statusCode: BAD_REQUEST.code,
      statusMessage: "Code is required.",
    });
  }

  const headers: HeadersInit = {
    method: "GET",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
  const codeStr = code.toString();
  const pro_code = codeStr.substring(0, 2);
  const dis_code = codeStr.substring(0, 4);
  const com_code = codeStr.substring(0, 6);

  try {
    // original each location data
    const editLocation = await $fetch<{ data: LocationStoreResponseData }>(
      `${apiBaseUrl}/admin-secure/locations/locations/${code}`,
      { headers }
    );

    // return original data if `?only_id=1` is added
    if (id_only && parseInt(id_only.toString()) === 1) {
      return editLocation;
    }

    // fetching options
    const [
      types,
      provinces,
      districts,
      communes,
      villages,
      locations,
      regions,
      levels,
    ] = await Promise.allSettled([
      $fetch("/api/location/locationType", {
        headers,
      }),
      $fetch("/api/location/locationProvince", {
        headers,
      }),
      $fetch("/api/location/locationDistrict", {
        headers,
        query: { pro_code },
      }),
      $fetch("/api/location/locationCommune", {
        headers,
        query: { dis_code },
      }),
      $fetch("/api/location/locationVillage", {
        headers,
        query: { com_code },
      }),
      $fetch("/api/location/location", {
        headers,
        query: { com_code: com_code! },
      }),
      $fetch("/api/location/region", {
        headers,
      }),
      $fetch("/api/location/level", {
        headers,
      }),
    ]);

    // replace original data ids with objects
    const replacedData: LocationShowResponse["data"] = {
      ...editLocation.data,
      location_type_id:
        types.status === "fulfilled"
          ? types.value.data.find(
              (item) => item.id === editLocation.data.location_type_id
            )!
          : { id: editLocation.data.location_type_id, value: INVALID_VALUE },
      pro_code:
        provinces.status === "fulfilled"
          ? provinces.value.data.find(
              (item) => item.id === editLocation.data.pro_code
            )!
          : { id: editLocation.data.pro_code, value: INVALID_VALUE },
      dis_code:
        districts.status === "fulfilled"
          ? districts.value.data.find(
              (item) => item.id === editLocation.data.dis_code
            )!
          : { id: editLocation.data.dis_code, value: INVALID_VALUE },
      com_code:
        communes.status === "fulfilled"
          ? communes.value.data.find(
              (item) => item.id === editLocation.data.com_code
            )!
          : { id: editLocation.data.com_code, value: INVALID_VALUE },
      vil_code:
        villages.status === "fulfilled"
          ? villages.value.data.find(
              (item) => item.id === editLocation.data.vil_code
            )!
          : { id: editLocation.data.vil_code, value: INVALID_VALUE },
      schoolclaster:
        locations.status === "fulfilled"
          ? locations.value.data.find(
              (item) => item.id === editLocation.data.schoolclaster
            )!
          : { id: editLocation.data.schoolclaster!, value: INVALID_VALUE },
      main_school:
        locations.status === "fulfilled"
          ? locations.value.data.find(
              (item) => item.id === editLocation.data.main_school
            )!
          : { id: editLocation.data.main_school!, value: INVALID_VALUE },
      region_id:
        regions.status === "fulfilled"
          ? regions.value.data.find(
              (item) =>
                item.id === (editLocation.data.region_id as string | number)
            )!
          : { id: editLocation.data.region_id!, value: INVALID_VALUE },
      multi_level_edu:
        levels.status === "fulfilled"
          ? levels.value.data.find(
              (item) =>
                item.id ===
                (editLocation.data.multi_level_edu as string | number)
            )!
          : { id: editLocation.data.multi_level_edu!, value: INVALID_VALUE },
      edu_level_id:
        levels.status === "fulfilled"
          ? levels.value.data.find(
              (item) =>
                item.id === (editLocation.data.edu_level_id as string | number)
            )!
          : { id: editLocation.data.edu_level_id, value: INVALID_VALUE },
    };

    return {
      data: replacedData,
      options: {
        location_type: types.status === "fulfilled" ? types.value.data : null,
        provinces:
          provinces.status === "fulfilled" ? provinces.value.data : null,
        districts:
          districts.status === "fulfilled" ? districts.value.data : null,
        communes: communes.status === "fulfilled" ? communes.value.data : null,
        villages: villages.status === "fulfilled" ? villages.value.data : null,
        locations:
          locations.status === "fulfilled" ? locations.value.data : null,
        regions: regions.status === "fulfilled" ? regions.value.data : null,
        levels: levels.status === "fulfilled" ? levels.value.data : null,
      },
    } satisfies LocationShowResponse;
  } catch (error: any) {
    throw customCreateError(error, "Can't get a location!");
  }
});
