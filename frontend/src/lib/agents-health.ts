const AGENTS_URL = import.meta.env.VITE_AGENTS_URL;

let agentsReady = false;
let checkPromise: Promise<boolean> | null = null;

export const isAgentsReady = () => agentsReady;

export const checkAgentsHealth = (): Promise<boolean> => {
  if (agentsReady) return Promise.resolve(true);
  if (!AGENTS_URL) {
    agentsReady = true;
    return Promise.resolve(true);
  }

  if (!checkPromise) {
    checkPromise = fetch(`${AGENTS_URL}/health`)
      .then((res) => {
        agentsReady = res.ok;
        checkPromise = null;
        return agentsReady;
      })
      .catch(() => {
        checkPromise = null;
        return false;
      });
  }

  return checkPromise;
};

// Start initial check immediately on import
checkAgentsHealth();
