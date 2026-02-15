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

const API_BASE =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000/api/v1"
    : import.meta.env.VITE_API_URL || "/api/v1";

export const sendChatRequestStream = async (
  messages: ChatMessage[],
  onToken: (token: string) => void,
  onMemory: (memory: Record<string, unknown>) => void,
): Promise<void> => {
  const res = await fetch(`${API_BASE}/chats/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ messages }),
  });

  if (!res.ok) {
    throw new Error(`Stream request failed: ${res.status}`);
  }

  const reader = res.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data: ")) continue;
      const data = trimmed.slice(6);
      if (data === "[DONE]") return;

      try {
        const event = JSON.parse(data);
        if (event.type === "token") {
          onToken(event.content);
        } else if (event.type === "memory") {
          onMemory(event.content);
        } else if (event.type === "error") {
          throw new Error(event.content);
        }
      } catch (e) {
        if (e instanceof SyntaxError) continue;
        throw e;
      }
    }
  }
};
