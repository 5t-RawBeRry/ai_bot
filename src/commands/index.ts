import { Bot } from "grammy";
import { MyContext } from "../types";
import { handleStart } from "./start";
import { handleReset } from "./reset";
import { handlePrompt } from "./prompt";
import { handleModels } from "./models";
import { handlePull } from "./pull";
import { handleRm } from "./rm";

export function setupCommands(bot: Bot<MyContext>) {
  bot.command("start", handleStart);
  bot.command("reset", handleReset);
  bot.command("prompt", handlePrompt);
  bot.command("models", handleModels);
  bot.command("pull", handlePull);
  bot.command("rm", handleRm);
}
