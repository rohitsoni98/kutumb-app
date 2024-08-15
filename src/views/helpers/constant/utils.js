export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const DEFAULT_ERROR_MESSAGE = "Something went wrong";
export const UNAUTHORIZED_MESSAGE = "Unauthorized, Redirecting to Home Page";

export const getFromPath = (row, accessor = "") => {
  const pathArr = accessor?.split(".");
  let clone = { ...row };

  let current = 0;
  while (pathArr[current] && current < pathArr.length - 1) {
    clone = clone[pathArr[current++]];
  }
  return clone?.[pathArr?.[current]] ?? "";
};
