import { OutfitSpec } from "grimoire-kolmafia";
import { Item, runChoice, toUrl, visitUrl } from "kolmafia";
import { $familiar, $item, $location, $monsters, get, Macro } from "libram";
import { args } from "../../../../args";
import { BaggoTask } from "../../../../engine/task";
import { BaggoCombatStrategy } from "../../../../engine/combat";

const combatStrat = (partialMacro: Macro) => {
  return new BaggoCombatStrategy()
    .macro(() => Macro.step("pickpocket").step(partialMacro), $monsters`burnout, jock`)
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
];
