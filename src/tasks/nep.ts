import { canInteract, runChoice, toUrl, visitUrl } from "kolmafia";
import { $location, $monsters, $skill, get, Macro } from "libram";
import { args } from "../args";
import { gyou, isSober, turnsRemaining } from "../lib";
import { olfactMonster } from "../main";
import { baggoOutfit } from "../outfit";
import { bubbleVision, potionSetup } from "../potions";
import { BaggoTask } from "../engine/task";
import { BaggoCombatStrategy } from "../engine/combat";
import { BaggoEngine } from "../engine/engine";
import { EFFECTS } from "../effects";

let potionsCompleted = false;

export const NEP_TASKS: BaggoTask[] = [
  {
    name: "Potions",
    completed: () => !canInteract() || potionsCompleted,
    do: potionSetup,
    post: (): void => {
      potionsCompleted = true;
    },
    outfit: baggoOutfit,
  },
  {
    name: "Party Fair",
    completed: () => get("_questPartyFair") !== "unstarted" || args.buff,
    do: (): void => {
      visitUrl(toUrl($location`The Neverending Party`));
      if (["food", "booze"].includes(get("_questPartyFairQuest"))) runChoice(1);
      else runChoice(2);
    },
    limit: { tries: 1 },
  },
  {
    name: "Collect Bags",
    after: ["Potions", "Party Fair"],
    completed: () => turnsRemaining() <= 0 || args.buff,
    prepare: bubbleVision,
    do: $location`The Neverending Party`,
    outfit: baggoOutfit,
    effects: EFFECTS,
    choices: { 1324: 5 },
    combat: new BaggoCombatStrategy()
      .startingMacro(() => Macro.externalIf(!isSober(), Macro.attack().repeat()))
      .banish($monsters`biker, party girl, "plain" girl`)
      .macro(
        () =>
          Macro.externalIf(
            !gyou(),
            Macro.if_(`!hppercentbelow 75`, Macro.step("pickpocket")),
            Macro.step("pickpocket")
          )
            .if_(`match "unremarkable duffel bag" || match "van key"`, BaggoEngine.runMacro())
            .trySkill($skill`Spit jurassic acid`)
            .trySkill($skill`Summon Love Gnats`)
            .if_(
              "!hppercentbelow 75 && !mpbelow 40",
              Macro.trySkill($skill`Double Nanovision`).trySkill($skill`Double Nanovision`)
            ),
        $monsters`burnout, jock`
      )
      .macro((): Macro => {
        return olfactMonster
          ? Macro.if_(olfactMonster, Macro.trySkill($skill`Transcendent Olfaction`))
          : new Macro();
      })
      .kill(),
  },
];
