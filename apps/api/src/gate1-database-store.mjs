export function createGate1DatabaseStore() {
  return {
    async readOpenApi() {
      throw notScaffolded("readOpenApi");
    },

    async readFixture() {
      throw notScaffolded("readFixture");
    }
  };
}

function notScaffolded(method) {
  return new Error(`TM_GATE1_DATABASE_STORE_NOT_SCAFFOLDED: ${method} requires Gate 1 persisted store implementation. See docs/dev/GATE1_PERSISTENCE.md.`);
}
