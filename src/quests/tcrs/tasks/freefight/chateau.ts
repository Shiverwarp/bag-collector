import { $item, ChateauMantegna, get, Macro } from "libram";
import { BaggoTask } from "../../../../engine/task";
import { BaggoCombatStrategy } from "../../../../engine/combat";
import { defaultOutfit } from "./shared";

export const freefightTasks: BaggoTask[] = [
  {
    name: "chateau",
    ready: ChateauMantegna.have,
    completed: () => get("_chateauMonsterFought"),
    do: (): void => {
      ChateauMantegna.fightPainting();
    },
    outfit: defaultOutfit,
    combat: new BaggoCombatStrategy().macro(Macro.tryItem($item`Spooky Putty sheet`)).kill(),
  },
];
