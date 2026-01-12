import { INVALID_VALUE } from "~/lib/constant";
import { SelectOption } from "~/lib/schema";
import {
  staffTeachingSearchFormREQ,
  StaffTeachingSearchRES,
  StaffTeachingSearchResponse,
} from "~/schemas/school/staff-teaching";

import { customCreateError, decryptString } from "~~/server/utils/helpers";

export default defineEventHandler(async (event) => {
  // get API BASE URL from runtime config
  const { apiBaseUrl, secretKey } = useRuntimeConfig(event);

  // get the cookies request
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

  const headers: HeadersInit = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
    Cookie: `1EZ_loc_code=${location_code};`,
  };

  try {
    // get all query params & parsed to zod schema
    const { academic_id, staff_id, page } = await getValidatedQuery(
      event,
      staffTeachingSearchFormREQ.parse
    );

    // send request to backend
    const searchedStaffTeaching = await $fetch<StaffTeachingSearchResponse>(
      `${apiBaseUrl}/admin-secure/timetables/staff-teachings`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        query: {
          location_code: location_code
            ? decryptString(location_code, secretKey)
            : undefined,
          academic_id: academic_id ? academic_id?.toString().trim() : undefined,
          staff_id: staff_id ? staff_id?.toString().trim() : undefined,
          page: page ? page?.toString().trim() : undefined,
        },
      }
    );

    const fetchMap = {
      academics: $fetch("/api/class/academic", { headers }),
      staffs: $fetch("/api/class/staff", { headers }),
      grade_types: $fetch("/api/class/grade-type", { headers }),
    };

    // Fetch all requests in parallel
    const results = await Promise.allSettled(Object.values(fetchMap));

    const keys = Object.keys(fetchMap) as (keyof typeof fetchMap)[];
    // Re-map results back to keys for easy access
    const options = keys.reduce((acc, key, index) => {
      const result = results[index];
      const rawValue = result.status === "fulfilled" ? result.value : [];
      acc[key] = Array.isArray(rawValue) ? rawValue : rawValue?.data || [];
      return acc;
    }, {} as Record<keyof typeof fetchMap, SelectOption[]>);

    const resolve = (targetId: string | number, sourceList: SelectOption[]) => {
      if (!targetId) return { id: targetId, value: INVALID_VALUE };

      const found = sourceList.find((item) => item.id == targetId);
      return found ?? { id: targetId, value: INVALID_VALUE };
    };

    // reduced the data to only necessary fields
    const reducedData: StaffTeachingSearchRES = {
      data: searchedStaffTeaching.data.data.map((eachClass) => ({
        teaching_id: eachClass.teaching_id,
        academic_id: resolve(eachClass.academic_id!, options.academics).value,
        staff_id: resolve(eachClass.staff_id, options.staffs).value,
        cgt_id: resolve(eachClass.cgt_id!, options.grade_types).value,
        add_teaching: eachClass.add_teaching ? true : false,
        class_incharge: eachClass.class_incharge ? true : false,
        chief_technical: eachClass.chief_technical ? true : false,
        bi_language: eachClass.bi_language ? true : false,
        teach_english: eachClass.teach_english ? true : false,
      })),
      links: {
        first_page_url: searchedStaffTeaching.data.first_page_url,
        prev_page_url: searchedStaffTeaching.data.prev_page_url,
        next_page_url: searchedStaffTeaching.data.next_page_url,
        last_page_url: searchedStaffTeaching.data.last_page_url,
      },
      meta: {
        current_page: searchedStaffTeaching.data.current_page,
        last_page: searchedStaffTeaching.data.last_page,
        per_page: searchedStaffTeaching.data.per_page,
        total: searchedStaffTeaching.data.total,
      },
    };

    return reducedData;
  } catch (error: any) {
    throw customCreateError(error, "Can't search staff teaching!");
  }
});
