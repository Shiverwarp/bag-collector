import {
  abort,
  cliExecute,
  drink,
  eat,
  fullnessLimit,
  getWorkshed,
  inebrietyLimit,
  mallPrice,
  myFullness,
  myInebriety,
  mySpleenUse,
  spleenLimit,
  use,
  useSkill,
} from "kolmafia";
import { $item, $items, $skill, get, have } from "libram";
import { BaggoTask } from "../../../../engine/task";
import { args } from "../../../../args";

const adventureValue = 2 * mallPrice($item`tattered scrap of paper`);
// Underestimate a bit, cost of ghost pepper 30k
const profitPerOrganSpace = 15 * adventureValue - 30000;
const stomachWhetstoneValue = () => get("valueOfAdventure") - mallPrice($item`whet stone`);
const stomachMunchiesValue = () => 2 * get("valueOfAdventure") - mallPrice($item`munchies pill`);

const shotglassBoozes: any = $items``.filter(
  (item) => item.inebriety === 1 && item.adventures === "5" && item.tradeable
);

shotglassBoozes.sort((a: any, b: any) => mallPrice(a) - mallPrice(b));
const shotglassBooze = shotglassBoozes[0];

if (!shotglassBooze) {
  abort("Could not find appropriate shotglass booze");
}

export const ORGAN_TASKS: BaggoTask[] = [
  {
    name: "mojo filter",
    ready: () =>
      mySpleenUse() > 0 &&
      mallPrice($item`mojo filter`) + mallPrice($item`Breathitin™`) < 25000 + 2 * adventureValue,
    completed: () => get("currentMojoFilters", 0) >= 3,
    do: () => use($item`mojo filter`),
    acquire: [
      {
        item: $item`mojo filter`,
        price: 10000,
      },
    ],
  },
  {
    name: "Breathitin",
    completed: () => mySpleenUse() >= spleenLimit(),
    do: () => use(spleenLimit() - mySpleenUse(), $item`Breathitin™`),
    acquire: [
      {
        item: $item`Breathitin™`,
        price: 25000 + 2 * adventureValue /* one charge: mojo filter + 0.4 adventures */,
        num: spleenLimit() - mySpleenUse(),
      },
    ],
  },
  {
    name: "Shotglass",
    ready: () => have($item`mime army shotglass`),
    completed: () => get("_mimeArmyShotglassUsed"),
    do: () => drink(shotglassBooze),
    acquire: [
      {
        item: shotglassBooze,
        price: 5 * get("valueOfAdventure"),
      },
    ],
  },
  {
    name: "spice melange",
    ready: () =>
      myInebriety() >= 3 &&
      myFullness() >= 3 &&
      mallPrice($item`spice melange`) < 6 * profitPerOrganSpace,
    completed: () => get("spiceMelangeUsed"),
    do: () => use($item`spice melange`),
    acquire: [
      {
        item: $item`spice melange`,
        price: 6 * profitPerOrganSpace,
      },
    ],
  },
  {
    name: "UMSB",
    ready: () =>
      myInebriety() >= 3 &&
      myFullness() >= 3 &&
      mallPrice($item`Ultra Mega Sour Ball`) < 6 * profitPerOrganSpace,
    completed: () => get("_ultraMegaSourBallUsed"),
    do: () => use($item`Ultra Mega Sour Ball`),
    acquire: [
      {
        item: $item`Ultra Mega Sour Ball`,
        price: 6 * profitPerOrganSpace,
      },
    ],
  },
  {
    name: "lupine appetite hormones",
    ready: () => mallPrice($item`lupine appetite hormones`) < 3 * profitPerOrganSpace,
    completed: () => get("_lupineHormonesUsed"),
    do: () => use($item`lupine appetite hormones`),
    acquire: [
      {
        item: $item`lupine appetite hormones`,
        price: 3 * profitPerOrganSpace,
      },
    ],
  },
  {
    name: "Cuppa Voraci tea",
    ready: () => mallPrice($item`cuppa Voraci tea`) < profitPerOrganSpace,
    completed: () => get("_voraciTeaUsed"),
    do: () => use($item`cuppa Voraci tea`),
    acquire: [
      {
        item: $item`cuppa Voraci tea`,
        price: profitPerOrganSpace,
      },
    ],
  },
  {
    name: "Cuppa Sobrie tea",
    ready: () => myInebriety() >= 1 && mallPrice($item`cuppa Sobrie tea`) < profitPerOrganSpace,
    completed: () => get("_sobrieTeaUsed"),
    do: () => use($item`cuppa Sobrie tea`),
    acquire: [
      {
        item: $item`cuppa Sobrie tea`,
        price: profitPerOrganSpace,
      },
    ],
  },
  {
    name: "distention pill",
    ready: () => have($item`distention pill`),
    completed: () => get("_distentionPillUsed"),
    do: () => use($item`distention pill`),
  },
  {
    name: "synthetic doghair pill",
    ready: () => myInebriety() >= 1 && have($item`synthetic dog hair pill`),
    completed: () => get("_distentionPillUsed"),
    do: () => use($item`distention pill`),
  },
  {
    name: "sweat out some booze",
    ready: () => myInebriety() >= 1 && get("sweat") >= 25,
    completed: () => get("_sweatOutSomeBoozeUsed") >= 3,
    do: () => useSkill($skill`Sweat Out Some Booze`),
  },
  {
    name: "Rollercoaster day",
    ready: () => myFullness() >= 1,
    // eslint-disable-next-line libram/verify-constants
    completed: () => $skill`Aug. 16th: Roller Coaster Day!`.timescast > 0,
    do: () => cliExecute("/cast Roller Coaster Day"),
  },
  {
    name: "milk of magnesium",
    ready: () => mallPrice($item`milk of magnesium`) < 5 * get("valueOfAdventure"),
    completed: () => get("_milkOfMagnesiumUsed"),
    do: () => use($item`milk of magnesium`),
    acquire: () => [
      {
        item: $item`milk of magnesium`,
        price: 4000 /* shrug */,
      },
    ],
  },
  {
    name: "Stomach Munchies",
    ready: () =>
      myInebriety() === inebrietyLimit() &&
      myFullness() < fullnessLimit() &&
      stomachMunchiesValue() >= stomachWhetstoneValue() &&
      mallPrice($item`munchies pill`) < get("valueOfAdventure") * 2,
    completed: () => get("munchiesPillsUsed") >= 1,
    do: () => use($item`munchies pill`),
    acquire: () => [
      {
        item: $item`munchies pill`,
        price: get("valueOfAdventure") * 2,
      },
    ],
  },
  {
    name: "Liver Munchies",
    ready: () =>
      myInebriety() < inebrietyLimit() &&
      mallPrice($item`munchies pill`) < get("valueOfAdventure") * 2,
    completed: () => get("munchiesPillsUsed") >= 1,
    do: () => use($item`munchies pill`),
    acquire: () => [
      {
        item: $item`munchies pill`,
        price: get("valueOfAdventure") * 2,
      },
    ],
  },
  {
    name: "Stomach Whetstone",
    ready: () =>
      myInebriety() === inebrietyLimit() &&
      myFullness() < fullnessLimit() &&
      stomachWhetstoneValue() > stomachMunchiesValue() &&
      mallPrice($item`whet stone`) < get("valueOfAdventure"),
    completed: () => get("whetstonesUsed") >= 1,
    do: () => use($item`whet stone`),
    acquire: () => [
      {
        item: $item`whet stone`,
        price: get("valueOfAdventure"),
      },
    ],
  },
  {
    name: "Liver Whetstone",
    ready: () =>
      myInebriety() < inebrietyLimit() && mallPrice($item`whet stone`) < get("valueOfAdventure"),
    completed: () => get("whetstonesUsed") >= 1,
    do: () => use($item`whet stone`),
    acquire: () => [
      {
        item: $item`whet stone`,
        price: get("valueOfAdventure"),
      },
    ],
  },
  {
    name: "drink ghost pepper",
    ready: () => get("ghostPepperTurnsLeft") === 0 && getWorkshed() === $item`portable Mayo Clinic`,
    completed: () => myInebriety() >= inebrietyLimit(),
    do: () => use($item`Mayodiol`) && eat($item`ghost pepper`),
    acquire: () => [
      {
        item: $item`Special Seasoning`,
        useful: () => mallPrice($item`Special Seasoning`) < get("valueOfAdventure"),
      },
      {
        item: $item`Mayodiol`,
      },
    ],
  },
  {
    name: "eat ghost pepper",
    ready: () => get("ghostPepperTurnsLeft") === 0 && getWorkshed() === $item`portable Mayo Clinic`,
    completed: () => myFullness() >= fullnessLimit(),
    do: () => use($item`Mayoflex`) && eat($item`ghost pepper`),
    acquire: () => [
      {
        item: $item`Special Seasoning`,
        useful: () => mallPrice($item`Special Seasoning`) < get("valueOfAdventure"),
      },
      {
        item: $item`Mayoflex`,
      },
    ],
  },
];
