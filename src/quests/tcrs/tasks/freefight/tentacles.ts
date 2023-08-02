import { $skill, get, have } from "libram";
import { BaggoTask } from "../../../../engine/task";
import { BaggoCombatStrategy } from "../../../../engine/combat";
import { runChoice, useSkill, visitUrl } from "kolmafia";
import { defaultOutfit } from "./shared";

export const freefightTasks: BaggoTask[] = [
  {
    name: "evoke eldritch horror",
    ready: () => have($skill`Evoke Eldritch Horror`),
    completed: () => get("_eldritchHorrorEvoked"),
    outfit: defaultOutfit,
    do: () => useSkill($skill`Evoke Eldritch Horror`),
    combat: new BaggoCombatStrategy().kill(),
  },
  {
    name: "visit stu",
    completed: () => get("_eldritchTentacleFought"),
    outfit: defaultOutfit,
    do: (): void => {
      visitUrl("place.php?whichplace=forestvillage&action=fv_scientist");
      runChoice(1);
    },
    combat: new BaggoCombatStrategy().kill(),
  },
];
