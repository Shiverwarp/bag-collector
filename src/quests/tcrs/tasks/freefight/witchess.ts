import { $item, $monster, get, Macro, Witchess } from "libram";
import { BaggoTask } from "../../../../engine/task";
import { BaggoCombatStrategy } from "../../../../engine/combat";
import { defaultOutfit } from "./shared";
import { myMaxhp, restoreHp } from "kolmafia";

export const freefightTasks: BaggoTask[] = [
  {
    name: "witchess",
    ready: () => Witchess.have(),
    completed: () => get("_witchessFights") >= 5,
    outfit: defaultOutfit,
    do: () => Witchess.fightPiece($monster`Witchess Knight`),
    prepare: (): void => {
      restoreHp(myMaxhp());
    },
    combat: new BaggoCombatStrategy().macro(Macro.tryItem($item`Spooky Putty sheet`)).kill(),
  },
];
