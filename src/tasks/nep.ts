import { $familiar, $location, $monsters, $skill, Macro } from "libram";
import { args } from "../args";
import { turnsRemaining } from "../lib";
import { baggoOutfit } from "../outfit";
import { BaggoTask } from "../engine/task";
import { BaggoCombatStrategy } from "../engine/combat";
import { EFFECTS } from "../effects";
import { Location, myFamiliar, numericModifier } from "kolmafia";

export const NEP_TASKS: BaggoTask[] = [
  {
    name: "Collect tatters",
    completed: () => turnsRemaining() <= 0 || args.buff,
    do: (): Location => {
      if (myFamiliar() === $familiar`Grey Goose` && numericModifier(`familiar experience`) < 10) {
        throw "We have less than 10 familiar experience per adventure!";
      }
      return $location`The Haunted Library`;
    },
    outfit: baggoOutfit,
    effects: EFFECTS,
    combat: new BaggoCombatStrategy()
      .banish($monsters`banshee librarian, writing desk`)
      .macro(new Macro().trySkill($skill`Emit Matter Duplicating Drones`))
      .macro(new Macro().trySkill($skill`Spit jurassic acid`))
      .kill(),
  },
];
