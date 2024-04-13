import { removeMissingProperties } from "../json-util";

/**
 * Creates a secret key based on username and password.
 */
export function userDataToKey(
  username: string,
  password: string,
  addTimeStamp?: boolean
): string {
  return _reverseString(
    _utf8_to_b64(
      JSON.stringify(
        removeMissingProperties({
          username,
          password,
          created: addTimeStamp ? Date.now() : undefined,
        })
      )
    )
  );
}

/**
 * Parses key to get user day.
 */
export function userDataFromKey(key: string): {
  username: string;
  password: string;
  created?: number;
} | null {
  try {
    return JSON.parse(_b64_to_utf8(_reverseString(key || ""))) || null;
  } catch (e) {
    return null;
  }
}

function _utf8_to_b64(str: string): string {
  return btoa(unescape(encodeURIComponent(str)));
}

function _b64_to_utf8(str: string): string {
  return decodeURIComponent(escape(atob(str)));
}

/** Additional protection. */
function _reverseString(s: string): string {
  return s.split("").reverse().join("");
}
