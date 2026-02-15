import app from "./app.js";
import { connectToDatabase } from "./db/connection.js";

const PORT = process.env.PORT || 3000;
const AGENTS_URL = process.env.AGENTS_URL;

const wakeAgents = async () => {
  if (!AGENTS_URL) return;
  try {
    const res = await fetch(`${AGENTS_URL}/health`);
    if (res.ok) console.log("Agents service is awake");
    else console.warn(`Agents health check returned ${res.status}`);
  } catch {
    console.warn("Agents service not reachable yet, will retry on first request");
  }
};

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server open on port ${PORT}`);
      // wakeAgents(); // Frontend handles agent wake-up instead
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  });
