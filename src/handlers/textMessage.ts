import { MyContext } from "../types";
import { sendStandardReply } from "../utils";
import { generateAndSendResponse } from "./generateAndSendResponse";

export async function handleTextMessage(ctx: MyContext) {
  if (!ctx.from?.id) return sendStandardReply(ctx, "Error: User ID is undefined.");

  const userMessage = ctx.message!.text || "No text provided";
  ctx.session.chatHistory.push({
    role: "user",
    content: userMessage
  });

  await generateAndSendResponse(ctx, userMessage);
}


