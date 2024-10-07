import { MyContext } from "../types";
import { sendStandardReply } from "../utils";
import * as dotenv from "dotenv";

dotenv.config();

const ALLOWED_USERS = process.env.ALLOWED_USERS?.split(",").map(Number) || [];

export async function checkUserPermission(ctx: MyContext, next: () => Promise<void>) {
  if (!ctx.from?.id || !ALLOWED_USERS.includes(ctx.from.id)) {
    await sendStandardReply(ctx, "Sorry, you are not authorized to use this bot.");
    return;
  }
  await next();
}
