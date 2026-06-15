const REQUIRED_PRODUCTION_ENV = {
  auth: ["AUTH_MODE", "AUTH_PROVIDER_JWKS_URL", "AUTH_PROVIDER_ISSUER", "AUTH_PROVIDER_AUDIENCE"],
  line: ["LINE_PROVIDER_MODE", "LINE_CHANNEL_ID", "LINE_CHANNEL_SECRET"],
  storage: ["OBJECT_STORAGE_MODE", "AWS_REGION", "S3_BUCKET_PUBLIC_ASSETS"],
  persistence: ["PERSISTENCE_MODE", "DATABASE_URL"]
};

const EXPECTED_PRODUCTION_VALUES = {
  AUTH_MODE: "production",
  LINE_PROVIDER_MODE: "production",
  OBJECT_STORAGE_MODE: "s3",
  PERSISTENCE_MODE: "database"
};

export function createProductionIntegrationManifest(env = process.env) {
  const groups = Object.fromEntries(
    Object.entries(REQUIRED_PRODUCTION_ENV).map(([name, keys]) => [
      name,
      keys.map((key) => ({
        key,
        present: Boolean(env[key]),
        expected: EXPECTED_PRODUCTION_VALUES[key] ?? "set"
      }))
    ])
  );

  return {
    status: getManifestStatus(groups, env),
    groups,
    expectedValues: EXPECTED_PRODUCTION_VALUES,
    requiredEnv: REQUIRED_PRODUCTION_ENV
  };
}

export function validateProductionIntegrations(env = process.env) {
  const manifest = createProductionIntegrationManifest(env);
  if (manifest.status === "ready") return manifest;

  const missing = [];
  for (const entries of Object.values(manifest.groups)) {
    for (const entry of entries) {
      if (!entry.present) missing.push(entry.key);
    }
  }

  const mismatched = Object.entries(EXPECTED_PRODUCTION_VALUES)
    .filter(([key, expected]) => env[key] && env[key] !== expected)
    .map(([key, expected]) => `${key}=${env[key]} expected=${expected}`);

  const details = [...missing.map((key) => `${key}=missing`), ...mismatched].join(", ");
  throw new Error(`TM_PRODUCTION_INTEGRATIONS_NOT_READY: ${details}`);
}

function getManifestStatus(groups, env) {
  for (const entries of Object.values(groups)) {
    for (const entry of entries) {
      if (!entry.present) return "not_ready";
    }
  }

  for (const [key, expected] of Object.entries(EXPECTED_PRODUCTION_VALUES)) {
    if (env[key] !== expected) return "not_ready";
  }

  return "ready";
}
