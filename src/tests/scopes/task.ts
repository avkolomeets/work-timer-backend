import { ERROR_CODE_TOKEN_REQUIRED } from "../../utils/error-util";
import { TempUser, createTempUser } from "../utils/test-user-util";
import { addCase } from "../utils/test-util";

export function addTaskTests(): void {
  const scope = "task";

  const taskTemplate = {
    year: 2024,
    month: 4,
    link: "19537",
    label: "AI fixes",
    time: 7200000,
    type: "bug",
    created: 1712230165586,
    modified: 1712237002161,
  };

  let tempUser: TempUser;
  let taskId: string;

  // CREATE
  addCase(
    "post",
    "task",
    async () => {
      tempUser = await createTempUser();
      return {
        token: tempUser.token,
        ...taskTemplate,
      };
    },
    ({ data }) => {
      taskId = data.id;
      return data.link === taskTemplate.link;
    },
    scope,
    "Create new task"
  );

  // READ (by id)
  addCase(
    "get",
    () => `task/${taskId}?token=${tempUser.token}`,
    null,
    ({ data }) => data.id === taskId && data.link === taskTemplate.link,
    scope,
    "Read task"
  );

  // READ (by id, no token)
  addCase(
    "get",
    () => `task/${taskId}`,
    null,
    ({ code }) => code === ERROR_CODE_TOKEN_REQUIRED,
    scope,
    "Read task (no token)"
  );

  // READ (all)
  addCase(
    "get",
    () =>
      `tasks?token=${tempUser.token}&year=${taskTemplate.year}&month=${taskTemplate.month}`,
    null,
    ({ data }) =>
      data.length === 1 &&
      data[0].id === taskId &&
      data[0].link === taskTemplate.link,
    scope,
    "Read all tasks"
  );

  // READ (all from empty source)
  addCase(
    "get",
    () =>
      `tasks?token=${tempUser.token}&year=${taskTemplate.year}&month=${
        taskTemplate.month + 1
      }`,
    null,
    ({ data }) => !data.length,
    scope,
    "Read all tasks (from empty source)"
  );

  // UPDATE
  addCase(
    "put",
    () => `task/${taskId}`,
    () => ({ token: tempUser.token, label: "Updated label" }),
    ({ data }) => data.id === taskId && data.label === "Updated label",
    scope,
    "Update task"
  );

  // DELETE
  addCase(
    "delete",
    () => `task/${taskId}?token=${tempUser.token}`,
    null,
    async ({ data }) => {
      await tempUser.remove();
      return data.success;
    },
    scope,
    "Delete task"
  );
}
