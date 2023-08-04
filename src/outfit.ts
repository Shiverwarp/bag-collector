import { isSober, realmAvailable, turnsRemaining } from "./lib";
import { Outfit } from "grimoire-kolmafia";
import {
  abort,
  fullnessLimit,
  Item,
  itemAmount,
  mallPrice,
  myAdventures,
  myFullness,
  totalTurnsPlayed,
} from "kolmafia";
import {
  $effect,
  $familiar,
  $item,
  $items,
  CrownOfThrones,
  get,
  getSaleValue,
  have,
  sum,
  sumNumbers,
} from "libram";
import { garboValue } from "./session";
import { juneCleaverBonusEquip } from "./resources/cleaver";

// https://www.desmos.com/calculator/y8iszw6rfk
// Very basic linear approximation of the value of additional weight
const MAGIC_NUMBER = 0.00123839009288;

function dropsValueFunction(drops: Item[] | Map<Item, number>): number {
  return Array.isArray(drops)
    ? getSaleValue(...drops)
    : sum([...drops.entries()], ([item, quantity]) => quantity * getSaleValue(item)) /
        sumNumbers([...drops.values()]);
}

function ensureBjorn(weightValue: number, meatValue = 0): CrownOfThrones.FamiliarRider {
  const key = `weight:${weightValue.toFixed(3)};meat:${meatValue}`;
  if (!CrownOfThrones.hasRiderMode(key)) {
    CrownOfThrones.createRiderMode(key, {
      dropsValueFunction,
      modifierValueFunction: CrownOfThrones.createModifierValueFunction(
        ["Familiar Weight", "Meat Drop"],
        {
          "Familiar Weight": (x) => weightValue * x,
          "Meat Drop": (x) => meatValue * x,
        }
      ),
    });
  }

  const result = CrownOfThrones.pickRider(key);
  if (!result) abort("Failed to make sensible bjorn decision!");

  return result;
}

function snowSuit() {
  if (!have($item`Snow Suit`) || get("_carrotNoseDrops") >= 3) return new Map<Item, number>([]);

  return new Map<Item, number>([[$item`Snow Suit`, getSaleValue($item`carrot nose`) / 10]]);
}

function mayflowerBouquet() {
  // +40% meat drop 12.5% of the time (effectively 5%)
  // Drops flowers 50% of the time, wiki says 5-10 a day.
  // Theorized that flower drop rate drops off but no info on wiki.
  // During testing I got 4 drops then the 5th took like 40 more adventures
  // so let's just assume rate drops by 11% with a min of 1% ¯\_(ツ)_/¯

  if (!have($item`Mayflower bouquet`) || get("_mayflowerDrops") >= 10)
    return new Map<Item, number>([]);

  const averageFlowerValue =
    getSaleValue(
      ...$items`tin magnolia, upsy daisy, lesser grodulated violet, half-orchid, begpwnia`
    ) * Math.max(0.01, 0.5 - get("_mayflowerDrops") * 0.11);
  return new Map<Item, number>([[$item`Mayflower bouquet`, averageFlowerValue]]);
}

function luckyGoldRing() {
  // Ignore for DMT, assuming mafia might get confused about the volcoino drop by the weird combats
  if (!have($item`lucky gold ring`)) {
    return new Map<Item, number>([]);
  }

  // Volcoino has a low drop rate which isn't accounted for here
  // Overestimating until it drops is probably fine, don't @ me
  const dropValues = [
    100, // 80 - 120 meat
    ...[
      itemAmount($item`hobo nickel`) > 0 ? 100 : 0, // This should be closeted
      itemAmount($item`sand dollar`) > 0 ? garboValue($item`sand dollar`) : 0, // This should be closeted
      itemAmount($item`Freddy Kruegerand`) > 0 ? garboValue($item`Freddy Kruegerand`) : 0,
      realmAvailable("sleaze") ? garboValue($item`Beach Buck`) : 0,
      realmAvailable("spooky") ? garboValue($item`Coinspiracy`) : 0,
      realmAvailable("stench") ? garboValue($item`FunFunds™`) : 0,
      realmAvailable("hot") && !get("_luckyGoldRingVolcoino") ? garboValue($item`Volcoino`) : 0,
      realmAvailable("cold") ? garboValue($item`Wal-Mart gift certificate`) : 0,
      realmAvailable("fantasy") ? garboValue($item`Rubee™`) : 0,
    ].filter((value) => value > 0),
  ];

  // Items drop every ~10 turns
  return new Map<Item, number>([
    [$item`lucky gold ring`, sumNumbers(dropValues) / dropValues.length / 10],
  ]);
}

function pantogram() {
  if (!have($item`pantogram pants`) || !get("_pantogramModifier").includes("Drops Items"))
    return new Map();
  return new Map([[$item`pantogram pants`, 100]]);
}

