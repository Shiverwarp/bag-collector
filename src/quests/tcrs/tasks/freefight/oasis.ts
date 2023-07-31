import { $item, $location, $monster, $skill, get, Macro } from "libram";
import { BaggoTask } from "../../../../engine/task";
import { BaggoCombatStrategy } from "../../../../engine/combat";
import { defaultOutfit } from "./shared";

export const freefightTasks: BaggoTask[] = [
  {
    name: "oasis",
    completed: () => get("breathitinCharges", 0) === 0,
    outfit: defaultOutfit,
    do: () => $location`The Oasis`,
    combat: new BaggoCombatStrategy()
      .macro(Macro.skill($skill`Snokebomb`), $monster`blur`)
      .macro(Macro.skill($skill`Feel Hatred`), $monster`oasis monster`)
      .macro(
        Macro.trySkill($skill`Bowl a Curveball`).item($item`Louder Than Bomb`),
        $monster`rolling stone`
      )
      .kill(),
  },
];
