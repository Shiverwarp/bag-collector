import { $item, get } from "libram";
import { BaggoTask } from "../../../../engine/task";
import { BaggoCombatStrategy } from "../../../../engine/combat";
import { mallPrice, myHp, myMaxhp, use } from "kolmafia";
import { defaultOutfit } from "./shared";

export const freefightTasks: BaggoTask[] = [
  {
    name: "BRICKO ooze",
    ready: () => mallPrice($item`BRICKO ooze`) < 6000,
    completed: () => get("_brickoFights") >= 10,
    outfit: defaultOutfit,
    do: () => use($item`BRICKO ooze`),
    combat: new BaggoCombatStrategy().kill(),
    prepare: (): void => {
      if (myHp() < myMaxhp() / 2) {
        use($item`scroll of drastic healing`);
      }
    },
    acquire: [
      {
        item: $item`BRICKO ooze`,
        price: 6000,
      },
      {
        item: $item`scroll of drastic healing`,
        price: 1000,
      },
    ],
  },
  {
    name: "lynyrd",
    ready: () => mallPrice($item`lynyrd snare`) < 6000,
    completed: () => get("_lynyrdSnareUses") >= 3,
    outfit: defaultOutfit,
    do: () => use($item`lynyrd snare`),
    combat: new BaggoCombatStrategy().kill(),
    prepare: (): void => {
      if (myHp() < myMaxhp() / 2) {
        use($item`scroll of drastic healing`);
      }
    },
    acquire: [
      {
        item: $item`lynyrd snare`,
        price: 5000,
      },
      {
        item: $item`scroll of drastic healing`,
        price: 1000,
      },
    ],
  },
];
