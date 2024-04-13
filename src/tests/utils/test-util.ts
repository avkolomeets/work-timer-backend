import chalk from "chalk";
import { fetchDelete, getJSON, postJSON, putJSON } from "./fetch-util";

const errorMsg = chalk.bgKeyword("white").redBright;
const successMsg = chalk.bgKeyword("green").white;

export const TEST_BASE_URL = "http://localhost:5000/api/";

const cases: (() => Promise<boolean>)[] = [];

export function addCase(
  method: "get" | "post" | "put" | "delete",
  suffixUrl: string | (() => string),
  data: any | (() => any),
  expected: (res: { code: number; data: any }) => boolean | Promise<boolean>,
  scope: string,
  description: string
): void {
  const testIndex = cases.length;
  const action = async () => {
    data = await (typeof data === "function" ? data() : data);
    const url =
      TEST_BASE_URL +
      (typeof suffixUrl === "function" ? suffixUrl() : suffixUrl);
    const promise =
      method === "get"
        ? getJSON(url)
        : method === "post"
        ? postJSON(url, data)
        : method === "put"
        ? putJSON(url, data)
        : fetchDelete(url);
    return promise.then(async (res) => {
      const pass = await expected(res);
      if (!pass) {
        console.log(
          `Test ${scope}/#${testIndex}. ${description}. Failed. Reason: unexpected result.`
        );
        console.log("Current result:");
        console.log(res);
        return false;
      }
      console.log(`Test ${scope}/#${testIndex}. ${description}. Passed.`);
      console.log(res);
      return true;
    });
  };
  cases.push(action);
}

export async function runTests(): Promise<void> {
  // run tests
  for (const testCase of cases) {
    const res = await testCase();
    if (!res) {
      console.log(errorMsg("Tests failed."));
      return;
    }
  }
  console.log(successMsg("All tests passed."));
}
