import { ERROR_CODES } from "../../utils/response/error-util";
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
    "tasks",
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
    () => `tasks/${taskId}?token=${tempUser.token}`,
    null,
    ({ data }) => data.id === taskId && data.link === taskTemplate.link,
    scope,
    "Read task"
  );

  // READ (by id, no token)
  addCase(
    "get",
    () => `tasks/${taskId}`,
    null,
    ({ code }) => code === ERROR_CODES.tokenRequired,
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
    "patch",
    () => `tasks/${taskId}`,
    () => ({ token: tempUser.token, label: "Updated label" }),
    ({ data }) => data.id === taskId && data.label === "Updated label",
    scope,
    "Update task"
  );

  // DELETE
  addCase(
    "delete",
    () => `tasks/${taskId}?token=${tempUser.token}`,
    null,
    async ({ data }) => {
      await tempUser.remove();
      return data.success;
    },
    scope,
    "Delete task"
  );
}
