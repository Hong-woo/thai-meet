import { createGate0FixtureStore } from "./gate0-fixture-store.mjs";
import { createGate1DatabaseStore } from "./gate1-database-store.mjs";

const SUPPORTED_PERSISTENCE_MODES = ["fixture", "database"];

export function createGate0StoreFromEnv(root, env = process.env) {
  const mode = String(env.PERSISTENCE_MODE || "fixture").trim();
  if (mode === "fixture") {
    return {
      mode,
      store: createGate0FixtureStore(root)
    };
  }

  if (mode === "database") {
    return {
      mode,
      store: createGate1DatabaseStore(root)
    };
  }

  throw new Error(`TM_GATE0_PERSISTENCE_MODE_UNSUPPORTED: PERSISTENCE_MODE=${mode} supported=${SUPPORTED_PERSISTENCE_MODES.join(",")}`);
}
