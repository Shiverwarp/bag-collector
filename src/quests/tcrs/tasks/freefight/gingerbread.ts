import { $item, $location, get, Macro } from "libram";
import { BaggoTask } from "../../../../engine/task";
import { BaggoCombatStrategy } from "../../../../engine/combat";
import { cliExecute } from "kolmafia";
import { defaultOutfit } from "./shared";

export const freefightTasks: BaggoTask[] = [
  {
    name: "gingerbread candies",
    ready: () => get("_gingerbreadCityTurns") === 9,
    completed: () => get("_gingerbreadCityTurns") >= 30,
    do: () => $location`Gingerbread Train Station`,
    choices: {
      1204: 1,
    },
  },
  {
    name: "gingerbread chocolate sculpture",
    ready: () => get("_gingerbreadCityTurns") === 19,
    completed: () => get("_gingerbreadCityTurns") >= 30,
    do: () => $location`Gingerbread Upscale Retail District`,
    prepare: () => cliExecute(`outfit gingerbread best`),
    choices: {
      1209: 2,
      1214: 2,
    },
  },
  {
    name: "gingerbread retail district",
    completed: () => get("_gingerbreadCityTurns") >= 30,
    outfit: defaultOutfit,
    do: () => $location`Gingerbread Upscale Retail District`,
    combat: new BaggoCombatStrategy().macro(Macro.item($item`gingerbread cigarette`)),
    acquire: [
      {
        item: $item`gingerbread cigarette`,
        price: 5000,
      },
    ],
  },
];
