export const toNumberOrUndefined = (v: any): number | undefined =>
  v == null ? v : +v;
