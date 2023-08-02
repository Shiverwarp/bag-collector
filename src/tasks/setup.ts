import {
  availableAmount,
  buyUsingStorage,
  canEquip,
  cliExecute,
  getClanLounge,
  Item,
  itemAmount,
  mallPrice,
  myClass,
  myLocation,
  mySign,
  myThrall,
  putCloset,
  retrieveItem,
  runChoice,
  Slot,
  storageAmount,
  toSlot,
  use,
  useSkill,
  visitUrl,
} from "kolmafia";
import {
  $class,
  $effect,
  $familiar,
  $item,
  $location,
  $skill,
  $thrall,
  AsdonMartin,
  FloristFriar,
  get,
  getModifier,
  have,
  questStep,
  ReagnimatedGnome,
  SongBoom,
  SourceTerminal,
} from "libram";
import { BaggoTask } from "../engine/task";
import { itemFamiliarSpec } from "../familiar/item-familiar";
import { bestVykeaLevel, canPull, gyou, ronin, turnsRemaining } from "../lib";

const MARKET_QUESTS = [
  { pref: "questM23Meatsmith", url: "shop.php?whichshop=meatsmith&action=talk" },
  { pref: "questM24Doc", url: "shop.php?whichshop=doc&action=talk" },
  { pref: "questM25Armorer", url: "shop.php?whichshop=armory&action=talk" },
];

const FLORIST_FLOWERS = [
  FloristFriar.StealingMagnolia,
  FloristFriar.AloeGuvnor,
  FloristFriar.PitcherPlant,
];

let checkedGnomePart = false;

function pull(item: Item): BaggoTask {
  return {
    name: `Pull ${item}`,
    ready: () =>
      canPull(item) && (toSlot(item) === Slot.none || canEquip(item)) && storageAmount(item) >= 1,
    completed: () => !canPull(item),
    do: () => cliExecute(`pull ${item}`),
  };
}

function buyPull(item: Item, price: number): BaggoTask[] {
  if (item.tradeable && ronin()) {
    return [
      {
        name: `Buy ${item} to pull`,
        ready: () =>
          canPull(item) &&
          (toSlot(item) === Slot.none || canEquip(item)) &&
          mallPrice(item) <= price,
        completed: () => storageAmount(item) >= 1,
        do: () => buyUsingStorage(item, 1, price),
      },
      pull(item),
    ];
  } else {
    return [pull(item)];
  }
}

