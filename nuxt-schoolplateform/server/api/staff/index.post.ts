import {
  type StaffCreateREQ,
  staffCreateREQ,
  type StaffCreateRES,
} from "~/schemas/staff";
import { customCreateError } from "~~/server/utils/helpers";

export default defineEventHandler(async (event) => {
  // get API BASE URL from runtime config
  const { apiBaseUrl } = useRuntimeConfig(event);

  // get the body of request
  const body: StaffCreateREQ = await readBody(event);

  // get the cookies request
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

  try {
    // parse the body to zod schema
    const parsedBody = staffCreateREQ.parse(body);

    // send request to backend
    const res = await $fetch<StaffCreateRES>(
      `${apiBaseUrl}/admin-secure/staffs/staffs`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(parsedBody),
      }
    );
    return res;
  } catch (error) {
    throw customCreateError(error, "Can't create staff.");
  }
});
