/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ActionDefaults, CombatStrategy } from "grimoire-kolmafia";
import { isBanished } from "kolmafia";
import { $item, $monster, $skill, Macro } from "libram";

const myActions = ["kill", "banish"] as const;
export type CombatActions = typeof myActions[number];
export class BaggoCombatStrategy extends CombatStrategy.withActions(myActions) {}
export class MyActionDefaults implements ActionDefaults<CombatActions> {
  kill() {
    return this.delevel()
      .trySkill($skill`Sing Along`)
      .externalIf(
        isBanished($monster`banshee librarian`) && isBanished($monster`writing desk`),
        Macro.trySkill($skill`Bowl Straight Up`)
      )
      .attack()
      .repeat();
  }

  banish() {
    return Macro.runaway(); // If no resource provided
  }

  private delevel() {
    return Macro.trySkill($skill`Micrometeorite`)
      .tryItem($item`Rain-Doh indigo cup`)
      .tryItem($item`porquoise-handled sixgun`)
      .trySkill($skill`Summon Love Mosquito`)
      .tryItem($item`Time-Spinner`)
      .tryItem($item`HOA citation pad`);
  }
}
