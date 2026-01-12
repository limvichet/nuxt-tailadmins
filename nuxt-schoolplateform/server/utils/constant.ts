export const BAD_REQUEST = {
  code: 400,
  message: "ERROR: Bad Request - Please check your request body.",
};
export const UNAUTHORIZED = {
  code: 401,
  message: "ERROR: Unauthorized - Please login again.",
};
export const FORBIDDEN = {
  code: 403,
  message:
    "ERROR: Forbidden - You don't have permission to access this resource.",
};
export const NOT_FOUND = {
  code: 404,
  message: "ERROR: Not Found - The requested resource could not be found.",
};
export const UNPROCESSABLE_ENTITY = {
  code: 422,
  message: "ERROR: Unprocessable Entity - The request body is not valid.",
};
export const INTERNAL_SERVER_ERROR = {
  code: 500,
  message: "ERROR: Internal Server Error - Something went wrong on our side.",
};
