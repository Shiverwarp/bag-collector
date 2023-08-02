import {
  autosellPrice,
  Coinmaster,
  historicalAge,
  historicalPrice,
  Item,
  myAdventures,
  myTurncount,
  print,
  sellPrice,
  todayToString,
  toInt,
} from "kolmafia";
import { $item, $items, get, getSaleValue, Session, set, sum } from "libram";
import { args } from "./args";
import { adventures, formatNumber, turncount } from "./lib";

const dailyProperties = ["bags", "keys", "adventures", "turns", "meat", "runs"] as const;
export type DailyProperty = typeof dailyProperties[number];
export type DailyResult = { current: number; total: number };

export function trackDaily(property: DailyProperty, current = 0): DailyResult {
  if (get("baggo_day", "") !== todayToString()) {
    for (const dailyProperty of dailyProperties) {
      set(`baggo_${dailyProperty}`, 0);
    }
    set("baggo_day", todayToString());
  }
  const dailyProperty = `baggo_${property}`;
  const total = get(dailyProperty, 0) + current;
  print(`set(${dailyProperty}, ${total})`);
  set(dailyProperty, total);
  return { current, total };
}

let sessionStart = Session.current();
let initialRuns = get("_navelRunaways");

function printResults(results: Record<DailyProperty, DailyResult>, attr: keyof DailyResult): void {
  const { bags, keys, meat, adventures, turns, runs } = results;
  const mpa = Math.round(((bags[attr] + keys[attr]) * args.bagvalue + meat[attr]) / turns[attr]);
  print(`Across ${formatNumber(turns[attr])} you generated`);
  print(`* ${formatNumber(bags[attr])} duffel bags`, "blue");
  print(`* ${formatNumber(keys[attr])} van keys`, "blue");
  print(`* ${formatNumber(adventures[attr])} advs`, "blue");
  print(`* ${formatNumber(runs[attr])} GAP/Navel runs`, "blue");
  print(`* ${formatNumber(meat[attr])} meat`, "blue");
  print(`That's ${formatNumber(mpa)} MPA!`, "blue");
}

export function startTracking(): void {
  sessionStart = Session.current();
  initialRuns = get("_navelRunaways");
}

export function endTracking(): void {
  const sessionResults = Session.current().diff(sessionStart);
  const runs = get("_navelRunaways") - initialRuns;

  const turns = myTurncount() - turncount;
  const dailyResults = {
    bags: trackDaily("bags", sessionResults.items.get($item`unremarkable duffel bag`) ?? 0),
    keys: trackDaily("keys", sessionResults.items.get($item`van key`) ?? 0),
    turns: trackDaily("turns", turns),
    adventures: trackDaily("adventures", turns - (adventures - myAdventures())),
    meat: trackDaily("meat", sessionResults.meat),
    runs: trackDaily("runs", runs),
  };

  print("This run of baggo:", "blue");
  printResults(dailyResults, "current");
  print("So far today:", "blue");
  printResults(dailyResults, "total");
}

function currency(...items: Item[]): () => number {
  const unitCost: [Item, number][] = items.map((i) => {
    const coinmaster = Coinmaster.all().find((c) => sellPrice(c, i) > 0);
    if (!coinmaster) {
      throw `Invalid coinmaster item ${i}`;
    } else {
      return [i, sellPrice(coinmaster, i)];
    }
  });
  return () => Math.max(...unitCost.map(([item, cost]) => garboValue(item) / cost));
}

function complexCandy(): [Item, () => number][] {
  const candies = Item.all().filter((i) => i.candyType === "complex");
  const candyLookup: Item[][] = [[], [], [], [], []];

  for (const candy of candies) {
    const id = toInt(candy) % 5;
    if (candy.tradeable) {
      candyLookup[id].push(candy);
    }
  }
  const candyIdPrices: [Item, () => number][] = candies
    .filter((i) => !i.tradeable)
    .map((i) => [i, () => Math.min(...candyLookup[toInt(i) % 5].map((i) => garboValue(i)))]);
  return candyIdPrices;
}

