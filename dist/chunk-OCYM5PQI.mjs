import {
  generateSlug
} from "./chunk-KDMJHR3Z.mjs";
import {
  BadRequest
} from "./chunk-XCVHL5M6.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/Router-create-events.ts
import z from "zod";
async function createEvent(app) {
  app.withTypeProvider().post(
    "/events",
    {
      schema: {
        summary: "Create an event",
        tags: ["events"],
        body: z.object({
          title: z.string().min(4),
          details: z.string().nullable(),
          maximumAttendees: z.number().int().positive().nullable()
        }),
        response: {
          201: z.object({
            id: z.string().uuid()
          })
        }
      }
    },
    async (request, reply) => {
      const { title, details, maximumAttendees } = request.body;
      const slug = generateSlug(title);
      const existingEvent = await prisma.event.findUnique({
        where: {
          slug
        }
      });
      if (existingEvent) {
        throw new BadRequest("Event with the given title already exists");
      }
      const event = await prisma.event.create({
        data: {
          title,
          details,
          maximumAttendees,
          slug
        }
      });
      return reply.status(201).send({ id: event.id });
    }
  );
}

export {
  createEvent
};
