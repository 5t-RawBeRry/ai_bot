import { MyContext } from "../types";
import { handleModels } from "../commands/models";
import { generateAndSendResponse } from "./generateAndSendResponse";
import ollama from 'ollama';
import { Bot } from "grammy";

export function setupCallbackQueryHandlers(bot: Bot<MyContext>) {
  bot.callbackQuery(/^regenerate:/, async (ctx) => {
    const [, messageId, userMessage] = ctx.callbackQuery.data.split(':');
    await ctx.answerCallbackQuery();

    ctx.session.chatHistory.pop();
    await ctx.api.deleteMessage(ctx.chat!.id, parseInt(messageId));
    await generateAndSendResponse(ctx, userMessage);
  });

  bot.callbackQuery("models", async (ctx) => {
    await ctx.answerCallbackQuery();
    await handleModels(ctx);
  });

  bot.callbackQuery("pull", async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.editMessageText("To pull a new model, use /pull <model_name>");
  });

  bot.callbackQuery(/^change_model:/, async (ctx) => {
    const modelName = ctx.callbackQuery.data.split(':')[1];
    await ctx.answerCallbackQuery();

    await ctx.editMessageText(
      `Are you sure you want to change the model to ${modelName}?`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              { text: "Yes", callback_data: `confirm_change_model:${modelName}` },
              { text: "No", callback_data: "cancel_change_model" }
            ]
          ]
        }
      }
    );
  });

  bot.callbackQuery(/^confirm_change_model:/, async (ctx) => {
    const modelName = ctx.callbackQuery.data.split(':')[1];
    await ctx.answerCallbackQuery();

    ctx.session.currentModel = modelName;
    await ctx.editMessageText(`Model has been updated to ${modelName}.`);
  });

  bot.callbackQuery("cancel_change_model", async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.editMessageText("Model change has been canceled.");
  });

  bot.callbackQuery(/^rm_model:/, async (ctx) => {
    const modelName = ctx.callbackQuery.data.split(':')[1];
    await ctx.answerCallbackQuery();

    await ctx.editMessageText(
      `Are you sure you want to delete the model ${modelName}?`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              { text: "Yes", callback_data: `confirm_rm_model:${modelName}` },
              { text: "No", callback_data: "cancel_rm_model" }
            ]
          ]
        }
      }
    );
  });

  bot.callbackQuery(/^confirm_rm_model:/, async (ctx) => {
    const modelName = ctx.callbackQuery.data.split(':')[1];
    await ctx.answerCallbackQuery();
    await ollama.delete({ model: modelName });
    await ctx.editMessageText(`Model ${modelName} has been successfully deleted.`);
  });

  bot.callbackQuery("cancel_rm_model", async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.editMessageText("Model deletion has been canceled.");
  });
}
