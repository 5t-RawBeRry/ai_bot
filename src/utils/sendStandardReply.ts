import { Message } from "grammy/types";
import { MyContext } from "../types";
import { Reactions } from "@grammyjs/emoji";

export async function sendStandardReply(ctx: MyContext, message: string, options: { error?: boolean, success?: boolean, reply?: boolean, markdown?: boolean } = {}): Promise<Message> {
  if (options.error) ctx.react(Reactions.thumbs_down);
  if (options.success) ctx.react(Reactions.ok_hand);
  return ctx.reply(message, {
    reply_to_message_id: options.reply ? ctx.msg!.message_id : undefined,
    parse_mode: options.markdown ? "Markdown" : undefined,
  });
}
