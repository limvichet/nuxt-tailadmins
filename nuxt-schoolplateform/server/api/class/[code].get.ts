import { ClassShowRES, ClassShowResponse } from "~/schemas/school/class";
import { INVALID_VALUE } from "~/lib/constant";
import { customCreateError } from "~~/server/utils/helpers";
import z from "zod";
import { SelectOption } from "~/lib/schema";

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
    const originalData = await $fetch<ClassShowResponse>(
      `${apiBaseUrl}/admin-secure/timetables/manage-grades/${code}`,
      { headers }
    );

    if (id_only && String(id_only) === "1") {
      return originalData;
    }
    const cur_class = originalData.timetable_grades;

    const newHeaders = {
      ...headers,
      Cookie: `1EZ_loc_code=${location_code};`,
    };

    const fetchMap = {
      academics: $fetch("/api/class/academic", { headers }),
      grades: $fetch("/api/class/grade", { headers: newHeaders }),
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

    const replacedData: ClassShowRES = {
      data: {
        ...cur_class,
        academic_id: resolve(cur_class.academic_id, options.academics),
        grade_id: resolve(cur_class.grade_id, options.grades),
      },
      options: options,
    };

    return replacedData satisfies ClassShowRES;
  } catch (error: any) {
    throw customCreateError(error, `Can't find class by code: ${code}!`);
  }
});
