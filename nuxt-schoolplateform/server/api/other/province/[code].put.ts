import {
  ProvinceUpdateRequest,
  ProvinceUpdateResponse,
} from "~/schemas/address/province";

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
  const body: ProvinceUpdateRequest = await readBody(event);

  // get the cookie request
  const token = getRequestToken(event, "1EZ_auth");
  if (!token) {
    throw createError({
      statusCode: UNAUTHORIZED.code,
      statusMessage: UNAUTHORIZED.message,
    });
  }

  try {
    const res = await $fetch<ProvinceUpdateResponse>(
      `${apiBaseUrl}/admin-secure/locations/provinces/${code}`,
      {
        method: "PUT",
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
    throw customCreateError(error, "Can't update province!");
  }
});
