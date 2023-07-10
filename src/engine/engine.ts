import { args } from "../args";
import { getHalloweinerChoices } from "../resources/halloweiner";
import { SimulatedState } from "../simulated-state";
import { CombatActions, MyActionDefaults } from "./combat";
import { equipFirst } from "./outfit";
import { unusedBanishes } from "./resources";
import { BaggoTask } from "./task";
import { CombatResources, CombatStrategy, Engine, Outfit } from "grimoire-kolmafia";
import { haveEquipped, Item, mallPrice, toInt } from "kolmafia";
import {
  $effect,
  $item,
  $items,
  get,
  getBanishedMonsters,
  have,
  Macro,
  PropertiesManager,
} from "libram";

type FreeRun = { item: Item; successRate: number; price: number };
const RUN_SOURCES = [
  { item: $item`tattered scrap of paper`, successRate: 0.5 },
  { item: $item`green smoke bomb`, successRate: 0.9 },
  { item: $item`GOTO`, successRate: 0.3 },
];

export class BaggoEngine extends Engine<CombatActions, BaggoTask> {
  static runSource: FreeRun | null = null;

  static runMacro(): Macro {
    if (!BaggoEngine.runSource)
      return Macro.externalIf(
        $items`navel ring of navel gazing, Greatest American Pants`.some((i) => haveEquipped(i)),
        Macro.runaway()
      );
    return Macro.while_(
      `hascombatitem ${toInt(BaggoEngine.runSource.item)}`,
      Macro.item(BaggoEngine.runSource.item)
    );
  }

  constructor(tasks: BaggoTask[]) {
    super(tasks, { combat_defaults: new MyActionDefaults() });
    if (args.freerun) {
      BaggoEngine.runSource =
        RUN_SOURCES.map(({ item, successRate }) => ({
          item,
          successRate,
          price:
            SimulatedState.current().bagsGainedPerAdv() * args.bagvalue -
            mallPrice(item) / successRate, // Break-even price
        }))
          .sort((a, b) => b.price - a.price)
          .find(({ price }) => price > 0) ?? null;
    }
  }

  acquireItems(task: BaggoTask): void {
    const items = task.acquire
      ? typeof task.acquire === "function"
        ? task.acquire()
        : task.acquire
      : [];

    if (BaggoEngine.runSource) {
      items.push({
        ...BaggoEngine.runSource,
        num: Math.ceil(
          Math.log(1 / (1 - 0.999)) / Math.log(1 / (1 - BaggoEngine.runSource.successRate))
        ), // Enough to guarantee success >= 99.9% of the time
      });
    }
    super.acquireItems({ ...task, acquire: items });
  }

  execute(task: BaggoTask): void {
    super.execute(task);
    if (have($effect`Beaten Up`) || get("_lastCombatLost", false)) throw "Fight was lost";
  }

  customize(
    task: BaggoTask,
    outfit: Outfit,
    combat: CombatStrategy<CombatActions>,
    resources: CombatResources<CombatActions>
  ): void {
    // Set up a banish if needed
    const banishSources = unusedBanishes(combat.where("banish"));
    if (combat.can("banish")) resources.provide("banish", equipFirst(outfit, banishSources));

    const alreadyBanished = [...getBanishedMonsters().values()];
    for (const monster of alreadyBanished) {
      const strategy = combat.currentStrategy(monster);
      if (strategy === "banish") combat.macro(BaggoEngine.runMacro(), monster);
    }
  }

  initPropertiesManager(manager: PropertiesManager): void {
    manager.set({ hpAutoRecovery: 0.5, hpAutoRecoveryTarget: 1.0 });
    manager.setChoices(getHalloweinerChoices());
  }
}
