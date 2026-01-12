import {
  staffSearchFormFull,
  StaffSearchRES,
  StaffSearchResponse,
} from "~/schemas/staff";
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

  try {
    // get all query params & parsed to zod schema
    const { staff_name, page } = await getValidatedQuery(
      event,
      staffSearchFormFull.parse
    );

    // send request to backend
    const searchedStaff = await $fetch<StaffSearchResponse>(
      `${apiBaseUrl}/admin-secure/staffs/staffs`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        query: {
          location_code: location_code
            ? decryptString(location_code, secretKey)
            : undefined,
          staff_name: staff_name ? staff_name?.toString().trim() : undefined,
          page: page ? page?.toString().trim() : undefined,
        },
      }
    );

    // reduced the data to only necessary fields
    const reducedData: StaffSearchRES = {
      data: searchedStaff.data.map((staff) => ({
        staff_id: staff.staff_id,
        payroll_id: staff.payroll_id,
        staff_name: staff.staff_name,
        staff_dob: staff.staff_dob,
        staff_phone: staff.staff_phone,
      })),
      links: searchedStaff.links,
      meta: searchedStaff.meta,
    };

    return reducedData;
  } catch (error: any) {
    throw customCreateError(error, "Can't search staff!");
  }
});
