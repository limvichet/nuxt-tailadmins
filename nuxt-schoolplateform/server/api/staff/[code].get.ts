import { StaffShowRES, StaffShowResponse } from "~/schemas/staff";
import { INVALID_VALUE } from "~/lib/constant";
import { customCreateError } from "~~/server/utils/helpers";
import z from "zod";

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

  const loc_code = getCookie(event, "1EZ_loc_code");
  if (!loc_code) {
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
    Cookie: `1EZ_loc_code=${loc_code};`,
  };

  try {
    // send request to backend
    const originalData = await $fetch<StaffShowResponse>(
      `${apiBaseUrl}/admin-secure/staffs/staffs/${code}`,
      { headers }
    );

    if (id_only && String(id_only) === "1") {
      return originalData;
    }

    const staff = originalData.data;

    const KOR1_KHOR1 = [1, 4];
    const KO = 9;

    const queryStart = KOR1_KHOR1.includes(Number(staff.start_salary_level_id))
      ? { six: 1 }
      : Number(staff.start_salary_level_id) === KO
      ? { ten: 1 }
      : undefined;

    const queryCurrent = KOR1_KHOR1.includes(
      Number(staff.current_salary_level_id)
    )
      ? { six: 1 }
      : Number(staff.current_salary_level_id) === KO
      ? { ten: 1 }
      : undefined;

    const fetchMap = {
      genders: $fetch("/api/staff/gender", { headers }),
      statuses: $fetch("/api/staff/status", { headers }),
      positions: $fetch("/api/staff/position", { headers }),
      qualificationsBacii: $fetch("/api/staff/qualification?bacii=1", {
        headers,
      }),
      qualifications: $fetch("/api/staff/qualification", {
        headers,
      }),
      professionals: $fetch("/api/staff/professional", {
        headers,
      }),
      professionalTypes: $fetch("/api/staff/professional-type", {
        headers,
      }),
      institutions: $fetch("/api/staff/institution", { headers }),
      salaryLevels: $fetch("/api/staff/salary-level", { headers }),
      salaryLevelGradesStart: $fetch(`/api/staff/salary-level-grade`, {
        headers,
        query: queryStart,
      }),
      salaryLevelGradesCurrent: $fetch(`/api/staff/salary-level-grade`, {
        headers,
        query: queryCurrent,
      }),
      subjects: $fetch("/api/staff/subject", { headers }),
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
    }, {} as Record<keyof typeof fetchMap, any>);

    const resolve = (
      targetId: string | number,
      sourceList: { id: string | number; value: string }[]
    ) => {
      if (!targetId) return { id: targetId, value: INVALID_VALUE };

      // Loose equality (==) for string/number ID mismatch from APIs
      const found = sourceList.find((item) => item.id == targetId);
      return found ?? { id: targetId, value: INVALID_VALUE };
    };

    const replacedData: StaffShowRES = {
      data: {
        ...staff,
        staff_gender: resolve(staff.staff_gender, options.genders),
        status_id: resolve(staff.status_id, options.statuses),
        position_id: resolve(staff.position_id, options.positions),

        // Qualifications
        start_qualification_id: resolve(
          staff.start_qualification_id,
          options.qualificationsBacii
        ),
        start_qualification_institution_id: resolve(
          staff.start_qualification_institution_id,
          options.institutions
        ),
        current_qualification_id: staff.current_qualification_id
          ? resolve(staff.current_qualification_id, options.qualifications)
          : undefined,
        current_qualification_institution_id:
          staff.current_qualification_institution_id
            ? resolve(
                staff.current_qualification_institution_id,
                options.institutions
              )
            : undefined,
        current_qualification_subject_id: staff.current_qualification_subject_id
          ? resolve(staff.current_qualification_subject_id, options.subjects)
          : undefined,

        // Start Professional
        start_professional_id: resolve(
          staff.start_professional_id,
          options.professionals
        ),
        start_professional_subject_id_1: resolve(
          staff.start_professional_subject_id_1,
          options.subjects
        ),
        start_professional_subject_id_2: staff.start_professional_subject_id_2
          ? resolve(staff.start_professional_subject_id_2, options.subjects)
          : undefined,
        start_professional_type_id: resolve(
          staff.start_professional_type_id,
          options.professionalTypes
        ),
        start_professional_institution_id: resolve(
          staff.start_professional_institution_id,
          options.institutions
        ),

        // Current Professional
        current_professional_id: resolve(
          staff.current_professional_id,
          options.professionals
        ),
        current_professional_subject_id_1: resolve(
          staff.current_professional_subject_id_1,
          options.subjects
        ),
        current_professional_subject_id_2:
          staff.current_professional_subject_id_2
            ? resolve(staff.current_professional_subject_id_2, options.subjects)
            : undefined,
        current_professional_type_id: resolve(
          staff.current_professional_type_id,
          options.professionalTypes
        ),
        current_professional_institution_id: resolve(
          staff.current_professional_institution_id,
          options.institutions
        ),

        // Salary
        start_salary_level_id: resolve(
          staff.start_salary_level_id,
          options.salaryLevels
        ),
        start_salary_degree: resolve(
          staff.start_salary_degree,
          options.salaryLevelGradesStart
        ),
        current_salary_level_id: resolve(
          staff.current_salary_level_id,
          options.salaryLevels
        ),
        current_salary_degree: resolve(
          staff.current_salary_degree,
          options.salaryLevelGradesCurrent
        ),
      },
      options: options,
    };

    return replacedData satisfies StaffShowRES;
  } catch (error: any) {
    throw customCreateError(error, `Can't update staff!`);
  }
});
