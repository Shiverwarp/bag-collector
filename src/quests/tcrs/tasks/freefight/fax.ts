import { $item, get, Macro } from "libram";
import { BaggoTask } from "../../../../engine/task";
import { BaggoCombatStrategy } from "../../../../engine/combat";
import { defaultOutfit } from "./shared";
import { chatPrivate, use, visitUrl, wait } from "kolmafia";

let faxRequested = false;

export const freefightTasks: BaggoTask[] = [
  {
    name: "Fax witchess knight",
    completed: () => faxRequested || get("_photocopyUsed"),
    do: (): void => {
      chatPrivate("cheeseFax", "fax witchess knight");
      faxRequested = true;
      wait(30);
    },
  },
  {
    name: "Fight fax",
    completed: () => get("_photocopyUsed"),
    do: (): void => {
      visitUrl("clan_viplounge.php?action=faxmachine&whichfloor=2");
      visitUrl("clan_viplounge.php?preaction=receivefax&whichfloor=2");
      use($item`photocopied monster`);
    },
    outfit: defaultOutfit,
    combat: new BaggoCombatStrategy().macro(Macro.tryItem($item`Spooky Putty sheet`)).kill(),
  },
];
