import { fetchDelete, getJSON, postJSON, putJSON } from "./fetch-util";

const BASE_URL = "http://localhost:5000/api/";

const cases: (() => Promise<boolean>)[] = [];

function _addCase(
  method: "get" | "post" | "put" | "delete",
  suffixUrl: string | (() => string),
  data: any,
  expected: (res: any) => boolean
): void {
  const testIndex = cases.length;
  const action = async () => {
    const url =
      BASE_URL + (typeof suffixUrl === "function" ? suffixUrl() : suffixUrl);
    const promise =
      method === "get"
        ? getJSON(url)
        : method === "post"
        ? postJSON(url, data)
        : method === "put"
        ? putJSON(url, data)
        : fetchDelete(url);
    return promise.then((res) => {
      if (!expected(res)) {
        console.log(`Test #${testIndex} failed. Reason: unexpected result.`);
        console.log("Current result:");
        console.log(res);
        return false;
      }
      console.log(`Test #${testIndex} passed.`);
      console.log(res);
      return true;
    });
  };
  cases.push(action);
}

export async function runTest01(): Promise<void> {
  // add tests
  _addCase("get", "checkUserName?username=test2", null, (res) => !res.exists);
  _addCase(
    "post",
    "user",
    { username: "test2", fullName: "Test2", password: "123" },
    (res) => !!res.fullName
  );
  let token = "";
  _addCase(
    "get",
    "getToken?username=test2&password=123",
    null,
    (res) => !!(token = res.token)
  );
  _addCase(
    "get",
    () => "user?token=" + token,
    null,
    (res) => !!res.fullName
  );
  _addCase(
    "delete",
    () => "user?token=" + token,
    null,
    (res) => !!res.success
  );

  // run tests
  for (const testCase of cases) {
    const res = await testCase();
    if (!res) {
      console.log("Tests failed.");
      return;
    }
  }
  console.log("All tests passed.");
}
