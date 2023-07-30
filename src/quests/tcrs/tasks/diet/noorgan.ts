import { cliExecute, mallPrice, myClass, reverseNumberology, use, useSkill } from "kolmafia";
import { $class, $item, $skill, get, have } from "libram";
import { BaggoTask } from "../../../../engine/task";
import { args } from "../../../../args";

const chocos = new Map([
  [$class`Seal Clubber`, $item`chocolate seal-clubbing club`],
  [$class`Turtle Tamer`, $item`chocolate turtle totem`],
  [$class`Pastamancer`, $item`chocolate pasta spoon`],
  [$class`Sauceror`, $item`chocolate saucepan`],
  [$class`Accordion Thief`, $item`chocolate stolen accordion`],
  [$class`Disco Bandit`, $item`chocolate disco ball`],
]);
const classChoco: any = chocos.get(myClass());

export const NO_ORGAN_TASKS: BaggoTask[] = [
  {
    name: "Numberology",
    ready: () => Object.keys(reverseNumberology()).includes("69"),
    completed: () => get("_universeCalculated", 0) >= get("skillLevel144", 0),
    do: () => cliExecute("numberology 69"),
  },
  {
    name: "Ancestral recall",
    ready: () => have($skill`Ancestral Recall`) && mallPrice($item`blue mana`) < 3 * args.bagvalue,
    completed: () => get("_ancestralRecallCasts", 0) >= 10,
    do: () => useSkill($skill`Ancestral Recall`, 10 - get("_ancestralRecallCasts", 0)),
    acquire: () => [
      {
        item: $item`blue mana`,
        price: 3 * args.bagvalue,
        num: 10 - get("_ancestralRecallCasts", 0),
      },
    ],
  },
  {
    name: "Essential tofu",
    ready: () => mallPrice($item`essential tofu`) < 5 * args.bagvalue,
    completed: () => get("_essentialTofuUsed"),
    do: () => use($item`essential tofu`),
    acquire: () => [
      {
        item: $item`essential tofu`,
        price: 5 * args.bagvalue,
      },
    ],
  },
  {
    name: "Class chocolate",
    ready: () => mallPrice(classChoco) < (3 - get("_chocolatesUsed", 0)) * args.bagvalue,
    completed: () => get("_chocolatesUsed") >= 3,
    do: () => use(classChoco),
    acquire: () => [
      {
        item: classChoco,
        price: (3 - get("_chocolatesUsed", 0)) * args.bagvalue,
      },
    ],
  },
  {
    name: "LOV chocolate",
    ready: () =>
      have($item`LOV Extraterrestrial Chocolate`) &&
      20000 < (3 - get("_loveChocolatesUsed", 0)) * args.bagvalue,
    completed: () => get("_loveChocolatesUsed", 0) >= 3,
    do: () => use($item`LOV Extraterrestrial Chocolate`),
  },
  {
    name: "Chocolate sculpture",
    ready: () =>
      mallPrice($item`fancy chocolate sculpture`) <
      (5 - 2 * get("_chocolateSculpturesUsed", 0)) * args.bagvalue,
    completed: () => get("_chocolateSculpturesUsed", 0) >= 3,
    do: () => use(classChoco),
    acquire: () => [
      {
        item: classChoco,
        price: (5 - 2 * get("_chocolateSculpturesUsed", 0)) * args.bagvalue,
      },
    ],
  },
  {
    name: "Vitachoconutriment capsule",
    ready: () =>
      mallPrice($item`vitachoconutriment capsule`) <
      (5 - 2 * get("_chocolateSculpturesUsed", 0)) * args.bagvalue,
    completed: () => get("_vitachocCapsulesUsed", 0) >= 3,
    do: () => use(classChoco),
    acquire: () => [
      {
        item: classChoco,
        price: (5 - 2 * get("_vitachocCapsulesUsed", 0)) * args.bagvalue,
      },
    ],
  },
  {
    name: "Etched hourglass" /* believe it or not, tastes like chicken */,
    ready: () => have($item`etched hourglass`),
    completed: () => get("_etchedHourglassUsed"),
    do: () => use($item`etched hourglass`),
  },
];
