import { registerFormFull, RegisterREQ, RegisterRES } from "~/schemas/auth";

export default defineEventHandler(async (event) => {
  try {
    const { apiBaseUrl } = useRuntimeConfig(event);
    const body: RegisterREQ = await readBody(event);

    const parsedBody = registerFormFull.parse(body);
    const { token } = await $fetch<RegisterRES>(
      `${apiBaseUrl}/admin-public/register`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedBody),
      }
    );

    // Set secure HTTP-only cookie
    setCookie(event, "1EZ_auth", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 days
    });
  } catch (error: any) {
    throw customCreateError(error, "Can't register!");
  }
});
