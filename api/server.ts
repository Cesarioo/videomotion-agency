import Fastify from "fastify";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import { config } from "dotenv";
import companiesRoutes from "./routes/companies.js";
import employeesRoutes from "./routes/employees.js";
import videoRoutes from "./routes/video.js";
import { verifyApiKey } from "./hooks/auth.js";
import { startVideoWorker } from "@/core/workers/videoWorker.js";
import { startEnrichWorker } from "@/core/workers/enrichWorker.js";
import { startEmailEnrichWorker } from "@/core/workers/emailEnrichWorker.js";

// Load environment variables
config();

// Start workers
startEnrichWorker();
startVideoWorker();
startEmailEnrichWorker();

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

// Health check endpoint (public - auth is skipped in the hook for /docs)
app.get("/health", async () => {
  return { status: "ok" };
});
// Register routes AFTER Swagger so they're scanned and included in docs
await app.register(videoRoutes, { prefix: "/api" });
await app.register(companiesRoutes, { prefix: "/api" });
await app.register(employeesRoutes, { prefix: "/api" });

await app.register(swaggerUI, {
  routePrefix: "/docs",
});



await app.listen({ port: 3000, host: '127.0.0.1' });
console.log('🚀 Server running on http://localhost:3000');
console.log('📚 Swagger docs available at http://localhost:3000/docs');