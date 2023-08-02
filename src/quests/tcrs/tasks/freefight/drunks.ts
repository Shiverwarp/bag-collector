import { $item, $location, $monster, $skill, get, Macro } from "libram";
import { BaggoTask } from "../../../../engine/task";
import { BaggoCombatStrategy } from "../../../../engine/combat";
import { defaultOutfit } from "./shared";

export const freefightTasks: BaggoTask[] = [
  {
    name: "drunk pygmy",
    completed: () => get("_drunkPygmyBanishes", 0) >= 11,
    outfit: defaultOutfit,
    do: () => $location`The Hidden Bowling Alley`,
    combat: new BaggoCombatStrategy()
      .macro(Macro.skill($skill`Snokebomb`), $monster`pygmy bowler`)
      .macro(Macro.skill($skill`Feel Hatred`), $monster`pygmy orderlies`)
      .macro(
        Macro.trySkill($skill`Bowl a Curveball`).item($item`Louder Than Bomb`),
        $monster`pygmy janitor`
      )
      .kill(),
    acquire: [
      {
        item: $item`Bowl of Scorpions`,
        price: 1000,
      },
    ],
  },
];
