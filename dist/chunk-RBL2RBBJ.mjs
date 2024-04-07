import {
  BadRequest
} from "./chunk-XCVHL5M6.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/Router-check-in.ts
import z from "zod";
async function checkIn(app) {
  app.withTypeProvider().get("/attendee/:attendeeId/check-in", {
    schema: {
      summary: "Check in attendee",
      tags: ["check-in"],
      params: z.object({
        attendeeId: z.coerce.number().int()
      }),
      response: {
        201: z.null()
      }
    }
  }, async (request, reply) => {
    const { attendeeId } = request.params;
    const existingCheckIn = await prisma.checkIn.findUnique({
      where: { attendeeId }
    });
    if (existingCheckIn) {
      throw new BadRequest("Attendee already checked in");
    }
    await prisma.checkIn.create({
      data: { attendeeId }
    });
    return reply.status(201).send();
  });
}

export {
  checkIn
};
