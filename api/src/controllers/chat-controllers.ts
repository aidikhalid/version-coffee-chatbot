import { NextFunction, Request, Response } from "express";

const AGENTS_URL =
  process.env.AGENTS_URL || "http://localhost:8000";

export const createChatCompletion = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { messages } = req.body;
  if (!res.locals.user) {
    return res.status(401).json({ message: "Unauthorized, not authenticated" });
  }

  try {
    const agentResponse = await fetch(`${AGENTS_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });

    if (!agentResponse.ok) {
      const error = await agentResponse.text();
      console.error("Agents service error:", error);
      return res.status(502).json({ message: "Agents service error" });
    }

    const data = await agentResponse.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error calling agents service:", error);
    return res.status(502).json({ message: "Failed to reach agents service" });
  }
};
