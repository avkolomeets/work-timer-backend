import { ERROR_CODES } from "../../utils/response/error-util";
import { addCase } from "../utils/test-util";

export function addUserTests(): void {
  const scope = "user";
  const username = "test2";
  const password = "123";

  // CHECK
  addCase(
    "get",
    "checkUserName?username=" + username,
    null,
    ({ data }) => !data.exists,
    scope,
    "Check user name"
  );

  // CREATE
  addCase(
    "post",
    "user",
    { username, fullName: "Test2", password },
    ({ data }) => !!data.fullName,
    scope,
    "Create new user"
  );

  // CHECK (after creation)
  addCase(
    "get",
    "checkUserName?username=" + username,
    null,
    ({ data }) => !!data.exists,
    scope,
    "Check user name - after creation"
  );

  // CREATE (with the same name)
  addCase(
    "post",
    "user",
    { username, fullName: "Test2", password },
    ({ code }) => code === ERROR_CODES.badRequest,
    scope,
    "Create user with the same name"
  );

  // AUTH
  let token = "";
  addCase(
    "get",
    `getToken?username=${username}&password=${password}`,
    null,
    ({ data }) => !!(token = data.token),
    scope,
    "Authorize"
  );

  // READ (correct token)
  addCase(
    "get",
    () => "user?token=" + token,
    null,
    ({ data }) => !!data.fullName,
    scope,
    "Read user data - correct token"
  );

  // READ (no token)
  addCase(
    "get",
    () => "user",
    null,
    ({ code }) => code === ERROR_CODES.tokenRequired,
    scope,
    "Read user data - no token"
  );

  // READ (incorrect token)
  addCase(
    "get",
    () => "user?token=abc",
    null,
    ({ code }) => code === ERROR_CODES.tokenInvalid,
    scope,
    "Read user data - incorrect token"
  );

  // UPDATE
  addCase(
    "patch",
    () => "user",
    () => ({ token, fullName: "Test2_NEW" }),
    ({ data }) => data.fullName === "Test2_NEW",
    scope,
    "Update user fullName"
  );

  // READ (after updating)
  addCase(
    "get",
    () => "user?token=" + token,
    null,
    ({ data }) => data.fullName === "Test2_NEW",
    scope,
    "Read after updating"
  );

  // DELETE
  addCase(
    "delete",
    () => "user?token=" + token,
    null,
    ({ data }) => !!data.success,
    scope,
    "Delete user"
  );
}
