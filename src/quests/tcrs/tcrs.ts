import { BaggoQuest } from "../../engine/task";
import { get } from "libram";
import { NO_ORGAN_TASKS } from "./tasks/diet/noorgan";
import { BUFF_TASKS } from "./tasks/buff";
import { getFreeFightTasks } from "./tasks/freefight/fights";

export const TCRS_QUEST: BaggoQuest = {
  name: "2crs",
  completed: () => !get("baggo_2crs", "") || get("_baggo_freefights") === "true",
  tasks: [...NO_ORGAN_TASKS, ...BUFF_TASKS, ...getFreeFightTasks()],
};
