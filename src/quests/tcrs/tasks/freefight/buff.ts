import { cliExecute, Effect } from "kolmafia";
import {
  $effect,
  $effects,
  $item,
  $location,
  CursedMonkeyPaw,
  ensureEffect,
  get,
  getModifier,
  have,
} from "libram";
import { BaggoTask } from "../../../../engine/task";

const blockedEffects: Effect[] = [];
const blockedMonkeyWishes: Effect[] = [];
const blockedGenieWishes: Effect[] = [];

const ensureBuff = (effect: Effect): BaggoTask[] => {
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
        blockedMonkeyWishes.indexOf(effect) > -1 ||
        effect.attributes.includes("nohookah"),
      do: () => {
        CursedMonkeyPaw.wishFor(effect);
        blockedMonkeyWishes.push(effect);
      },
    },
    {
      name: `genie wish ${effect.name}`,
      completed: () =>
        have(effect) ||
        blockedGenieWishes.indexOf(effect) > -1 ||
        effect.attributes.includes("nohookah"),
      do: () => {
        cliExecute(`genie effect ${effect.name}`);
        blockedGenieWishes.push(effect);
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

const famWeightTasks: BaggoTask[] = [];
$effects``
  .filter((effect: Effect) => getModifier("Familiar Weight", effect) > 0)
  .forEach((effect) => {
    famWeightTasks.push(...ensureBuff(effect));
  });

export const BUFF_TASKS: BaggoTask[] = [
  {
    name: "oasis",
    completed: () => have($effect`ultrahydrated`),
    do: $location`The Oasis`,
  },
  ...famWeightTasks,
];
