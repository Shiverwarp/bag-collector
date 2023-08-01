import { $location, $monsters, $skill, Macro } from "libram";
import { args } from "../args";
import { turnsRemaining } from "../lib";
import { baggoOutfit } from "../outfit";
import { BaggoTask } from "../engine/task";
import { BaggoCombatStrategy } from "../engine/combat";
import { EFFECTS } from "../effects";

export const NEP_TASKS: BaggoTask[] = [
  {
    name: "Collect filters",
    completed: () => turnsRemaining() <= 0 || args.buff,
    do: $location`The Oasis`,
    outfit: baggoOutfit,
    effects: EFFECTS,
    combat: new BaggoCombatStrategy()
      .banish($monsters`blur, oasis monster, rolling stone`)
      .macro(new Macro().trySkill($skill`Emit Matter Duplicating Drones`))
      .macro(new Macro().trySkill($skill`Spit jurassic acid`))
      .kill(),
  },
];
