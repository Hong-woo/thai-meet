import { readFile } from "node:fs/promises";
import path from "node:path";

export function createGate0FixtureStore(root) {
  if (typeof root !== "string" || root.trim().length === 0 || !path.isAbsolute(root)) {
    throw new Error("TM_GATE0_FIXTURE_STORE_ROOT_INVALID: root must be a non-empty absolute string");
  }

  async function readJson(relativePath) {
    try {
      const data = await readFile(path.join(root, relativePath), "utf8");
      try {
        return JSON.parse(data);
      } catch (error) {
        throw new Error(`TM_GATE0_FIXTURE_STORE_INVALID_JSON: could not parse ${relativePath}: ${error.message}`);
      }
    } catch (error) {
      if (String(error.message).includes("TM_GATE0_FIXTURE_STORE_INVALID_JSON")) {
        throw error;
      }
      throw new Error(`TM_GATE0_FIXTURE_STORE_READ_FAILED: could not read ${relativePath}: ${error.message}`);
    }
  }

  return {
    async readOpenApi() {
      return await readJson("packages/api-contracts/openapi/gate0.openapi.json");
    },

    async readFixture() {
      return await readJson("packages/api-contracts/fixtures/gate0-smoke.json");
    }
  };
}
