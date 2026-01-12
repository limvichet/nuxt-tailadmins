import { ClassStaffIndexRES } from "~/types/class";
import { decryptString } from "~~/server/utils/helpers";

export default defineEventHandler(async (event) => {
  // get API BASE URL from runtime config
  const { apiBaseUrl, secretKey } = useRuntimeConfig(event);

  // get the body of request
  try {
    const token = getRequestToken(event);
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

    const res = await $fetch<ClassStaffIndexRES>(
      `${apiBaseUrl}/admin-secure/classes/get-staffs`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        query: { location_code: decryptString(location_code, secretKey) },
      }
    );

    return res;
  } catch (error: any) {
    throw customCreateError(error, "Can't get all staffs!");
  }
});
