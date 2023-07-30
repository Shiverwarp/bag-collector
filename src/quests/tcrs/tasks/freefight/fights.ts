import {
  $familiar,
  $effect,
  $item,
  $location,
  $monster,
  $skill,
  ClosedCircuitPayphone,
  get,
  have,
  Macro,
  TunnelOfLove,
} from "libram";
import { BaggoTask } from "../../../../engine/task";
import { BaggoCombatStrategy } from "../../../../engine/combat";
import { cliExecute, mallPrice, myHp, myMaxhp, runChoice, use, useSkill, visitUrl } from "kolmafia";

const defaultOutfit = () => ({
  equip: [
    $item`June Cleaver`,
    $item`gnomish housemaid's kgnee`,
    get("_sweatOutSomeBoozeUsed") < 3 && get("sweat", 0) < 100
      ? $item`designer sweatpants`
      : $item`pantsgiving`,
  ],
  modifier: `+familiar weight`,
  familiar: $familiar`reagnimated gnome`,
});

export const freefightTasks: BaggoTask[] = [
  {
    name: "LOV",
    completed: () => get("_loveTunnelUsed"),
    outfit: defaultOutfit,
    do: () =>
      TunnelOfLove.fightAll("LOV Eardigan", "Open Heart Surgery", "LOV Extraterrestrial Chocolate"),
    combat: new BaggoCombatStrategy().kill(),
  },
  {
    name: "oasis",
    completed: () => get("breathitinCharges", 0) === 0,
    outfit: defaultOutfit,
    do: () => $location`The Oasis`,
    combat: new BaggoCombatStrategy()
      .macro(Macro.skill($skill`Snokebomb`), $monster`blur`)
      .macro(Macro.skill($skill`Feel Hatred`), $monster`oasis monster`)
      .macro(
        Macro.trySkill($skill`bowl a curveball`).item($item`Louder Than Bomb`),
        $monster`rolling stone`
      )
      .kill(),
  },
  {
    name: "gingerbread candies",
    ready: () => get("_gingerbreadCityTurns") === 9,
    completed: () => get("_gingerbreadCityTurns") >= 30,
    do: () => $location`Gingerbread Train Station`,
    choices: {
      1204: 1,
    },
  },
  {
    name: "gingerbread chocolate sculpture",
    ready: () => get("_gingerbreadCityTurns") === 19,
    completed: () => get("_gingerbreadCityTurns") >= 30,
    do: () => $location`Gingerbread Upscale Retail District`,
    prepare: () => cliExecute(`outfit gingerbread best`),
    choices: {
      1209: 2,
      1214: 2,
    },
  },
  {
    name: "gingerbread retail district",
    completed: () => get("_gingerbreadCityTurns") >= 30,
    outfit: defaultOutfit,
    do: () => $location`Gingerbread Upscale Retail District`,
    combat: new BaggoCombatStrategy().macro(Macro.item($item`gingerbread cigarette`)),
    acquire: [
      {
        item: $item`gingerbread cigarette`,
        price: 5000,
      },
    ],
  },
  {
    name: "bricko ooze",
    ready: () => mallPrice($item`bricko ooze`) < 6000,
    completed: () => get("_brickoFights") >= 10,
    outfit: defaultOutfit,
    do: () => use($item`bricko ooze`),
    combat: new BaggoCombatStrategy().kill(),
    prepare: () => {
      if (myHp() < myMaxhp() / 2) {
        use($item`scroll of drastic healing`);
      }
    },
    acquire: [
      {
        item: $item`bricko ooze`,
        price: 6000,
      },
      {
        item: $item`scroll of drastic healing`,
        price: 1000,
      },
    ],
  },
  {
    name: "lynyrd",
    ready: () => mallPrice($item`lynyrd snare`) < 6000,
    completed: () => get("_lynyrdSnareUses") >= 3,
    outfit: defaultOutfit,
    do: () => use($item`lynyrd snare`),
    combat: new BaggoCombatStrategy().kill(),
    prepare: () => {
      if (myHp() < myMaxhp() / 2) {
        use($item`scroll of drastic healing`);
      }
    },
    acquire: [
      {
        item: $item`lynyrd snare`,
        price: 5000,
      },
      {
        item: $item`scroll of drastic healing`,
        price: 1000,
      },
    ],
  },
  {
    name: "accept closed-circuit quest",
    ready: () => ClosedCircuitPayphone.have(),
    completed: () => get("questRufus") !== "unstarted",
    do: () => ClosedCircuitPayphone.chooseQuest((_) => 2),
  },
  {
    name: "pyec",
    completed: () => get("expressCardUsed"),
    do: () => use($item`platinum yendorian express card`),
  },
  {
    name: "shadow rift",
    completed: () => !have($effect`Shadow Affinity`),
    outfit: defaultOutfit,
    do: () => $location`Shadow Rift`,
    combat: new BaggoCombatStrategy().kill(),
  },
  {
    name: "Set Snojo",
    completed: () => !!get("snojoSetting"),
    do: (): void => {
      visitUrl("place.php?whichplace=snojo&action=snojo_controller");
      runChoice(3);
    },
  },
  {
    name: "snojo",
    completed: () => get("_snojoFreeFights") >= 10,
    outfit: defaultOutfit,
    do: () => $location`The X-32-F Combat Training Snowman`,
    combat: new BaggoCombatStrategy().kill(),
  },
  {
    name: "evoke eldritch horror",
    ready: () => have($skill`evoke eldritch horror`),
    completed: () => get("_eldritchHorrorEvoked"),
    outfit: defaultOutfit,
    do: () => useSkill($skill`evoke eldritch horror`),
    combat: new BaggoCombatStrategy().kill(),
  },
  {
    name: "visit stu",
    completed: () => get("_eldritchTentacleFought"),
    outfit: defaultOutfit,
    do: () => {
      visitUrl("place.php?whichplace=forestvillage&action=fv_scientist");
      runChoice(1);
    },
    combat: new BaggoCombatStrategy().kill(),
  },
  {
    name: "olver's place",
    completed: () => get("_speakeasyFreeFights") >= 3,
    outfit: defaultOutfit,
    do: () => $location`An Unusually Quiet Barroom Brawl`,
    combat: new BaggoCombatStrategy().kill(),
  },
  {
    name: "locket 1",
    ready: () => get("_locketMonstersFought").split(",").length === 0,
    completed: () => get("_locketMonstersFought").split(",").length >= 3,
    outfit: defaultOutfit,
    do: () => cliExecute("reminisce witchess knight"),
    combat: new BaggoCombatStrategy().kill(),
  },
  {
    name: "locket 1",
    ready: () => get("_locketMonstersFought").split(",").length === 1,
    completed: () => get("_locketMonstersFought").split(",").length >= 3,
    outfit: defaultOutfit,
    do: () => cliExecute("reminisce witchess bishop"),
    combat: new BaggoCombatStrategy().kill(),
  },
  {
    name: "locket 1",
    ready: () => get("_locketMonstersFought").split(",").length === 2,
    completed: () => get("_locketMonstersFought").split(",").length >= 3,
    outfit: defaultOutfit,
    do: () => cliExecute("reminisce witchess rook"),
    combat: new BaggoCombatStrategy().kill(),
  },
];

// 5 witchess
// 1 sausage goblin
// 21 professor fights
// 1 chateau
// 5 putty fights
// 10 free NEP fights
// 3 shattering punch
// 1 gingerbread mob hit
// 3 chest XRay
// 5 powdered madness
// 13 shadow brick
// 25 power pill
// 1 jokester
// 3 batoomerang
