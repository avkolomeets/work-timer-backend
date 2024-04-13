import { addDayTests } from "./scopes/day";
import { addDeptTests } from "./scopes/dept";
import { addTaskTests } from "./scopes/task";
import { addUserTests } from "./scopes/user";
import { runTests } from "./utils/test-util";

addUserTests();
addDayTests();
addDeptTests();
addTaskTests();
runTests();
