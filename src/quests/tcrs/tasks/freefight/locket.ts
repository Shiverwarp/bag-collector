import { get } from "libram";
import { BaggoTask } from "../../../../engine/task";
import { BaggoCombatStrategy } from "../../../../engine/combat";
import { cliExecute } from "kolmafia";
import { defaultOutfit } from "./shared";

export const freefightTasks: BaggoTask[] = [
  {
    name: "locket 1",
    completed: () => get("_locketMonstersFought").indexOf("1936") > -1,
    outfit: defaultOutfit,
    do: () => cliExecute("reminisce witchess knight"),
    combat: new BaggoCombatStrategy().kill(),
  },
  {
    name: "locket 2",
    completed: () => get("_locketMonstersFought").indexOf("1938") > -1,
    outfit: defaultOutfit,
    do: () => cliExecute("reminisce witchess bishop"),
    combat: new BaggoCombatStrategy().kill(),
  },
  {
    name: "locket 3",
    completed: () => get("_locketMonstersFought").indexOf("1942") > -1,
    outfit: defaultOutfit,
    do: () => cliExecute("reminisce witchess rook"),
    combat: new BaggoCombatStrategy().kill(),
  },
];
