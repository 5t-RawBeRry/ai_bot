import { Bot, session } from "grammy";
import { autoRetry } from "@grammyjs/auto-retry";
import { run, sequentialize } from "@grammyjs/runner";
import { hydrate } from "@grammyjs/hydrate";
import * as dotenv from "dotenv";
import { MyContext, SessionData } from "./types";
import { checkUserPermission } from "./middleware";
import { setupCommands } from "./commands";
import { setupHandlers } from "./handlers";

dotenv.config();

const bot = new Bot<MyContext>(process.env.BOT_TOKEN!);
const maxRetryAttempts = parseInt(process.env.MAX_RETRY_ATTEMPTS || "5", 10);
const maxDelaySeconds = parseInt(process.env.MAX_DELAY_SECONDS || "10", 10);
if (!process.env.CURRENT_MODEL) throw new Error("CURRENT_MODEL is not defined");
const currentModel = process.env.CURRENT_MODEL;
if (!process.env.SYSTEM_PROMPT) throw new Error("SYSTEM_PROMPT is not defined");
const systemPrompt = process.env.SYSTEM_PROMPT;

bot.use(
  session({
    initial: (): SessionData => ({
      chatHistory: [],
      systemPrompt: systemPrompt,
      currentModel: currentModel
    })
  }),

  checkUserPermission,
  hydrate(),
  sequentialize((ctx) => [ctx.chat?.id.toString(), ctx.from?.id.toString()].filter(Boolean) as string[]),
);

bot.api.config.use(autoRetry({ maxRetryAttempts: maxRetryAttempts, maxDelaySeconds: maxDelaySeconds }));

setupCommands(bot);
setupHandlers(bot);

run(bot);
