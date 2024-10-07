import { Context, SessionFlavor } from "grammy";
import { HydrateFlavor } from "@grammyjs/hydrate";
import { ParseModeFlavor } from "@grammyjs/parse-mode";

export interface SessionData {
  chatHistory: { role: string; content: string }[];
  systemPrompt: string;
  currentModel: string;
}

export type MyContext = Context & SessionFlavor<SessionData> & HydrateFlavor<Context> & ParseModeFlavor<Context>;
