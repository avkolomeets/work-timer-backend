/**
 * Removes undefined and null.
 */
export function removeMissingProperties<T extends Record<string, any>>(
  obj: T
): T {
  obj &&
    Object.keys(obj).forEach((key) => {
      if (obj[key] == null) {
        delete obj[key];
      }
    });
  return obj;
}
