import {
  BadRequest
} from "./chunk-XCVHL5M6.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/Router-get-attendee-badge.ts
import z from "zod";
async function getAttendeeBadge(app) {
  app.withTypeProvider().get("/attendee/:attendeeId/badge", {
    schema: {
      summary: "Get attendee badge",
      tags: ["attendees"],
      params: z.object({
        attendeeId: z.coerce.number().int()
      }),
      response: {
        200: z.object({
          badge: z.object({
            name: z.string(),
            email: z.string().email(),
            eventTitle: z.string(),
            checkInUrl: z.string().url()
          })
        })
      }
    }
  }, async (request, reply) => {
    const { attendeeId } = request.params;
    const attendee = await prisma.attendee.findUnique({
      select: {
        name: true,
        email: true,
        event: {
          select: {
            title: true
          }
        }
      },
      where: {
        id: attendeeId
      }
    });
    if (attendee === null) {
      throw new BadRequest("Attendee not found");
    }
    const baseUrl = `${request.protocol}://${request.hostname}`;
    const checkInUrl = new URL(`/attendee/${attendeeId}/check-in`, baseUrl);
    return reply.send({
      badge: {
        name: attendee.name,
        email: attendee.email,
        eventTitle: attendee.event.title,
        checkInUrl: checkInUrl.toString()
      }
    });
  });
}

export {
  getAttendeeBadge
};
