import { Outfit } from "grimoire-kolmafia";
import {
  canInteract,
  inebrietyLimit,
  Item,
  itemAmount,
  mallPrice,
  myAdventures,
  myFamiliar,
  myInebriety,
  myPath,
  myTurncount,
  print,
  retrieveItem,
  toInt,
} from "kolmafia";
import { $familiar, $item, $path, get, JuneCleaver, maxBy, withProperty } from "libram";
import { args } from "./args";
import { SimulatedState } from "./simulated-state";

export function debug(message: string, color?: string): void {
  if (color) {
    print(message, color);
  } else {
    print(message);
  }
}

export function formatAmountOfItem(amount: number, item: Item): string {
  return `${formatNumber(amount)} ${amount === 1 ? item : item.plural}`;
}

export function formatNumber(x: number): string {
  const str = x.toString();
  if (str.includes(".")) return x.toFixed(2);
  return str.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function acquire(quantity: number, item: Item, maxPrice: number): number {
  debug(
    `Trying to acquire ${formatAmountOfItem(quantity, item)}; max price ${formatNumber(maxPrice)}`,
    "green"
  );
  const startAmount = itemAmount(item);
  withProperty("autoBuyPriceLimit", maxPrice, () => retrieveItem(item, quantity));
  return itemAmount(item) - startAmount;
}

export function printOutfit(outfit: Outfit): void {
  for (const [slot, item] of outfit.equips) {
    print(`* ${slot}: ${item}`);
  }
  print(`* ${outfit.familiar}`);
}

export function ronin(): boolean {
  return !canInteract();
}

export function gyou(): boolean {
  return myPath() === $path`Grey You`;
}

export function canPull(item: Item): boolean {
  const pulls = get("_roninStoragePulls").split(",");
  return ronin() && pulls.length < 20 && !pulls.includes(`${toInt(item)}`);
}

export const adventures = myAdventures();
export const turncount = myTurncount();

export function turnsRemaining(): number {
  if (args.turns === 0) return 0;
  if (isFinite(args.turns) && args.turns > 0) {
    const spent = myTurncount() - turncount;
    return Math.min(args.turns - spent, myAdventures());
  }
  const spend = myAdventures() + Math.min(0, args.turns);
  return Math.round(spend / (1 - SimulatedState.baseline().advsGainedPerTurnTakingCombat()));
}

export function isSober(): boolean {
  return myInebriety() <= inebrietyLimit() - Number(myFamiliar() === $familiar`Stooper`);
}

export const juneCleaverChoiceValues = {
  1467: {
    1: 0,
    2: 0,
    3: 5 * get("valueOfAdventure"),
  },
  1468: { 1: 0, 2: 5, 3: 0 },
  1469: { 1: 0, 2: $item`Dad's brandy`, 3: 1500 },
  1470: { 1: 0, 2: $item`teacher's pen`, 3: 0 },
  1471: { 1: $item`savings bond`, 2: 250, 3: 0 },
  1472: {
    1: $item`trampled ticket stub`,
    2: $item`fire-roasted lake trout`,
    3: 0,
  },
  1473: { 1: $item`gob of wet hair`, 2: 0, 3: 0 },
  1474: { 1: 0, 2: $item`guilty sprout`, 3: 0 },
  1475: { 1: $item`mother's necklace`, 2: 0, 3: 0 },
} as const;

export function valueJuneCleaverOption(result: Item | number): number {
  return result instanceof Item ? mallPrice(result) : result;
}

export function bestJuneCleaverOption(id: typeof JuneCleaver.choices[number]): 1 | 2 | 3 {
  const options = [1, 2, 3] as const;
  return maxBy(options, (option) => valueJuneCleaverOption(juneCleaverChoiceValues[id][option]));
}

export let juneCleaverSkipChoices: typeof JuneCleaver.choices[number][] | null;
export function setJuneCleaverSkipChoices(): void {
  if (!juneCleaverSkipChoices) {
    juneCleaverSkipChoices = [...JuneCleaver.choices]
      .sort(
        (a, b) =>
          valueJuneCleaverOption(juneCleaverChoiceValues[a][bestJuneCleaverOption(a)]) -
          valueJuneCleaverOption(juneCleaverChoiceValues[b][bestJuneCleaverOption(b)])
      )
      .splice(0, 3);
  }
}
