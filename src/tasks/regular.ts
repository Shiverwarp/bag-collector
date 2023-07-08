import {
  abort,
  canAdventure,
  expectedColdMedicineCabinet,
  getWorkshed,
  itemAmount,
  Location,
  myClass,
  myLocation,
  myThrall,
  putCloset,
  runChoice,
  totalTurnsPlayed,
  useSkill,
  visitUrl,
} from "kolmafia";
import {
  $class,
  $item,
  $location,
  $monster,
  $skill,
  $thrall,
  AutumnAton,
  Counter,
  FloristFriar,
  get,
  getKramcoWandererChance,
  have,
  Macro,
  SourceTerminal,
} from "libram";
import { args } from "../args";
import { BaggoCombatStrategy } from "../engine/combat";
import { BaggoTask } from "../engine/task";
import { freeFightFamiliarSpec } from "../familiar/free-fight-familiar";
import { meatFamiliarSpec } from "../familiar/meat-familiar";
import { isSober } from "../lib";
import { baggoOutfit } from "../outfit";
import { EFFECTS } from "../effects";
import { Outfit, OutfitSpec } from "grimoire-kolmafia";

const FLORIST_FLOWERS = [
  FloristFriar.StealingMagnolia,
  FloristFriar.AloeGuvnor,
  FloristFriar.PitcherPlant,
];

export const REGULAR_TASKS: BaggoTask[] = [
  {
    name: "Closet Massagers",
    completed: () => itemAmount($item`personal massager`) === 0,
    do: () => putCloset(itemAmount($item`personal massager`), $item`personal massager`),
    limit: { tries: 1 },
  },
  {
    name: "Spice Ghost",
    ready: () => myClass() === $class`Pastamancer` && have($skill`Bind Spice Ghost`),
    completed: () => myThrall() === $thrall`Spice Ghost`,
    do: () => useSkill($skill`Bind Spice Ghost`),
    limit: { tries: 1 },
  },
  {
    name: "Florist Friar",
    ready: () => FloristFriar.have() && myLocation() === $location`The Neverending Party`,
    completed: () =>
      FloristFriar.isFull() || FLORIST_FLOWERS.every((flower) => !flower.available()),
    do: () => FLORIST_FLOWERS.forEach((flower) => flower.plant()),
    limit: { tries: 1 },
  },
  {
    name: "Digitized Wanderer",
    completed: () => Counter.get("Digitize Monster") > 0,
    do: () => (isSober() ? $location`Noob Cave` : $location`Drunken Stupor`),
    outfit: (): OutfitSpec | Outfit => {
      return SourceTerminal.getDigitizeMonster() === $monster`Knob Goblin Embezzler`
        ? { ...meatFamiliarSpec(), modifier: "meat" }
        : baggoOutfit();
    },
    combat: new BaggoCombatStrategy().kill(),
    effects: EFFECTS,
  },
  {
    name: "Proton Ghost",
    ready: () =>
      have($item`protonic accelerator pack`) && canAdventure(get("ghostLocation", Location.none)),
    completed: () => get("questPAGhost") === "unstarted" || args.buff,
    do: () => get("ghostLocation") ?? abort("Failed to find proper ghost location"),
    effects: EFFECTS,
    outfit: (): OutfitSpec => {
      return {
        ...baggoOutfit(false).spec(),
        ...freeFightFamiliarSpec(),
        back: $item`protonic accelerator pack`,
      };
    },
    combat: new BaggoCombatStrategy().macro(
      Macro.trySkill($skill`Sing Along`)
        .trySkill($skill`Summon Love Gnats`)
        .trySkill($skill`Shoot Ghost`)
        .trySkill($skill`Shoot Ghost`)
        .trySkill($skill`Shoot Ghost`)
        .trySkill($skill`Trap Ghost`)
    ),
  },
  {
    name: "Kramco",
    ready: () => have($item`Kramco Sausage-o-Matic™`),
    completed: () => getKramcoWandererChance() < 1,
    do: () => (isSober() ? $location`Noob Cave` : $location`Drunken Stupor`),
    outfit: (): OutfitSpec => {
      return {
        ...baggoOutfit(false).spec(),
        ...freeFightFamiliarSpec(),
        offhand: $item`Kramco Sausage-o-Matic™`,
      };
    },
    combat: new BaggoCombatStrategy().kill(),
  },
  {
    name: "Cold Medicine Cabinet",
    ready: () =>
      getWorkshed() === $item`cold medicine cabinet` &&
      expectedColdMedicineCabinet()["pill"] === $item`Extrovermectin™`,
    completed: () =>
      get("_coldMedicineConsults") >= 5 || get("_nextColdMedicineConsult") > totalTurnsPlayed(),
    do: (): void => {
      visitUrl("campground.php?action=workshed");
      runChoice(5);
    },
    limit: { tries: 5 },
  },
  {
    name: "Autumn-Aton",
    completed: () => !AutumnAton.available(),
    do: (): void => {
      AutumnAton.sendTo($location`The Neverending Party`);
    },
  },
];
