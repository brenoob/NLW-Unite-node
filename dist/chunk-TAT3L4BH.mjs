import {
  BadRequest
} from "./chunk-XCVHL5M6.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/Router-get-event.ts
import z, { object } from "zod";
async function getEvent(app) {
  app.withTypeProvider().get("/events/:eventId", {
    schema: {
      summary: "Get an event",
      tags: ["events"],
      params: z.object({
        eventId: z.string().uuid()
      }),
      response: {
        200: object({
          event: z.object({
            id: z.string().uuid(),
            title: z.string(),
            details: z.string().nullable(),
            slug: z.string(),
            maximumAttendees: z.number().int().nullable(),
            attendeesAmount: z.number().int()
          })
        })
      }
    }
  }, async (request, reply) => {
    const { eventId } = request.params;
    const event = await prisma.event.findUnique({
      select: {
        id: true,
        title: true,
        details: true,
        slug: true,
        maximumAttendees: true,
        _count: {
          select: {
            attendees: true
          }
        }
      },
      where: {
        id: eventId
      }
    });
    if (event === null) {
      throw new BadRequest("Event not found");
    }
    return reply.send({
      event: {
        id: event.id,
        title: event.title,
        details: event.details,
        slug: event.slug,
        maximumAttendees: event.maximumAttendees,
        attendeesAmount: event._count.attendees
      }
    });
  });
}

export {
  getEvent
};