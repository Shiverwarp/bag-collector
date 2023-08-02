import { $location, $monsters, $skill, Macro } from "libram";
import { args } from "../args";
import { turnsRemaining } from "../lib";
import { baggoOutfit } from "../outfit";
import { BaggoTask } from "../engine/task";
import { BaggoCombatStrategy } from "../engine/combat";
import { EFFECTS } from "../effects";

export const NEP_TASKS: BaggoTask[] = [
  {
    name: "Collect tatters",
    completed: () => turnsRemaining() <= 0 || args.buff,
    do: $location`The Haunted Library`,
    outfit: baggoOutfit,
    effects: EFFECTS,
    combat: new BaggoCombatStrategy()
      .banish($monsters`banshee librarian, writing desk`)
      .macro(new Macro().trySkill($skill`Emit Matter Duplicating Drones`))
      .macro(new Macro().trySkill($skill`Spit jurassic acid`))
      .kill(),
  },
];
