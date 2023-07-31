import { $item, get, have, Macro } from "libram";
import { BaggoTask } from "../../../../engine/task";
import { BaggoCombatStrategy } from "../../../../engine/combat";
import { defaultOutfit } from "./shared";
import { myMaxhp, restoreHp, use } from "kolmafia";

export const freefightTasks: BaggoTask[] = [
  {
    name: "spooky putty",
    ready: () => have($item`Spooky Putty monster`),
    completed: () => get("spookyPuttyCopiesMade") >= 5,
    outfit: defaultOutfit,
    do: () => use($item`Spooky Putty monster`),
    prepare: (): void => {
      restoreHp(myMaxhp());
    },
    combat: new BaggoCombatStrategy().macro(Macro.tryItem($item`Spooky Putty sheet`)).kill(),
  },
];