function sweatpants() {
  if (!have($item`designer sweatpants`)) return new Map();

  const needSweat = get("sweat") < 25 * (3 - get("_sweatOutSomeBoozeUsed"));

  if (!needSweat) return new Map();

  const VOA = get("valueOfAdventure");

  //Underestimating adventure gain, cost is approximate from discord discussion
  const ghostPepperValue = 15 * VOA - 30000;

  const bonus = ghostPepperValue / 25;
  return new Map([[$item`designer sweatpants`, bonus]]);
}

function pantsgiving(): Map<Item, number> {
  if (!have($item`Pantsgiving`)) return new Map<Item, number>();
  const count = get("_pantsgivingCount");
  const turnArray = [5, 50, 500, 5000];
  const index =
    myFullness() === fullnessLimit()
      ? get("_pantsgivingFullness")
      : turnArray.findIndex((x) => count < x);
  const turns = turnArray[index] ?? 50000;

  if (turns - count > myAdventures()) return new Map<Item, number>();
  //Underestimating adventure gain, cost is approximate from discord discussion
  const fullnessValue = 15 * get("valueOfAdventure") - 30000;
  const pantsgivingBonus = fullnessValue / (turns * 0.9);
  return new Map<Item, number>([[$item`Pantsgiving`, pantsgivingBonus]]);
}

function carnPlant(): Map<Item, number> {
  if (!have($item`carnivorous potted plant`)) return new Map<Item, number>();
  // We only want to use carn plant if we've built up a surplus of drones
  // Proc rate is 4%
  if (get(`gooseDronesRemaining`) < turnsRemaining()) return new Map<Item, number>();
  return new Map<Item, number>([
    [$item`carnivorous potted plant`, mallPrice($item`tattered scrap of paper`) * 2 * 0.04],
  ]);
}

// Not doing the complicated thumb ring math for now, just say it's 5%
function reallyEasyBonuses() {
  return new Map<Item, number>(
    (
      [
        [$item`Mr. Cheeng's spectacles`, 250],
        [$item`Mr. Screege's spectacles`, 180],
        [$item`mafia thumb ring`, get(`valueOfAdventure`) * 0.05],
        [$item`tiny stillsuit`, 40],
      ] as [Item, number][]
    ).filter(([item]) => have(item))
  );
}

function easyBonuses() {
  return new Map<Item, number>([
    ...reallyEasyBonuses(),
    ...luckyGoldRing(),
    ...carnPlant(),
    ...juneCleaverBonusEquip(),
    ...snowSuit(),
    ...mayflowerBouquet(),
    ...sweatpants(),
    ...pantogram(),
  ]);
}

function fullBonuses() {
  return new Map([...easyBonuses(), ...pantsgiving()]);
}

export function baggoOutfit(includeFamiliar = true): Outfit {
  const outfit = new Outfit();

  if (includeFamiliar) {
    if (get(`gooseDronesRemaining`) < turnsRemaining()) {
      outfit.equip($familiar`Grey Goose`);
    } else {
      outfit.equip($familiar`Reagnimated Gnome`);
    }
  }

  let weightValue = 0;
  if (outfit.familiar === $familiar`Reagnimated Gnome`) {
    outfit.equip($item`gnomish housemaid's kgnee`);
    weightValue = Math.round(MAGIC_NUMBER * get(`valueOfAdventure`) * 100) / 100;
  }

  if (!have($effect`Everything Looks Yellow`) && isSober()) {
    outfit.equip($item`Jurassic Parka`);
    outfit.setModes({
      parka: !have($effect`Everything Looks Yellow`) ? "dilophosaur" : "kachungasaur",
    });
  }

  if (
    get("questPAGhost") === "unstarted" &&
    get("nextParanormalActivity") <= totalTurnsPlayed() &&
    isSober()
  ) {
    outfit.equip($item`protonic accelerator pack`);
  }

  if (weightValue) {
    const rounded = Math.round(1000 * weightValue) / 1000;
    outfit.modifier.push(`${rounded} Familiar Weight`);
  }

  outfit.bonuses = fullBonuses();

  const bjornChoice = ensureBjorn(weightValue);
  const bjornValue =
    bjornChoice && (bjornChoice.dropPredicate?.() ?? true)
      ? bjornChoice.probability *
        (typeof bjornChoice.drops === "number"
          ? bjornChoice.drops
          : dropsValueFunction(bjornChoice.drops))
      : 0;
  if (have($item`Buddy Bjorn`)) {
    outfit.setBonus($item`Buddy Bjorn`, bjornValue);
    outfit.bjornify(bjornChoice.familiar);
  } else if (have($item`Crown of Thrones`)) {
    outfit.setBonus($item`Crown of Thrones`, bjornValue);
    outfit.enthrone(bjornChoice.familiar);
  }

  const itemDropTatterEfficiency = (0.12 / 100) * mallPrice($item`tattered scrap of paper`);
  outfit.modifier.push(`${itemDropTatterEfficiency.toFixed(2)} Item Drop 834 max`);

  if (outfit.familiar === $familiar`Grey Goose`) {
    outfit.modifier.push(`300 Familiar Experience 10 min 23 max`);
  }
  outfit.modifier.push("-tie");
  return outfit;
}
