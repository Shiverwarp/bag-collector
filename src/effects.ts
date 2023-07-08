import { toEffect } from "kolmafia";
import { $skill, have } from "libram";

export const EFFECTS = [
  $skill`Blood Bond`,
  $skill`Leash of Linguini`,
  $skill`Empathy of the Newt`,
  $skill`The Spirit of Taking`,
  $skill`Fat Leon's Phat Loot Lyric`,
  $skill`Singer's Faithful Ocelot`,
  $skill`The Polka of Plenty`,
  $skill`Disco Leer`,
  $skill`Astral Shell`,
  $skill`Ghostly Shell`,
]
  .filter((skill) => have(skill))
  .map((skill) => toEffect(skill));
