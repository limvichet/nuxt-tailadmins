import { User } from "~/schemas/auth";

export default defineEventHandler(async (event) => {
  // get API BASE URL from runtime config
  const { apiBaseUrl } = useRuntimeConfig(event);

  // get the body of request
  try {
    const token = getRequestToken(event);
    if (!token)
      throw createError({
        statusCode: UNAUTHORIZED.code,
        statusMessage: UNAUTHORIZED.message,
      });

    const res = await $fetch<User>(`${apiBaseUrl}/admin-secure/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return res;
  } catch (error: any) {
    throw customCreateError(error, "Can't get user!");
  }
});
