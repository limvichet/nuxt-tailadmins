import {
  type ClassCreateREQ,
  classCreateREQ,
  ClassCreateRES,
} from "~/schemas/school/class";
import { customCreateError } from "~~/server/utils/helpers";

export default defineEventHandler(async (event) => {
  // get API BASE URL from runtime config
  const { apiBaseUrl } = useRuntimeConfig(event);

  // get the body of request
  const body: ClassCreateREQ = await readBody(event);

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
    const parsedBody = classCreateREQ.parse(body);

    // send request to backend
    const res = await $fetch<ClassCreateRES>(
      `${apiBaseUrl}/admin-secure/timetables/manage-grades`,
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
    throw customCreateError(error, "Can't create classes!");
  }
});
