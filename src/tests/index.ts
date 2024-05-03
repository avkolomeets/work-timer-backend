import dotenv from "dotenv";
dotenv.config();

import { addDayTests } from "./scopes/days";
import { addDeptTests } from "./scopes/dept";
import { addTaskTests } from "./scopes/tasks";
import { addUserTests } from "./scopes/user";
import { runTests } from "./utils/test-util";

addUserTests();
addDayTests();
addDeptTests();
addTaskTests();
runTests();
