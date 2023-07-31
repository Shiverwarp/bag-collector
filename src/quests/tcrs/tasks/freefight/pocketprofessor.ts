import { $familiar, $item, $monster, $skill, get, have, Macro, Witchess } from "libram";
import { BaggoTask } from "../../../../engine/task";
import { BaggoCombatStrategy } from "../../../../engine/combat";
import {
  familiarWeight,
  inMultiFight,
  myMaxhp,
  restoreHp,
  runCombat,
  weightAdjustment,
} from "kolmafia";

export const freefightTasks: BaggoTask[] = [
  {
    name: "pocket professor",
    ready: () => have($familiar`Pocket Professor`) && Witchess.have(),
    completed: () => true || get("_pocketProfessorLectures") >= pocketProfessorLectures(),
    outfit: () => ({
      equip: [
        $item`June cleaver`,
        $item`Pocket Professor memory chip`,
        get("_sweatOutSomeBoozeUsed") < 3 && get("sweat", 0) < 100
          ? $item`designer sweatpants`
          : $item`Pantsgiving`,
      ],
      modifier: `+familiar weight`,
      familiar: $familiar`Pocket Professor`,
    }),
    do: (): void => {
      Witchess.fightPiece($monster`Witchess Knight`);
      while (inMultiFight()) {
        runCombat();
      }
    },
    combat: new BaggoCombatStrategy()
      .macro(Macro.trySkill($skill`lecture on relativity`).trySkill($skill`deliver your thesis!`))
      .kill(),
    prepare: (): void => {
      restoreHp(myMaxhp());
    },
  },
];

function pocketProfessorLectures(): number {
  return 2 + Math.ceil(Math.sqrt(familiarWeight($familiar`Pocket Professor`) + weightAdjustment()));
}
