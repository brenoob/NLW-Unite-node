import {
  getEvent
} from "./chunk-TAT3L4BH.mjs";
import {
  registerForEvent
} from "./chunk-N2PE46AU.mjs";
import {
  errorHandler
} from "./chunk-GQJMONBK.mjs";
import {
  checkIn
} from "./chunk-RBL2RBBJ.mjs";
import {
  createEvent
} from "./chunk-OCYM5PQI.mjs";
import "./chunk-KDMJHR3Z.mjs";
import {
  getAttendeeBadge
} from "./chunk-LYZYFTIN.mjs";
import "./chunk-XCVHL5M6.mjs";
import {
  getEventAttendees
} from "./chunk-UVUBZBEK.mjs";
import "./chunk-JV6GRE7Y.mjs";

// src/server.ts
import fastify from "fastify";
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifyCors from "@fastify/cors";
var app = fastify();
app.register(fastifyCors, {
  // o domínio http front que tem acesso a api neste caso todos
  origin: "*"
});
app.register(fastifySwagger, {
  swagger: {
    consumes: ["application/json"],
    produces: ["application/json"],
    info: {
      title: "Pass.in API",
      description: "Especifica\xE7\xF5es da api back-end nodejs pass.in API construida durante NLW unite",
      version: "1.0.0"
    }
  },
  transform: jsonSchemaTransform
});
app.register(fastifySwaggerUi, {
  routePrefix: "/docs"
});
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(createEvent);
app.register(registerForEvent);
app.register(getEvent);
app.register(getAttendeeBadge);
app.register(checkIn);
app.register(getEventAttendees);
app.setErrorHandler(errorHandler);
app.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
  console.log(`HTTP server running on http://localhost:3333`);
});
