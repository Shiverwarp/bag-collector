import {
  $effect,
  $familiar,
  $item,
  $location,
  get,
  JuneCleaver,
  Macro,
  uneffect,
  withProperty,
} from "libram";
import { adv1, inebrietyLimit, myInebriety } from "kolmafia";
import { OutfitSpec } from "grimoire-kolmafia";
import { juneCleaverChoices } from "../../../../resources/cleaver";
import { BaggoTask } from "../../../../engine/task";
import { BaggoCombatStrategy } from "../../../../engine/combat";

export const defaultOutfit = (): OutfitSpec => ({
  equip: [
    $item`June cleaver`,
    $item`gnomish housemaid's kgnee`,
    get("_sweatOutSomeBoozeUsed") < 3 && get("sweat", 0) < 100
      ? $item`designer sweatpants`
      : $item`Pantsgiving`,
  ],
  modifier: `+familiar weight`,
  familiar: $familiar`Reagnimated Gnome`,
});

export const cleaverTask: BaggoTask = {
  name: "June Cleaver",
  completed: () => !JuneCleaver.have() || !!get("_juneCleaverFightsLeft"),
  do: () =>
    withProperty("recoveryScript", "", () => {
      const target =
        myInebriety() > inebrietyLimit() ? $location`Drunken Stupor` : $location`Noob Cave`;
      adv1(target, -1, "");
    }),
  post: (): void => {
    if (["Poetic Justice", "Lost and Found"].includes(get("lastEncounter")))
      uneffect($effect`Beaten Up`);
  },
  choices: juneCleaverChoices,
  outfit: { weapon: $item`June cleaver` },
  combat: new BaggoCombatStrategy().macro(Macro.abort()),
};
