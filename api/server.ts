import Fastify from "fastify";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import { config } from "dotenv";
import companiesRoutes from "./routes/companies.js";
import videoRoutes from "./routes/video.js";
import { verifyApiKey } from "./hooks/auth.js";

// Load environment variables
config();

const app = Fastify({ logger: false });

// Swagger (OpenAPI) - register FIRST
await app.register(swagger, {
  openapi: {
    info: {
      title: "Chocomotion API",
      description: "Fastify + TS + Swagger",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        apiKey: {
          type: "apiKey",
          name: "x-api-key",
          in: "header",
        },
      },
    },
    security: [{ apiKey: [] }],
  },
});

// Global authentication hook - runs before every request
app.addHook("onRequest", verifyApiKey);

// Register routes AFTER Swagger so they're scanned and included in docs
await app.register(companiesRoutes, { prefix: "/api" });
await app.register(videoRoutes, { prefix: "/api" });

await app.register(swaggerUI, {
  routePrefix: "/docs",
});

// Health check endpoint (public - auth is skipped in the hook for /docs)
app.get("/health", async () => {
  return { status: "ok" };
});

app.listen({ port: 3000 });
