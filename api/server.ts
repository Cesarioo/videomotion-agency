import Fastify from "fastify";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";

const app = Fastify({ logger: true });

// Swagger (OpenAPI)
await app.register(swagger, {
  openapi: {
    info: {
      title: "My API",
      description: "Fastify + TS + Swagger",
      version: "1.0.0",
    },
  },
});

await app.register(swaggerUI, {
  routePrefix: "/docs",
});

app.get<{ Params: { id: string } }>(
    "/user/:id",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
          required: ["id"],
        },
        response: {
          200: {
            type: "object",
            properties: {
              id: { type: "string" },
            },
          },
        },
      },
    },
    async (req) => {
      return { id: req.params.id }; // now typed
    }
  );

app.listen({ port: 3000 });
