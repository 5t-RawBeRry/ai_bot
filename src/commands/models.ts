import { MyContext } from "../types";
import { InlineKeyboard } from "grammy";
import ollama from 'ollama';
import { handleError } from "../utils";

export async function handleModels(ctx: MyContext) {
  try {
    const modelList = await ollama.list();
    const keyboard = new InlineKeyboard();
    modelList.models.forEach(model => {
      keyboard.text(model.name, `change_model:${model.name}`);
    });
    await ctx.reply(`Current Model: ${ctx.session.currentModel}\n\nAvailable Models:`, { reply_markup: keyboard });
  } catch (error) {
    await handleError(ctx, error);
  }
}
