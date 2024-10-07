import { MyContext } from "../types";
import { sendStandardReply } from "./sendStandardReply";

export async function handleError(ctx: MyContext, error: any): Promise<void> {
  console.error("Error occurred:", error);
  const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
  await sendStandardReply(ctx, `An error occurred: ${errorMessage}`, { reply: true, error: true });
}
