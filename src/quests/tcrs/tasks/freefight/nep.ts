import { OutfitSpec } from "grimoire-kolmafia";
import {
  familiarWeight,
  Item,
  mallPrice,
  restoreMp,
  runChoice,
  toUrl,
  visitUrl,
  weightAdjustment,
} from "kolmafia";
import {
  $familiar,
  $familiars,
  $item,
  $location,
  $monsters,
  $skill,
  get,
  have,
  Macro,
} from "libram";
import { args } from "../../../../args";
import { BaggoTask } from "../../../../engine/task";
import { BaggoCombatStrategy } from "../../../../engine/combat";
import { BaggoEngine } from "../../../../engine/engine";

const combatStrat = (partialMacro: Macro) => {
  return new BaggoCombatStrategy()
    .banish($monsters`biker, party girl, "plain" girl`)
    .macro(
      () =>
        Macro.step("pickpocket")
          .if_(`match "unremarkable duffel bag" || match "van key"`, BaggoEngine.runMacro())
          .step(partialMacro),
      $monsters`burnout, jock`
    )
    .kill();
};

const defaultOutfit = (partialItems: Item[]) => (): OutfitSpec => ({
  equip: [
    ...partialItems,
    $item`June cleaver`,
    $item`gnomish housemaid's kgnee`,
    get("_sweatOutSomeBoozeUsed") < 3 && get("sweat", 0) < 100
      ? $item`designer sweatpants`
      : $item`Pantsgiving`,
  ],
  modifier: `+familiar weight`,
  familiar: $familiar`Reagnimated Gnome`,
});

export const freefightTasks: BaggoTask[] = [
  {
    name: "Party Fair",
    completed: () => get("_questPartyFair") !== "unstarted" || args.buff,
    do: (): void => {
      visitUrl(toUrl($location`The Neverending Party`));
      if (["food", "booze"].includes(get("_questPartyFairQuest"))) runChoice(1);
      else runChoice(2);
    },
    limit: { tries: 1 },
  },
  {
    name: "Free fights",
    completed: () => get("_neverendingPartyFreeTurns", 0) >= 10,
    do: $location`The Neverending Party`,
    outfit: defaultOutfit([]),
    choices: { 1324: 5 },
    combat: combatStrat(new Macro()),
  },
  {
    name: "shattering punch",
    ready: () => have($skill`Shattering Punch`),
    completed: () => get("_shatteringPunchUsed", 0) >= 3,
    do: $location`The Neverending Party`,
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
    do: $location`The Neverending Party`,
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
    do: $location`The Neverending Party`,
    outfit: defaultOutfit([$item`carnivorous potted plant`, $item`Lil' Doctor™ bag`]),
    choices: { 1324: 5 },
    combat: combatStrat(new Macro().trySkill($skill`Chest X-Ray`)),
  },
  {
    name: "jokester's gun",
    ready: () => have($item`The Jokester's gun`),
    completed: () => get("_firedJokestersGun"),
    do: $location`The Neverending Party`,
    outfit: (): OutfitSpec => ({
      equip: [
        $item`carnivorous potted plant`,
        $item`The Jokester's gun`,
        $item`gnomish housemaid's kgnee`,
        get("_sweatOutSomeBoozeUsed") < 3 && get("sweat", 0) < 100
          ? $item`designer sweatpants`
          : $item`Pantsgiving`,
      ],
      modifier: `+familiar weight`,
      familiar: $familiar`Reagnimated Gnome`,
    }),
    choices: { 1324: 5 },
    combat: combatStrat(new Macro().trySkill($skill`Fire the Jokester's Gun`)),
  },
  {
    name: "replica bat-oomerang",
    ready: () => have($item`replica bat-oomerang`),
    completed: () => get("_usedReplicaBatoomerang", 0) >= 3,
    do: $location`The Neverending Party`,
    outfit: defaultOutfit([$item`carnivorous potted plant`]),
    choices: { 1324: 5 },
    combat: combatStrat(new Macro().tryItem($item`replica bat-oomerang`)),
  },
  {
    name: "powdered madness",
    ready: () => mallPrice($item`powdered madness`) < args.bagvalue,
    completed: () => get("_powderedMadnessUses", 0) >= 5,
    do: $location`The Neverending Party`,
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
    do: $location`The Neverending Party`,
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
  {
    name: "power pill",
    ready: () => gotPuck() && mallPrice($item`power pill`) < args.bagvalue,
    completed: () => get("_powderedMadnessUses", 0) >= 5,
    do: $location`The Neverending Party`,
    outfit: defaultOutfit([$item`carnivorous potted plant`]),
    choices: { 1324: 5 },
    combat: combatStrat(new Macro().tryItem($item`power pill`)),
    acquire: [
      {
        item: $item`power pill`,
        price: args.bagvalue,
      },
    ],
  },
  {
    name: "boots",
    ready: () => have($familiar`Pair of Stomping Boots`),
    completed: () => get("_banderRunaways", 0) >= getBanderRuns(),
    do: $location`The Neverending Party`,
    outfit: (): OutfitSpec => ({
      equip: [
        $item`carnivorous potted plant`,
        $item`June cleaver`,
        $item`tiny stillsuit`,
        get("_sweatOutSomeBoozeUsed") < 3 && get("sweat", 0) < 100
          ? $item`designer sweatpants`
          : $item`Pantsgiving`,
      ],
      modifier: `+familiar weight`,
      familiar: $familiar`Pair of Stomping Boots`,
    }),
    choices: { 1324: 5 },
    combat: new BaggoCombatStrategy().macro(new Macro().step("pickpocket").runaway()),
  },
];

function gotPuck(): boolean {
  return $familiars`Puck Man, Ms. Puck Man`.some((fam) => have(fam));
}

function getBanderRuns(): number {
  return Math.floor((familiarWeight($familiar`Pair of Stomping Boots`) + weightAdjustment()) / 5);
}
