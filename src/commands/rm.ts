import { MyContext } from "../types";
import { InlineKeyboard } from "grammy";
import ollama from 'ollama';
import { handleError } from "../utils";

export async function handleRm(ctx: MyContext) {
  try {
    const modelList = await ollama.list();
    const keyboard = new InlineKeyboard();
    modelList.models.forEach(model => {
      keyboard.text(model.name, `rm_model:${model.name}`);
    });
    await ctx.reply(`Select the model you want to delete:`, { reply_markup: keyboard });
  } catch (error) {
    await handleError(ctx, error);
  }
}
