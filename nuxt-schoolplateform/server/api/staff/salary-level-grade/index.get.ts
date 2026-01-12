const CACHE_TTL = 60 * 60 * 12; // 12 hours

function toKhmerNumber(num: number) {
  const KHMER_NUMBERS = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];
  let result = "";
  while (num > 0) {
    result = KHMER_NUMBERS[num % KHMER_NUMBERS.length] + result;
    num = Math.floor(num / KHMER_NUMBERS.length);
  }
  return result;
}

export default defineEventHandler(async (event) => {
  // get API BASE URL from runtime config
  const { apiBaseUrl } = useRuntimeConfig(event);

  // get the query for specific salary level
  const { ten, six } = getQuery(event);

  // get the body of request
  try {
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

    let grades: Array<{ id: number; value: string }> = [];

    if (ten && parseInt(ten.toString()) === 1) {
      grades = Array.from({ length: 10 }, (_, index) => ({
        id: index + 1,
        value: toKhmerNumber(index + 1),
      }));
    } else if (six && parseInt(six.toString()) === 1) {
      grades = Array.from({ length: 6 }, (_, index) => ({
        id: index + 1,
        value: toKhmerNumber(index + 1),
      }));
    } else {
      grades = Array.from({ length: 4 }, (_, index) => ({
        id: index + 1,
        value: toKhmerNumber(index + 1),
      }));
    }

    const res: typeof grades = grades;

    // caching the response for client-side usage
    setResponseHeader(
      event,
      "Cache-Control",
      `public, max-age=${CACHE_TTL}, stale-while-revalidate=60`
    );

    return res;
  } catch (error: any) {
    throw customCreateError(error, "Can't get all salary level grades!");
  }
});
