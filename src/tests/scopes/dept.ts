import { ERROR_CODE_TOKEN_REQUIRED } from "../../utils/error-util";
import { TempUser, createTempUser } from "../utils/test-user-util";
import { addCase } from "../utils/test-util";

export function addDeptTests(): void {
  const scope = "dept";
  let tempUser: TempUser;

  // CREATE
  addCase(
    "post",
    "dept",
    async () => {
      tempUser = await createTempUser();
      return { token: tempUser.token, dept: 1000 };
    },
    ({ data }) => data.dept === 1000,
    scope,
    "Create new dept"
  );

  // READ
  addCase(
    "get",
    () => "dept?token=" + tempUser.token,
    null,
    ({ data }) => data.dept === 1000,
    scope,
    "Read dept"
  );

  // READ (no token)
  addCase(
    "get",
    "dept",
    null,
    ({ code }) => code === ERROR_CODE_TOKEN_REQUIRED,
    scope,
    "Read dept (no token)"
  );

  // UPDATE
  addCase(
    "put",
    "dept",
    () => ({ token: tempUser.token, dept: 2000 }),
    ({ data }) => data.dept === 2000,
    scope,
    "Update dept"
  );

  // DELETE
  addCase(
    "delete",
    () => "dept?token=" + tempUser.token,
    null,
    async ({ data }) => {
      await tempUser.remove();
      return data.success;
    },
    scope,
    "Delete dept"
  );
}
