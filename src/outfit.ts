import { isSober } from "./lib";
import { Outfit } from "grimoire-kolmafia";
import { totalTurnsPlayed } from "kolmafia";
import { $effect, $item, $items, $slot, get, have } from "libram";
import { itemFamiliarSpec } from "./familiar/item-familiar";

export function baggoOutfit(includeFamiliar = true): Outfit {
  const outfit = new Outfit();

  if (includeFamiliar) outfit.equip(itemFamiliarSpec());

  if (!have($effect`Everything Looks Yellow`) && isSober()) {
    outfit.equip($item`Jurassic Parka`);
    outfit.setModes({
      parka: !have($effect`Everything Looks Yellow`) ? "dilophosaur" : "kachungasaur",
    });
  }

  if (
    get("questPAGhost") === "unstarted" &&
    get("nextParanormalActivity") <= totalTurnsPlayed() &&
    isSober()
  ) {
    outfit.equip($item`protonic accelerator pack`);
  }

  outfit.equip($items`June cleaver, Fourth of May Cosplay Saber`, $slot`weapon`);
  outfit.equip($item`carnivorous potted plant`);
  outfit.equip($item`mafia thumb ring`);
  outfit.equip($item`lucky gold ring`);
  outfit.equip($item`Mr. Cheeng's spectacles`);
  outfit.equip($item`tiny stillsuit`);
  outfit.setModes({ parka: "ghostasaurus" });

  outfit.equip({
    modifier: `100 familiar experience 11 max, 0.1 item`,
    avoid: [$item`time-twitching toolbelt`], // Might be uncessary in recent versions of mafia
  });
  return outfit;
}
