import { Bot } from "grammy";
import { MyContext } from "../types";
import { handleTextMessage } from "./textMessage";
import { setupCallbackQueryHandlers } from "./callbackQuery";

export { generateAndSendResponse } from "./generateAndSendResponse";

export function setupHandlers(bot: Bot<MyContext>) {
  bot.on(":text", handleTextMessage);
  setupCallbackQueryHandlers(bot);
}
