import {
  ProvinceCreateRequest,
  ProvinceCreateResponse,
} from "~/schemas/address/province";

export default defineEventHandler(async (event) => {
  // get API BASE URL from runtime config
  const { apiBaseUrl } = useRuntimeConfig(event);

  // get the body of request
  const body: ProvinceCreateRequest = await readBody(event);

  // get the cookie request
  const token = getRequestToken(event, "1EZ_auth");
  if (!token) {
    throw createError({
      statusCode: UNAUTHORIZED.code,
      statusMessage: UNAUTHORIZED.message,
    });
  }

  try {
    const res = await $fetch<ProvinceCreateResponse>(
      `${apiBaseUrl}/admin-secure/locations/provinces`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    return res;
  } catch (error: any) {
    throw customCreateError(error, "Can't create province!");
  }
});
