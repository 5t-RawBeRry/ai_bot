import { MyContext } from "../types";
import { sendStandardReply, handleError } from "../utils";

export async function handleReset(ctx: MyContext) {
  try {
    if (!ctx.from?.id) return sendStandardReply(ctx, "Error: User ID is undefined.", { reply: true, error: true });
    ctx.session.chatHistory = [];
    await sendStandardReply(ctx, "Your **chat history** has been reset.", { reply: true, success: true , markdown: true });
  } catch (error) {
    await handleError(ctx, error);
  }
}
