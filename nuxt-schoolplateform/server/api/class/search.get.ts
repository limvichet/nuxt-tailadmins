import { INVALID_VALUE } from "~/lib/constant";
import { SelectOption } from "~/lib/schema";
import {
  classSearchFormREQ,
  ClassSearchRES,
  ClassSearchResponse,
} from "~/schemas/school/class";

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
    const { academic_id, grade_id, page } = await getValidatedQuery(
      event,
      classSearchFormREQ.parse
    );

    // send request to backend
    const searchedClasses = await $fetch<ClassSearchResponse>(
      `${apiBaseUrl}/admin-secure/timetables/manage-grades`,
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
          grade_id: grade_id ? grade_id?.toString().trim() : undefined,
          page: page ? page?.toString().trim() : undefined,
        },
      }
    );

    const fetchMap = {
      academics: $fetch("/api/class/academic", { headers }),
      grades: $fetch("/api/class/grade", { headers }),
      payrolls: $fetch("/api/class/staff", { headers }),
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

    const resolve = (
      targetId: string | number,
      sourceList: { id: string | number; value: string }[]
    ) => {
      if (!targetId) return { id: targetId, value: INVALID_VALUE };

      const found = sourceList.find((item) => item.id == targetId);
      return found ?? { id: targetId, value: INVALID_VALUE };
    };

    // reduced the data to only necessary fields
    const reducedData: ClassSearchRES = {
      data: searchedClasses.timetable_grades.data.map((eachClass) => ({
        tgrade_id: eachClass.tgrade_id,
        academic_id: resolve(eachClass.academic_id, options.academics).value,
        grade_id: resolve(eachClass.grade_id, options.grades).value,
        grade_name: eachClass.grade_name,
      })),
      links: {
        first_page_url: searchedClasses.timetable_grades.first_page_url,
        prev_page_url: searchedClasses.timetable_grades.prev_page_url,
        next_page_url: searchedClasses.timetable_grades.next_page_url,
        last_page_url: searchedClasses.timetable_grades.last_page_url,
      },
      meta: {
        current_page: searchedClasses.timetable_grades.current_page,
        last_page: searchedClasses.timetable_grades.last_page,
        per_page: searchedClasses.timetable_grades.per_page,
        total: searchedClasses.timetable_grades.total,
      },
    };

    return reducedData;
  } catch (error: any) {
    throw customCreateError(error, "Can't search staff!");
  }
});
