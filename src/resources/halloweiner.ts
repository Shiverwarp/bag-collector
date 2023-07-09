import { Item } from "kolmafia";
import { $items, getSaleValue, maxBy } from "libram";

const choices = [1106, 1107, 1108] as const;

let bestHalloweiner = 0;

export function getHalloweinerChoices(): { [id in typeof choices[number]]: number } {
  if (bestHalloweiner === 0) {
    const halloweinerOptions: { price: number; choiceId: number }[] = (
      [
        [$items`bowl of eyeballs, bowl of mummy guts, bowl of maggots`, 1],
        [$items`blood and blood, Jack-O-Lantern beer, zombie`, 2],
        [$items`wind-up spider, plastic nightmare troll, Telltale™ rubber heart`, 3],
      ] as [Item[], number][]
    ).map(([halloweinerOption, choiceId]) => {
      return {
        price: getSaleValue(...halloweinerOption),
        choiceId: choiceId,
      };
    });
    bestHalloweiner = maxBy(halloweinerOptions, "price").choiceId;
  }

  return {
    1106: 3, // Ghost Dog Chow
    1107: 1, // tennis ball
    1108: bestHalloweiner,
  };
}
