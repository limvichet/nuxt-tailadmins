import { INVALID_VALUE } from "~/lib/constant";
import { customCreateError } from "~~/server/utils/helpers";
import z from "zod";
import { SelectOption } from "~/lib/schema";
import {
  StaffTeachingShowRES,
  StaffTeachingShowResponse,
} from "~/schemas/school/staff-teaching";

export default defineEventHandler(async (event) => {
  const { apiBaseUrl } = useRuntimeConfig(event);
  const { id_only } = getQuery(event);
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

  const serverSchema = z.object({
    code: z.coerce.number().int().positive(),
  });
  const { code } = await getValidatedRouterParams(event, serverSchema.parse);

  if (!code) {
    throw createError({
      statusCode: BAD_REQUEST.code,
      statusMessage: "Code not found!",
    });
  }

  const headers: HeadersInit = {
    method: "GET",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };

  try {
    // send request to backend
    const originalData = await $fetch<StaffTeachingShowResponse>(
      `${apiBaseUrl}/admin-secure/timetables/staff-teachings/${code}`,
      { headers }
    );

    if (id_only && String(id_only) === "1") {
      return originalData;
    }
    const cur_staff_teaching = originalData.data;

    const newHeaders = { ...headers, Cookie: `1EZ_loc_code=${location_code};` };

    const fetchMap = {
      academics: $fetch("/api/class/academic", { headers }),
      staffs: $fetch("/api/class/staff", { headers: newHeaders }),
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

    const resolve = (
      targetId: string | number,
      sourceList: { id: string | number; value: string }[]
    ) => {
      if (!targetId) return { id: targetId, value: INVALID_VALUE };

      // Loose equality (==) for string/number ID mismatch from APIs
      const found = sourceList.find((item) => item.id == targetId);
      return found ?? { id: targetId, value: INVALID_VALUE };
    };

    const replacedData: StaffTeachingShowRES = {
      data: {
        ...cur_staff_teaching,
        academic_id: cur_staff_teaching.academic_id
          ? resolve(cur_staff_teaching.academic_id!, options.academics)
          : { id: cur_staff_teaching.academic_id!, value: INVALID_VALUE },
        staff_id: cur_staff_teaching.staff_id
          ? resolve(cur_staff_teaching.staff_id!, options.staffs)
          : { id: cur_staff_teaching.staff_id!, value: INVALID_VALUE },
        cgt_id: cur_staff_teaching.cgt_id
          ? resolve(cur_staff_teaching.cgt_id!, options.grade_types)
          : { id: cur_staff_teaching.cgt_id!, value: INVALID_VALUE },

        add_teaching: cur_staff_teaching.add_teaching ? true : false,
        class_incharge: cur_staff_teaching.class_incharge ? true : false,
        chief_technical: cur_staff_teaching.chief_technical ? true : false,
        bi_language: cur_staff_teaching.bi_language ? true : false,
        teach_english: cur_staff_teaching.teach_english ? true : false,
      },
      options: options,
    };

    return replacedData satisfies StaffTeachingShowRES;
  } catch (error: any) {
    throw customCreateError(
      error,
      `Can't find staff teaching by code: ${code}!`
    );
  }
});
