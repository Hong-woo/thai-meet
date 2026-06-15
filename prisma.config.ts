const defineConfig = (config: {
  schema: string;
  migrations: { path: string };
  datasource: { url: string };
}) => config;

export default defineConfig({
  schema: "apps/api/prisma/schema.prisma",
  migrations: {
    path: "apps/api/prisma/migrations"
  },
  datasource: {
    url: process.env.DATABASE_URL ?? "postgresql://gate1.local/thai_meet"
  }
});
