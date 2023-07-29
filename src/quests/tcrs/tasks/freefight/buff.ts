import { cliExecute, Effect } from "kolmafia";
import {
  $effects,
  $item,
  // BeachComb,
  CursedMonkeyPaw,
  // Witchess,
  ensureEffect,
  get,
  getModifier,
  have,
} from "libram";
import { BaggoTask } from "../../../../engine/task";

const blockedEffects: Effect[] = [];
const blockedMonkeyWishes: Effect[] = [];
const blockedGenieWishes: Effect[] = [];

const ensureTask = (effect: Effect): BaggoTask[] => {
  return [
    {
      name: `gain ${effect.name}`,
      completed: () => have(effect) || blockedEffects.indexOf(effect) > -1,
      do: () => {
        try {
          ensureEffect(effect);
        } catch (e) {
          blockedEffects.push(effect);
        }
      },
    },
    {
      name: `monkey wish ${effect.name}`,
      completed: () =>
        have(effect) ||
        get("_monkeyPawWishesUsed") >= 5 ||
        blockedMonkeyWishes.indexOf(effect) > -1,
      do: () => {
        CursedMonkeyPaw.wishFor(effect);
      },
    },
    {
      name: `genie wish ${effect.name}`,
      completed: () => have(effect) || blockedGenieWishes.indexOf(effect) > -1,
      do: () => {
        cliExecute(`genie effect ${effect.name}`);
      },
      acquire: [
        {
          item: $item`pocket wish`,
          price: 50000,
        },
      ],
    },
  ];
};

const famWeightTasks: BaggoTask[] = $effects``
  .filter((effect: Effect) => getModifier("Familiar Weight", effect) > 0)
  .reduce((tasks: any, effect) => tasks.push(ensureTask(effect)), []);

export const BUFF_TASKS: BaggoTask[] = [
  // {
  //   name: "Beach buff",
  //   ready: () => have($item`beach comb`),
  //   completed: () => have($effect`Do I Know You From Somewhere?`),
  //   do: () => BeachComb.tryHead($effect`Do I Know You From Somewhere?`),
  // },
  // {
  //   name: "Witchess buff",
  //   ready: () => Witchess.have(),
  //   completed: () => get("_witchessBuff"),
  //   do: () => Witchess,
  // },
  ...famWeightTasks,
];
