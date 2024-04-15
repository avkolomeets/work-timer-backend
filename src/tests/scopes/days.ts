import { ERROR_CODES } from "../../utils/response/error-util";
import { TempUser, createTempUser } from "../utils/test-user-util";
import { addCase } from "../utils/test-util";

export function addDayTests(): void {
  const scope = "day";

  const dayTemplate = {
    year: 2024,
    month: 4,
    day: 11,
    time: 30165656,
    workIntervals: [],
  };

  let tempUser: TempUser;

  // CREATE
  addCase(
    "post",
    "day",
    async () => {
      tempUser = await createTempUser();
      return {
        token: tempUser.token,
        ...dayTemplate,
      };
    },
    ({ data }) => {
      return data.time === dayTemplate.time;
    },
    scope,
    "Create new day"
  );

  // READ
  addCase(
    "get",
    () =>
      `day?token=${tempUser.token}&year=${dayTemplate.year}&month=${dayTemplate.month}&day=${dayTemplate.day}`,
    null,
    ({ data }) => data.time === dayTemplate.time,
    scope,
    "Read day"
  );

  // READ (no token)
  addCase(
    "get",
    () =>
      `day?year=${dayTemplate.year}&month=${dayTemplate.month}&day=${dayTemplate.day}`,
    null,
    ({ code }) => code === ERROR_CODES.tokenRequired,
    scope,
    "Read day (no token)"
  );

  // READ (all)
  addCase(
    "get",
    () =>
      `days?token=${tempUser.token}&year=${dayTemplate.year}&month=${dayTemplate.month}`,
    null,
    ({ data }) => data.length === 1 && data[0].time === dayTemplate.time,
    scope,
    "Read all days"
  );

  // READ (all from empty source)
  addCase(
    "get",
    () =>
      `days?token=${tempUser.token}&year=${dayTemplate.year}&month=${
        dayTemplate.month + 1
      }`,
    null,
    ({ data }) => !data.length,
    scope,
    "Read all days (from empty source)"
  );

  // UPDATE
  addCase(
    "patch",
    () =>
      `day?token=${tempUser.token}&year=${dayTemplate.year}&month=${dayTemplate.month}&day=${dayTemplate.day}`,
    () => ({ time: 1000, workIntervals: [[2000, 3000]] }),
    ({ data }) => data.time === 1000 && data.workIntervals[0][1] === 3000,
    scope,
    "Update day"
  );

  // DELETE
  addCase(
    "delete",
    () =>
      `day?token=${tempUser.token}&year=${dayTemplate.year}&month=${dayTemplate.month}&day=${dayTemplate.day}`,
    null,
    async ({ data }) => {
      await tempUser.remove();
      return data.success;
    },
    scope,
    "Delete day"
  );
}
