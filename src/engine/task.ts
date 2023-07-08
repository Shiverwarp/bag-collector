import { BaggoCombatStrategy, CombatActions } from "./combat";
import { Quest, Task } from "grimoire-kolmafia";

export type BaggoQuest = Quest<BaggoTask>;
export type BaggoTask = {
  combat?: BaggoCombatStrategy;
} & Task<CombatActions>;
