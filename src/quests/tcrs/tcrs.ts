import { BaggoQuest } from "../../engine/task";
import { get } from "libram";
import { NO_ORGAN_TASKS } from "./tasks/diet/noorgan";
import { ORGAN_TASKS } from "./tasks/diet/organ";
import { BUFF_TASKS } from "./tasks/freefight/buff";

export const TCRS_QUEST: BaggoQuest = {
  name: "2crs",
  completed: () => get("baggo_2crs") === "true" && get("_baggo_freefights") === "true",
  tasks: [...NO_ORGAN_TASKS, ...ORGAN_TASKS, ...BUFF_TASKS],
};
