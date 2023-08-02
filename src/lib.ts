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
import { $familiar, $item, $path, get, maxBy, withProperty } from "libram";
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

export function bestVykeaLevel(): number {
  const vykeas = [
    { level: 1, dowelCost: 0 },
    { level: 2, dowelCost: 1 },
    { level: 3, dowelCost: 11 },
    { level: 4, dowelCost: 23 },
    { level: 5, dowelCost: 37 },
  ];
  const vykeaProfit = (vykea: { level: number; dowelCost: number }) => {
    const { level, dowelCost } = vykea;
    return (
      myAdventures() * args.bagvalue * 0.1 * level -
      (10 * mallPrice($item`VYKEA rail`) +
        dowelCost * mallPrice($item`VYKEA dowel`) +
        1 * mallPrice($item`VYKEA instructions`))
    );
  };

  if (vykeas.some((vykea) => vykeaProfit(vykea) > 0)) {
    return maxBy(vykeas, vykeaProfit).level;
  }
  return 0;
}

export type RealmType = "spooky" | "stench" | "hot" | "cold" | "sleaze" | "fantasy" | "pirate";
export function realmAvailable(identifier: RealmType): boolean {
  if (identifier === "fantasy") {
    return get(`_frToday`) || get(`frAlways`);
  } else if (identifier === "pirate") {
    return get(`_prToday`) || get(`prAlways`);
  }
  return get(`_${identifier}AirportToday`) || get(`${identifier}AirportAlways`);
}
