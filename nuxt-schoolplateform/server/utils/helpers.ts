import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import type { H3Event } from "h3";
import { FetchError } from "ofetch";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "./constant";
import { ZodError } from "zod";

const ALGORITHM = "aes-256-gcm";
export const encryptString = (text: string, HEX_SECRET: string) => {
  const KEY = Buffer.from(HEX_SECRET, "hex");
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, KEY, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");
  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
};

export const decryptString = (hash: string, HEX_SECRET: string) => {
  const KEY = Buffer.from(HEX_SECRET, "hex");
  const [ivHex, authTagHex, encryptedText] = hash.split(":");

  if (!ivHex || !authTagHex || !encryptedText) {
    throw new Error("Invalid cipher text format.");
  }

  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const decipher = createDecipheriv(ALGORITHM, KEY, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

export const getRequestToken = (
  event: H3Event,
  tokenName: string = "1EZ_auth"
): string | null => {
  const authHeader = getRequestHeader(event, "authorization");
  const prefixStr = "Bearer ";
  if (authHeader && authHeader.startsWith(prefixStr)) {
    return authHeader.substring(prefixStr.length);
  }
  const cookie = getCookie(event, tokenName);
  return cookie || null;
};

export const customCreateError = (error: any, message?: string) => {
  // Handle Generic / Unknown Errors (Safe Fallback)
  const isDev = process.env.NODE_ENV === "development";

  // Handle Zod Validation Errors
  if (error instanceof ZodError) {
    return createError({
      statusCode: BAD_REQUEST.code,
      statusMessage: BAD_REQUEST.message,
      message: "Validation Error",
      data: error.formErrors.fieldErrors,
    });
  }

  // Handle Fetch Errors (e.g., calling another API failed)
  if (error instanceof FetchError) {
    return createError({
      statusCode:
        error.response?.status ||
        error.statusCode ||
        INTERNAL_SERVER_ERROR.code,
      statusMessage: error.statusMessage || error.message,
      message: isDev ? error.message : message ?? INTERNAL_SERVER_ERROR.message,
      data: isDev ? error.data : undefined,
    });
  }

  // Handle Existing H3 Errors (to prevent double wrapping)
  if (error.statusCode && error.statusMessage) {
    return createError(error);
  }

  return createError({
    statusCode: INTERNAL_SERVER_ERROR.code,
    statusMessage: INTERNAL_SERVER_ERROR.message,
    message: isDev ? error.message : message ?? INTERNAL_SERVER_ERROR.message,
    data: isDev ? error : undefined,
  });
};