const specialValueLookup = new Map<Item, () => number>([
  [
    $item`Freddy Kruegerand`,
    currency(...$items`bottle of Bloodweiser, electric Kool-Aid, Dreadsylvanian skeleton key`),
  ],
  [$item`Beach Buck`, currency($item`one-day ticket to Spring Break Beach`)],
  [$item`Coinspiracy`, currency(...$items`Merc Core deployment orders, karma shawarma`)],
  [$item`FunFunds™`, currency($item`one-day ticket to Dinseylandfill`)],
  [$item`Volcoino`, currency($item`one-day ticket to That 70s Volcano`)],
  [$item`Wal-Mart gift certificate`, currency($item`one-day ticket to The Glaciest`)],
  [$item`Rubee™`, currency($item`FantasyRealm guest pass`)],
  [$item`Guzzlrbuck`, currency($item`Never Don't Stop Not Striving`)],
  ...complexCandy(),
  [
    $item`Merc Core deployment orders`,
    () => garboValue($item`one-day ticket to Conspiracy Island`),
  ],
  [
    $item`free-range mushroom`,
    () =>
      3 *
      Math.max(
        garboValue($item`mushroom tea`) - garboValue($item`soda water`),
        garboValue($item`mushroom whiskey`) - garboValue($item`fermenting powder`),
        garboValue($item`mushroom filet`)
      ),
  ],
  [
    $item`little firkin`,
    () =>
      garboAverageValue(
        ...$items`martini, screwdriver, strawberry daiquiri, margarita, vodka martini, tequila sunrise, bottle of Amontillado, barrel-aged martini, barrel gun`
      ),
  ],
  [
    $item`normal barrel`,
    () =>
      garboAverageValue(
        ...$items`a little sump'm sump'm, pink pony, rockin' wagon, roll in the hay, slip 'n' slide, slap and tickle`
      ),
  ],
  [
    $item`big tun`,
    () =>
      garboAverageValue(
        ...$items`gibson, gin and tonic, mimosette, tequila sunset, vodka and tonic, zmobie`
      ),
  ],
  [
    $item`weathered barrel`,
    () => garboAverageValue(...$items`bean burrito, enchanted bean burrito, jumping bean burrito`),
  ],
  [
    $item`dusty barrel`,
    () =>
      garboAverageValue(
        ...$items`spicy bean burrito, spicy enchanted bean burrito, spicy jumping bean burrito`
      ),
  ],
  [
    $item`disintegrating barrel`,
    () =>
      garboAverageValue(
        ...$items`insanely spicy bean burrito, insanely spicy enchanted bean burrito, insanely spicy jumping bean burrito`
      ),
  ],
  [
    $item`moist barrel`,
    () =>
      garboAverageValue(
        ...$items`cast, concentrated magicalness pill, enchanted barbell, giant moxie weed, Mountain Stream soda`
      ),
  ],
  [
    $item`rotting barrel`,
    () =>
      garboAverageValue(
        ...$items`Doc Galaktik's Ailment Ointment, extra-strength strongness elixir, jug-o-magicalness, Marquis de Poivre soda, suntan lotion of moxiousness`
      ),
  ],
  [
    $item`mouldering barrel`,
    () =>
      garboAverageValue(
        ...$items`creepy ginger ale, haunted battery, scroll of drastic healing, synthetic marrow, the funk`
      ),
  ],
  [
    $item`barnacled barrel`,
    () =>
      garboAverageValue(
        ...$items`Alewife™ Ale, bazookafish bubble gum, beefy fish meat, eel battery, glistening fish meat, ink bladder, pufferfish spine, shark cartilage, slick fish meat, slug of rum, slug of shochu, slug of vodka, temporary teardrop tattoo`
      ),
  ],
  [$item`fake hand`, () => 50000],
  [
    $item`psychoanalytic jar`,
    () =>
      // Exclude jick because he's rate-limited
      Math.max(
        ...$items`jar of psychoses (The Meatsmith), jar of psychoses (The Captain of the Gourd), jar of psychoses (The Crackpot Mystic), jar of psychoses (The Pretentious Artist), jar of psychoses (The Old Man), jar of psychoses (The Suspicious-Looking Guy)`.map(
          (jar) => garboValue(jar)
        )
      ),
  ],
]);

const exclusions = new Set([
  // For tradeable items which can be "consumed" infinitely
  $item`ChibiBuddy™ (off)`,
]);

function garboSaleValue(item: Item, useHistorical: boolean): number {
  if (useHistorical) {
    if (historicalAge(item) <= 7.0 && historicalPrice(item) > 0) {
      const isMallMin = historicalPrice(item) === Math.max(100, 2 * autosellPrice(item));
      return isMallMin ? autosellPrice(item) : 0.9 * historicalPrice(item);
    }
  }
  return getSaleValue(item);
}

const garboRegularValueCache = new Map<Item, number>();
const garboHistoricalValueCache = new Map<Item, number>();
export function garboValue(item: Item, useHistorical = false): number {
  if (exclusions.has(item)) return 0;
  const cachedValue =
    garboRegularValueCache.get(item) ??
    (useHistorical ? garboHistoricalValueCache.get(item) : undefined);
  if (cachedValue === undefined) {
    const specialValueCompute = specialValueLookup.get(item);
    const value = specialValueCompute?.() ?? garboSaleValue(item, useHistorical);
    (useHistorical ? garboHistoricalValueCache : garboRegularValueCache).set(item, value);
    return value;
  }
  return cachedValue;
}
export function garboAverageValue(...items: Item[]): number {
  return sum(items, garboValue) / items.length;
}
