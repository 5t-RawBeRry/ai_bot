import { MyContext } from "../types";
import ollama from 'ollama';
import { handleError } from "../utils";

export async function handlePull(ctx: MyContext) {
  const modelName = ctx.message.text.split(' ')[1];
  if (!modelName) {
    await ctx.reply("Please specify a model name. Usage: /pull <model_name>");
    return;
  }
  await pullModel(ctx, modelName);
}

async function pullModel(ctx: MyContext, modelName: string) {
  const statusMessage = await ctx.reply(`Pulling model ${modelName}...`);
  let lastUpdateTime = Date.now();

  try {
    const pullStream = await ollama.pull({ model: modelName, stream: true });
    for await (const progress of pullStream) {
      if (Date.now() - lastUpdateTime > 5000) { // Update every 5 seconds
        await updateStatusMessage(statusMessage, modelName, progress);
        lastUpdateTime = Date.now();
      }
    }
    await updateStatusMessage(statusMessage, modelName, null, true);
  } catch (error) {
    await handleError(ctx, error);
    await ctx.editMessageText(`Failed to pull model ${modelName}. Please try again later.`);
  }
}

async function updateStatusMessage(statusMessage: any, modelName: string, progress: any, completed = false) {
  if (completed) {
    await statusMessage.editText(`Model ${modelName} has been successfully pulled.`);
    return;
  }

  const { status, completed: comp, total } = progress;
  const formattedComp = formatSize(comp);
  const formattedTotal = formatSize(total);
  const text = `Pulling model ${modelName}...
Status: ${status}
Progress: ${formattedComp} / ${formattedTotal}`;

  await statusMessage.editText(text);
}

function formatSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}
