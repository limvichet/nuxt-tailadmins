export default defineEventHandler(async (event) => {
  // get API BASE URL from runtime config
  const { apiBaseUrl } = useRuntimeConfig(event);

  // get the route params
  const code = getRouterParam(event, "code");
  const onlyNumberAnd11Digits = /^[0-9]{11}$/;
  // get the cookie request
  const token = getRequestToken(event, "1EZ_auth");

  if (!token) {
    throw createError({
      statusCode: UNAUTHORIZED.code,
      statusMessage: UNAUTHORIZED.message,
    });
  }

  if (code && onlyNumberAnd11Digits.test(code)) {
    try {
      await $fetch(`${apiBaseUrl}/admin-secure/locations/locations/${code}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return {
        success: true,
        isFree: false,
        message: "This code is not free!",
      };
    } catch (error: any) {
      return { success: true, isFree: true, message: "This code free to use!" };
    }
  } else {
    return {
      success: false,
      isFree: false,
      message: "Invalid code!",
    };
  }
});
