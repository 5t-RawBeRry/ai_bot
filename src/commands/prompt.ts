import { MyContext } from "../types";
import { sendStandardReply } from "../utils";

export async function handlePrompt(ctx: MyContext) {
  const newPrompt = ctx.message?.text.split(/\s+/).slice(1).join(' ').trim();

  if (!newPrompt) {
    await sendStandardReply(ctx, `Current System Prompt:\n\n*${ctx.session.systemPrompt}*\n\nTo change the prompt, use \`/prompt <new prompt>\``, { reply: true , markdown: true , success: true });
  } else {
    ctx.session.systemPrompt = newPrompt;
    await sendStandardReply(ctx, `System Prompt has been updated to:\n\n${newPrompt}`, { reply: true, success: true });
  }
}
