import { $familiar, $item, $location, $monster, $skill, get, have, Macro } from "libram";
import { BaggoTask } from "../../../../engine/task";
import { BaggoCombatStrategy } from "../../../../engine/combat";

export const freefightTasks: BaggoTask[] = [
  {
    name: "backup",
    ready: () =>
      have($item`backup camera`) && get("lastCopyableMonster") === $monster`Witchess Knight`,
    completed: () => get("_backUpUses") >= 11,
    outfit: () => ({
      equip: [
        $item`June cleaver`,
        $item`gnomish housemaid's kgnee`,
        $item`backup camera`,
        get("_sweatOutSomeBoozeUsed") < 3 && get("sweat", 0) < 100
          ? $item`designer sweatpants`
          : $item`Pantsgiving`,
      ],
      modifier: `+familiar weight`,
      familiar: $familiar`Reagnimated Gnome`,
    }),
    do: () => $location`The Dire Warren`,
    combat: new BaggoCombatStrategy()
      .macro(Macro.tryItem($item`Spooky Putty sheet`).trySkill($skill`Back-Up to your Last Enemy`))
      .kill(),
  },
];
