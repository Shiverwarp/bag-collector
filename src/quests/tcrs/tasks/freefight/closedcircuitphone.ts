import { $effect, $item, $location, ClosedCircuitPayphone, get, have } from "libram";
import { BaggoTask } from "../../../../engine/task";
import { BaggoCombatStrategy } from "../../../../engine/combat";
import { use } from "kolmafia";
import { defaultOutfit } from "./shared";

export const freefightTasks: BaggoTask[] = [
  {
    name: "Turn In Rufus Quest for Forest",
    completed: () => get("questRufus") !== "step1",
    do: () => ClosedCircuitPayphone.submitQuest(),
  },
  {
    name: "accept closed-circuit quest",
    ready: () => ClosedCircuitPayphone.have(),
    completed: () => get("questRufus") !== "unstarted",
    do: () => ClosedCircuitPayphone.chooseQuest(() => 2),
  },
  {
    name: "pyec",
    ready: () => have($item`Platinum Yendorian Express Card`) && have($effect`Shadow Affinity`),
    completed: () => get("expressCardUsed"),
    do: () => use($item`Platinum Yendorian Express Card`),
  },
  {
    name: "shadow rift",
    completed: () => !have($effect`Shadow Affinity`),
    outfit: defaultOutfit,
    do: () => $location`Shadow Rift`,
    combat: new BaggoCombatStrategy().kill(),
  },
];