export const SETUP_TASKS: BaggoTask[] = [
  ...MARKET_QUESTS.map(({ pref, url }) => ({
    name: `Start Quest: ${pref}`,
    completed: () => questStep(pref) > -1,
    do: (): void => {
      visitUrl(url);
      runChoice(1);
    },
  })),
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
    name: "Pool Table",
    ready: () => $item`Clan pool table`.name in getClanLounge(),
    completed: () => get("_poolGames") >= 3,
    do: () => cliExecute("pool stylish"),
    limit: { tries: 3 },
  },
  {
    name: "Kgnee",
    ready: () => have($familiar`Reagnimated Gnome`) && !checkedGnomePart,
    completed: () => have($item`gnomish housemaid's kgnee`),
    do: () => ReagnimatedGnome.choosePart("kgnee"),
    post: (): void => {
      checkedGnomePart = true;
    },
    outfit: { familiar: $familiar`Reagnimated Gnome` },
    limit: { tries: 1 },
  },
  {
    name: "Source Terminal Enhance",
    ready: () => SourceTerminal.have(),
    completed: () => SourceTerminal.getEnhanceUses() >= 3,
    do: () => SourceTerminal.enhance($effect`items.enh`),
    limit: { tries: 3 },
  },
  {
    name: "Kremlin's Greatest Briefcase Buff",
    ready: () => have($item`Kremlin's Greatest Briefcase`),
    completed: () => get("_kgbClicksUsed") >= 22,
    do: () => cliExecute("Briefcase buff item"),
    limit: { tries: 8 },
  },
  {
    name: "Asdon Martin Fuel",
    ready: () => gyou() && ronin() && !["Mongoose", "Wallaby", "Vole"].includes(mySign()),
    completed: () =>
      have($effect`Driving Observantly`, turnsRemaining()) || have($item`loaf of soda bread`, 100),
    do: () =>
      retrieveItem(5, $item`all-purpose flower`) &&
      use(5, $item`all-purpose flower`) &&
      retrieveItem(availableAmount($item`wad of dough`), $item`loaf of soda bread`),
  },
  {
    name: "Asdon Martin",
    ready: () => AsdonMartin.installed(),
    completed: () => have($effect`Driving Observantly`, turnsRemaining()),
    do: () => AsdonMartin.drive($effect`Driving Observantly`, turnsRemaining()),
  },
  {
    name: "Horsery",
    ready: () => get("horseryAvailable"),
    completed: () => get("_horsery") === "dark horse",
    do: () => cliExecute("horsery dark"),
    limit: { tries: 1 },
  },
  {
    name: "GAP Vision",
    ready: () => have($item`Greatest American Pants`) && get("_gapBuffs") < 5,
    completed: () => get("_gapBuffs") >= 5,
    do: () => cliExecute("gap Vision"),
    outfit: { pants: $item`Greatest American Pants` },
    limit: { tries: 5 },
  },
  {
    name: "Mummery Item",
    ready: () => have($item`mumming trunk`),
    completed: () => get("_mummeryMods").includes("Item Drop"),
    do: () => cliExecute("mummery item"),
    outfit: () => itemFamiliarSpec(),
    limit: { tries: 1 },
  },
  // {
  //   name: "Clan Fortune",
  //   ready: () => $item`Clan Carnival Game`.name in getClanLounge(),
  //   completed: () => get("_clanFortuneBuffUsed"),
  //   do: () => cliExecute("fortune buff item"),
  // },
  {
    name: "SongBoom",
    ready: () => SongBoom.have() && SongBoom.songChangesLeft() > 0,
    completed: () => SongBoom.song() === "Food Vibrations",
    do: () => SongBoom.setSong("Food Vibrations"),
    limit: { tries: 1 },
  },
  {
    name: "Cosplay Saber",
    ready: () => have($item`Fourth of May Cosplay Saber`),
    completed: () => get("_saberMod") !== 0,
    do: () => cliExecute("saber familiar"),
    limit: { tries: 1 },
  },
  {
    name: "Bird Calendar",
    ready: () => have($item`Bird-a-Day calendar`),
    completed: () => have($skill`Seek out a Bird`),
    do: () => use(1, $item`Bird-a-Day calendar`),
    limit: { tries: 1 },
  },
  {
    name: "Daily Bird",
    after: ["Bird Calendar"],
    ready: () =>
      getModifier("Item Drop", $effect`Blessing of the Bird`) > 0 ||
      getModifier("Familiar Weight", $effect`Blessing of the Bird`) > 0,
    completed: () => get("_birdsSoughtToday") >= 6,
    do: () => useSkill($skill`Seek out a Bird`, 6 - get("_birdsSoughtToday")),
  },
  {
    name: "Favorite Bird",
    after: ["Bird Calendar"],
    ready: () =>
      have($skill`Visit your Favorite Bird`) &&
      (getModifier("Item Drop", $effect`Blessing of your favorite Bird`) > 0 ||
        getModifier("Familiar Weight", $effect`Blessing of your favorite Bird`) > 0),
    completed: () => get("_favoriteBirdVisited"),
    do: () => useSkill($skill`Visit your Favorite Bird`),
  },
  ...buyPull($item`human musk`, 15000),
  ...buyPull($item`ice house`, 50000),
  pull($item`mime army infiltration glove`),
  {
    name: "Craft Tiny Black Hole",
    ready: () => !have($item`mime army infiltration glove`),
    do: () => retrieveItem($item`tiny black hole`),
    completed: () => have($item`tiny black hole`),
    limit: { tries: 1 },
  },
  {
    name: "Configure Vykea",
    ready: () => get("_VYKEACompanionLevel") === 0 && bestVykeaLevel() > 0,
    completed: () => get("_VYKEACompanionLevel") > 0,
    do: () => cliExecute(`create level ${bestVykeaLevel()} lamp`),
    acquire: [{ item: $item`VYKEA hex key`, price: 5000 }],
  },
];
