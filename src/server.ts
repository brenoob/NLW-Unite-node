import fastify from "fastify";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { createEvent } from "./routes/Router-create-events";
import { registerForEvent } from "./routes/Router-register-for-event";
import { getEvent } from "./routes/Router-get-event";
import { getAttendeeBadge } from "./routes/Router-get-attendee-badge";
import { checkIn } from "./routes/Router-check-in";
import { getEventAttendees } from "./routes/Router-get-event-attendees";

const app = fastify();

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(createEvent)
app.register(registerForEvent)
app.register(getEvent)
app.register(getAttendeeBadge)
app.register(checkIn)
app.register(getEventAttendees)

app.listen({ port: 3333 }).then(() => {
  console.log(`HTTP server running on http://localhost:3333`);
});
