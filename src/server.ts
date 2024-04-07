import fastify from "fastify";
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { createEvent } from "./routes/Router-create-events";
import { registerForEvent } from "./routes/Router-register-for-event";
import { getEvent } from "./routes/Router-get-event";
import { getAttendeeBadge } from "./routes/Router-get-attendee-badge";
import { checkIn } from "./routes/Router-check-in";
import { getEventAttendees } from "./routes/Router-get-event-attendees";

import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui"
import { errorHandler } from "./error-handler";
import fastifyCors from "@fastify/cors";

const app = fastify();

app.register(fastifyCors, {
  // o domínio http front que tem acesso a api neste caso todos
  origin: '*'
})

app.register(fastifySwagger, {
  swagger: {
    consumes: ['application/json'],
    produces: ['application/json'],
    info: {
      title: "Pass.in API",
      description: "Especificações da api back-end nodejs pass.in API construida durante NLW unite",
      version: "1.0.0"
    }
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs'
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(createEvent)
app.register(registerForEvent)
app.register(getEvent)
app.register(getAttendeeBadge)
app.register(checkIn)
app.register(getEventAttendees)

app.setErrorHandler(errorHandler)

// host: '0.0.0.0', para rodar em react native
app.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
  console.log(`HTTP server running on http://localhost:3333`);
});
