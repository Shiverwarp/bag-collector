import { BaggoTask } from "../../../../engine/task";
import { cleaverTask } from "./shared";
import { get, set } from "libram";
import * as LOV from "./lov";
import * as Oasis from "./oasis";
import * as Gingerbread from "./gingerbread";
import * as Payphone from "./closedcircuitphone";
import * as Snojo from "./snojo";
import * as Tentacles from "./tentacles";
import * as Oliver from "./oliver";
import * as Locket from "./locket";
import * as Prof from "./pocketprofessor";
import * as Putty from "./putty";
import * as Backup from "./backup";
import * as Witchess from "./witchess";
import * as Fax from "./fax";
import * as Chateau from "./chateau";
import * as Drunks from "./drunks";
import * as NEP from "./nep";

const freeFightTasks = [cleaverTask];

const freeFightTaskGroups = [
  LOV,
  Oasis,
  Gingerbread,
  Payphone,
  Snojo,
  Tentacles,
  Oliver,
  Locket,
  Prof,
  Backup,
  Putty,
  Witchess,
  Fax,
  Chateau,
  Drunks,
  NEP,
];

freeFightTaskGroups.forEach((tasks) => {
  freeFightTasks.push(...tasks.freefightTasks);
});

freeFightTasks.push({
  name: "freefights completed",
  completed: () => get("_baggo_freefights", "") === "true",
  do: () => set("_baggo_freefights", "true"),
});

export const getFreeFightTasks = (): BaggoTask[] => {
  return [...freeFightTasks];
};
