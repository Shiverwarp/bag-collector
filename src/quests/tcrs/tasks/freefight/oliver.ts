import { $location, get } from "libram";
import { BaggoTask } from "../../../../engine/task";
import { BaggoCombatStrategy } from "../../../../engine/combat";
import { defaultOutfit } from "./shared";

export const freefightTasks: BaggoTask[] = [
  {
    name: "olver's place",
    completed: () => get("_speakeasyFreeFights") >= 3,
    outfit: defaultOutfit,
    do: () => $location`An Unusually Quiet Barroom Brawl`,
    combat: new BaggoCombatStrategy().kill(),
  },
];
