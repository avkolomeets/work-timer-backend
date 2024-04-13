import { fetchDelete, getJSON, postJSON } from "./fetch-util";
import { TEST_BASE_URL } from "./test-util";

export type TempUser = {
  token: string;
  remove(): Promise<void>;
};

export async function createTempUser(): Promise<TempUser> {
  const username = "Test2";
  const password = "123";
  await postJSON(TEST_BASE_URL + "user", {
    username,
    password,
    fullName: "Test2",
  });
  const { data } = await getJSON(
    TEST_BASE_URL + `getToken?username=${username}&password=${password}`
  );
  const token = (data as any).token as string;
  console.log("Temp user created.");
  const remove = () =>
    fetchDelete(TEST_BASE_URL + "user?token=" + token).then(() => {
      console.log("Temp user removed.");
    });
  return {
    token,
    remove,
  };
}
