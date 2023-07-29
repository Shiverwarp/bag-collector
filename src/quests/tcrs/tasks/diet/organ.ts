import {
  abort,
  drink,
  eat,
  fullnessLimit,
  inebrietyLimit,
  mallPrice,
  myFullness,
  myInebriety,
  mySpleenUse,
  spleenLimit,
  use,
} from "kolmafia";
import { $item, $items, get, have, MayoClinic } from "libram";
import { BaggoTask } from "../../../../engine/task";
import { args } from "../../../../args";

const dietDecorators = [
  {
    item: $item`munchies pill`,
    done: () => get("munchiesPillsUsed", 0) > 0,
  },
  {
    item: $item`whet stone`,
    done: () => get("whetstonesUsed", 0) > 0,
  },
];

const decoratorTasks = dietDecorators.map((decorator) => {
  const { item, done } = decorator;
  return {
    name: item.name,
    ready: () => mallPrice(item) < args.bagvalue,
    completed: done,
    do: () => use(item),
    acquire: [
      {
        item: item,
        price: args.bagvalue,
      },
    ],
  };
});

const shotglassBooze: any = $items``
  .filter((item) => {
    item.inebriety === 1 && item.adventures === "5";
  })
  .sort((a, b) => mallPrice(a) - mallPrice(b));

if (!shotglassBooze) {
  abort("Could not find appropriate shotglass booze");
}

export const ORGAN_TASKS: BaggoTask[] = [
  {
    name: "mojo filter",
    ready: () =>
      mallPrice($item`mojo filter`) + mallPrice($item`Breathitin™`) < 25000 + 2 * args.bagvalue,
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
    do: () => use($item`Breathitin™`),
    acquire: [
      {
        item: $item`Breathitin™`,
        price: 25000 + 2 * args.bagvalue /* one charge: mojo filter + 0.4 adventures */,
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
        price: 5 * args.bagvalue,
      },
    ],
  },
  {
    name: "spice melange",
    ready: () =>
      myInebriety() >= 3 &&
      myFullness() >= 3 &&
      mallPrice($item`spice melange`) < 100 * args.bagvalue,
    completed: () => get("spiceMelangeUsed"),
    do: () => use($item`spice melange`),
    acquire: [
      {
        item: $item`spice melange`,
        price: 100 * args.bagvalue,
      },
    ],
  },
  {
    name: "UMSB",
    ready: () =>
      myInebriety() >= 3 &&
      myFullness() >= 3 &&
      mallPrice($item`Ultra Mega Sour Ball`) < 100 * args.bagvalue,
    completed: () => get("_ultraMegaSourBallUsed"),
    do: () => use($item`Ultra Mega Sour Ball`),
    acquire: [
      {
        item: $item`Ultra Mega Sour Ball`,
        price: 100 * args.bagvalue,
      },
    ],
  },
  {
    name: "lupine appetite hormones",
    ready: () => mallPrice($item`lupine appetite hormones`) < 50 * args.bagvalue,
    completed: () => get("_lupineHormonesUsed"),
    do: () => use($item`lupine appetite hormones`),
    acquire: [
      {
        item: $item`lupine appetite hormones`,
        price: 100 * args.bagvalue,
      },
    ],
  },
  {
    name: "Cuppa Voraci tea",
    ready: () => mallPrice($item`cuppa Voraci tea`) < 17 * args.bagvalue,
    completed: () => get("_voraciTeaUsed"),
    do: () => use($item`cuppa Voraci tea`),
    acquire: [
      {
        item: $item`cuppa Voraci tea`,
        price: 17 * args.bagvalue,
      },
    ],
  },
  {
    name: "Cuppa Sobrie tea",
    ready: () => myInebriety() >= 1 && mallPrice($item`cuppa Sobrie tea`) < 16 * args.bagvalue,
    completed: () => get("_sobrieTeaUsed"),
    do: () => use($item`cuppa Sobrie tea`),
    acquire: [
      {
        item: $item`cuppa Sobrie tea`,
        price: 17 * args.bagvalue,
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
    name: "Install mayo clinic",
    completed: MayoClinic.installed,
    do: () => use($item`portable Mayo Clinic`),
  },
  ...decoratorTasks,
  {
    name: "drink ghost pepper",
    ready: () => get("ghostPepperTurnsLeft") === 0,
    completed: () => myInebriety() >= inebrietyLimit(),
    do: () => use($item`Mayodiol`) && eat($item`ghost pepper`),
    acquire: () => [
      {
        item: $item`Special Seasoning`,
        useful: () => mallPrice($item`Special Seasoning`) < args.bagvalue / 2,
      },
      {
        item: $item`Mayodiol`,
      },
    ],
  },
  {
    name: "eat ghost pepper",
    ready: () => get("ghostPepperTurnsLeft") === 0,
    completed: () => myFullness() >= fullnessLimit(),
    do: () => use($item`Mayoflex`) && eat($item`ghost pepper`),
    acquire: () => [
      {
        item: $item`Special Seasoning`,
        useful: () => mallPrice($item`Special Seasoning`) < args.bagvalue / 2,
      },
      {
        item: $item`Mayoflex`,
      },
    ],
  },
];
