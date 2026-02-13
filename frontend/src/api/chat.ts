import axios from "../lib/axios";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  memory?: Record<string, unknown>;
}

export const sendChatRequest = async (
  messages: ChatMessage[],
): Promise<ChatMessage> => {
  const res = await axios.post("/chats", { messages });
  return res.data;
};
