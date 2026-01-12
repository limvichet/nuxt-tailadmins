import { chPWForm } from "~/schemas/auth";

export default defineEventHandler(async (event) => {
  try {
    const { apiBaseUrl } = useRuntimeConfig(event);
    const body = await readBody<chPWForm>(event);

    const res = await $fetch<{ message: string; code: number }>(
      `${apiBaseUrl}/admin-secure/change-password`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${getRequestToken(event, "1EZ_auth")}`,
        },
        body: JSON.stringify(body),
      }
    );

    return res;
  } catch (error: any) {
    throw customCreateError(error, "Can't change password!");
  }
});
