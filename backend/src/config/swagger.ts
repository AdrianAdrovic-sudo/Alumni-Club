import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Alumni Club API",
      version: "1.0.0",
      description: "API dokumentacija za Alumni Club projekat",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Lokalni server",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express) {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
