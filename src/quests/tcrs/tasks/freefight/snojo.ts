import { $location, get } from "libram";
import { BaggoTask } from "../../../../engine/task";
import { BaggoCombatStrategy } from "../../../../engine/combat";
import { runChoice, visitUrl } from "kolmafia";
import { defaultOutfit } from "./shared";

export const freefightTasks: BaggoTask[] = [
  {
    name: "Set Snojo",
    completed: () => !!get("snojoSetting"),
    do: (): void => {
      visitUrl("place.php?whichplace=snojo&action=snojo_controller");
      runChoice(3);
    },
  },
  {
    name: "snojo",
    completed: () => get("_snojoFreeFights") >= 10,
    outfit: defaultOutfit,
    do: () => $location`The X-32-F Combat Training Snowman`,
    combat: new BaggoCombatStrategy().kill(),
  },
];
