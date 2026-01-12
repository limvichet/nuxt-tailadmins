import { ClassGradeTypeIndexRES } from "~/types/class";
const CACHE_TTL = 60 * 60 * 12; // 12 hours

export default defineEventHandler(async (event) => {
  // get API BASE URL from runtime config
  const { apiBaseUrl } = useRuntimeConfig(event);

  // get the body of request
  try {
    const token = getRequestToken(event);
    if (!token) {
      throw createError({
        statusCode: UNAUTHORIZED.code,
        statusMessage: UNAUTHORIZED.message,
      });
    }

    // const location_code = getCookie(event, "1EZ_loc_code");
    // if (!location_code) {
    //   throw createError({
    //     statusCode: UNAUTHORIZED.code,
    //     statusMessage: "No location code, please contact admin!",
    //   });
    // }

    const res = await $fetch<ClassGradeTypeIndexRES>(
      `${apiBaseUrl}/admin-secure/classes/get-class-grade-types`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // caching the response for client-side usage
    setResponseHeader(
      event,
      "Cache-Control",
      `public, max-age=${CACHE_TTL}, stale-while-revalidate=60`
    );

    return res;
  } catch (error: any) {
    throw customCreateError(error, "Can't get all grade types!");
  }
});
