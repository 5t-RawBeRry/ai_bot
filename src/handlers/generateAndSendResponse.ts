import { MyContext } from "../types";
import ollama from 'ollama';
import { handleError, sendStandardReply } from "../utils";

export async function generateAndSendResponse(ctx: MyContext, userMessage: string) {
    const statusMessage = await ctx.reply("*Processing...*", {  parse_mode: "Markdown" });
    let aiResponse = '';
    let displayResponse = '';
    let updateCounter = 0;
  
    try {
      const messages = [
        { role: "system", content: ctx.session.systemPrompt },
        ...ctx.session.chatHistory
      ];
  
      const response = await ollama.chat({ model: ctx.session.currentModel, messages, stream: true });
      for await (const part of response) {
        aiResponse += part.message.content;
        updateCounter++;
  
        if (updateCounter % Math.floor(Math.random() * 5 + 4) === 0) {
          displayResponse = aiResponse.slice(0, displayResponse.length + Math.floor(Math.random() * 5 + 4));
          try {
            // @ts-ignore
            await statusMessage.editText(displayResponse.trim() || "Thinking...");
          } catch (error) {
            if (!(error instanceof Error) || !error.message.includes("message is not modified")) {
              console.error("Error editing message:", error);
            }
          }
        }
      }
  
      const finalMessage = aiResponse.trim() || "I'm sorry, I couldn't generate a response. Please try again.";
      // @ts-ignore
      await statusMessage.editText(finalMessage, {
        reply_markup: {
          inline_keyboard: [
            [
              { text: "Regenerate", callback_data: `regenerate:${statusMessage.message_id}:${userMessage}` }
            ]
          ]
        },
        parse_mode: "Markdown"
      });
  
      if (aiResponse.trim()) {
        ctx.session.chatHistory.push({ role: "assistant", content: aiResponse });
      }
    } catch (error) {
      await handleError(ctx, error);
    }
  }
  