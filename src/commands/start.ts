import { MyContext } from "../types";
import { sendStandardReply } from "../utils";
import { Reactions } from "@grammyjs/emoji";
import { handleError } from "../utils";

export async function handleStart(ctx: MyContext) {
  try {
    if (!ctx.from?.id) return sendStandardReply(ctx, "Error: User ID is undefined.", { reply: true, error: true });
    await sendStandardReply(ctx, "Started " + Reactions.party_popper);
  } catch (error) {
    await handleError(ctx, error);
  }
}
