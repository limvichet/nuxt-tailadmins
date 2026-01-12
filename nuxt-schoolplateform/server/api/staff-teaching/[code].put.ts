import {
  staffTeachingUpdateREQ,
  StaffTeachingUpdateREQ,
  StaffTeachingUpdateRES,
} from "~/schemas/school/staff-teaching";
import { customCreateError } from "~~/server/utils/helpers";

export default defineEventHandler(async (event) => {
  // get API BASE URL from runtime config
  const { apiBaseUrl } = useRuntimeConfig(event);

  // get the code of location
  const code = getRouterParam(event, "code");
  if (!code) {
    throw createError({
      statusCode: BAD_REQUEST.code,
      statusMessage: "Code not found!",
    });
  }

  // get the body of request
  const body: StaffTeachingUpdateREQ = await readBody(event);

  // get the cookie request
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
    // parse the body to zod schema
    const parsedBody = staffTeachingUpdateREQ.parse(body);

    // send request to backend
    const res = await $fetch<StaffTeachingUpdateRES>(
      `${apiBaseUrl}/admin-secure/timetables/staff-teachings/${code}`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(parsedBody),
      }
    );

    return res;
  } catch (error: any) {
    throw customCreateError(error, `Can't update staff teaching ${code}!`);
  }
});
