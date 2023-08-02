import { OutfitSpec } from "grimoire-kolmafia";
import { cliExecute, Item, mallPrice, restoreMp } from "kolmafia";
import { $effect, $familiar, $item, $location, $monsters, $skill, get, have, Macro } from "libram";
import { args } from "../../../../args";
import { BaggoTask } from "../../../../engine/task";
import { BaggoCombatStrategy } from "../../../../engine/combat";

const defaultOutfit = (partialItems: Item[]) => (): OutfitSpec => ({
  equip: [
    ...partialItems,
    $item`lucky gold ring`,
    $item`Mr. Cheeng's spectacles`,
    $item`tiny stillsuit`,
    get("_sweatOutSomeBoozeUsed") < 3 && get("sweat", 0) < 100
      ? $item`designer sweatpants`
      : $item`Pantsgiving`,
  ],
  modifier: `100 familiar experience 11 max, 0.1 item`,
  familiar: $familiar`Grey Goose`,
});

const combatStrat = (partialMacro: Macro) => {
  return new BaggoCombatStrategy()
    .banish($monsters`blur, oasis monster, rolling stone`)
    .macro(new Macro().trySkill($skill`Emit Matter Duplicating Drones`))
    .macro(partialMacro)
    .kill();
};

export const freefightTasks: BaggoTask[] = [
  {
    name: `genie wish ultrahydrated`,
    completed: () => have($effect`Ultrahydrated`),
    do: (): void => {
      cliExecute(`genie effect ultrahydrated`);
    },
    acquire: [
      {
        item: $item`pocket wish`,
        price: 50000,
      },
    ],
  },
  {
    name: "oasis",
    completed: () => get("breathitinCharges", 0) === 0,
    outfit: defaultOutfit([]),
    do: () => $location`The Oasis`,
    combat: combatStrat(new Macro()),
  },
  {
    name: "shattering punch",
    ready: () => have($skill`Shattering Punch`),
    completed: () => get("_shatteringPunchUsed", 0) >= 3,
    do: () => $location`The Oasis`,
    prepare: (): void => {
      restoreMp(50);
    },
    outfit: defaultOutfit([$item`carnivorous potted plant`]),
    choices: { 1324: 5 },
    combat: combatStrat(new Macro().trySkill($skill`Shattering Punch`)),
  },
  {
    name: "gingerbread mob hit",
    ready: () => have($skill`Gingerbread Mob Hit`),
    completed: () => get("_gingerbreadMobHitUsed"),
    do: () => $location`The Oasis`,
    prepare: (): void => {
      restoreMp(50);
    },
    outfit: defaultOutfit([$item`carnivorous potted plant`]),
    choices: { 1324: 5 },
    combat: combatStrat(new Macro().trySkill($skill`Gingerbread Mob Hit`)),
  },
  {
    name: "chest x-ray",
    ready: () => have($item`Lil' Doctor™ bag`),
    completed: () => get("_chestXRayUsed", 0) >= 3,
    do: () => $location`The Oasis`,
    outfit: defaultOutfit([$item`carnivorous potted plant`, $item`Lil' Doctor™ bag`]),
    choices: { 1324: 5 },
    combat: combatStrat(new Macro().trySkill($skill`Chest X-Ray`)),
  },
  {
    name: "jokester's gun",
    ready: () => have($item`The Jokester's gun`),
    completed: () => get("_firedJokestersGun"),
    do: () => $location`The Oasis`,
    outfit: (): OutfitSpec => ({
      equip: [
        $item`The Jokester's gun`,
        $item`lucky gold ring`,
        $item`Mer-kin breastplate`,
        $item`hewn moon-rune spoon`,
        get("_sweatOutSomeBoozeUsed") < 3 && get("sweat", 0) < 100
          ? $item`designer sweatpants`
          : $item`Pantsgiving`,
      ],
      modifier: `+item`,
      familiar: $familiar`Grey Goose`,
    }),
    choices: { 1324: 5 },
    combat: combatStrat(new Macro().trySkill($skill`Fire the Jokester's Gun`)),
  },
  {
    name: "replica bat-oomerang",
    ready: () => have($item`replica bat-oomerang`),
    completed: () => get("_usedReplicaBatoomerang", 0) >= 3,
    do: () => $location`The Oasis`,
    outfit: defaultOutfit([$item`carnivorous potted plant`]),
    choices: { 1324: 5 },
    combat: combatStrat(new Macro().tryItem($item`replica bat-oomerang`)),
  },
  {
    name: "powdered madness",
    ready: () => mallPrice($item`powdered madness`) < args.bagvalue,
    completed: () => get("_powderedMadnessUses", 0) >= 5,
    do: () => $location`The Oasis`,
    outfit: defaultOutfit([$item`carnivorous potted plant`]),
    choices: { 1324: 5 },
    combat: combatStrat(new Macro().tryItem($item`powdered madness`)),
    acquire: [
      {
        item: $item`powdered madness`,
        price: args.bagvalue,
      },
    ],
  },
  {
    name: "shadow brick",
    ready: () => mallPrice($item`shadow brick`) < args.bagvalue,
    completed: () => get("_shadowBricksUsed", 0) >= 13,
    do: () => $location`The Oasis`,
    outfit: defaultOutfit([$item`carnivorous potted plant`]),
    choices: { 1324: 5 },
    combat: combatStrat(new Macro().tryItem($item`shadow brick`)),
    acquire: [
      {
        item: $item`shadow brick`,
        price: args.bagvalue,
      },
    ],
  },
];
