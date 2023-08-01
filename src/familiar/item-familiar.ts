import { $familiar } from "libram";
import { FamiliarSpec } from "./spec";

export function itemFamiliarSpec(): FamiliarSpec {
  return { familiar: $familiar`Grey Goose` };
}
