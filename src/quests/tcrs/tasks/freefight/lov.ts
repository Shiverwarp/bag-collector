import { get, TunnelOfLove } from "libram";
import { BaggoTask } from "../../../../engine/task";
import { BaggoCombatStrategy } from "../../../../engine/combat";
import { defaultOutfit } from "./shared";
export const freefightTasks: BaggoTask[] = [
  {
    name: "LOV",
    completed: () => get("_loveTunnelUsed"),
    outfit: defaultOutfit,
    do: () =>
      TunnelOfLove.fightAll("LOV Eardigan", "Open Heart Surgery", "LOV Extraterrestrial Chocolate"),
    combat: new BaggoCombatStrategy().kill(),
  },
];
