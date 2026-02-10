import axios from "../lib/axios";

export const sendChatRequest = async (
  message: string,
  onChunk: (chunk: string) => void,
) => {
  const baseURL =
    import.meta.env.MODE === "development"
      ? "http://localhost:3000/api/v1"
      : import.meta.env.VITE_API_URL || "/api/v1";

  const response = await fetch(`${baseURL}/chats`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error("Failed to send message");
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  if (!reader) {
    throw new Error("No response body");
  }

  let fullResponse = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split("\n");

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const data = line.slice(6);
        if (data === "[DONE]") {
          return fullResponse;
        }
        try {
          const parsed = JSON.parse(data);
          if (parsed.content) {
            fullResponse += parsed.content;
            onChunk(parsed.content);
          }
        } catch (e) {
          // Skip invalid JSON
        }
      }
    }
  }

  return fullResponse;
};

export const fetchUserChats = async () => {
  const res = await axios.get("/chats");
  return res.data.chats;
};

export const deleteUserChats = async () => {
  const res = await axios.delete("/chats");
  return res.data.message;
};
