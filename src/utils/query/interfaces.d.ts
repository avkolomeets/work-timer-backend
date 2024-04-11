export type Request<T = any> = {
  params: any;
  query: T;
  body: T;
};
