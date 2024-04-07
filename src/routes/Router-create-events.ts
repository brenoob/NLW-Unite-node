import z from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { generateSlug } from "../utils/generate-slug";
import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_errors/Bad-request";

export async function createEvent(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post(
        "/events",
        {
            schema: {
                summary: "Create an event",
                tags: ["events"],
                body: z.object({
                    title: z.string().min(4),
                    details: z.string().nullable(),
                    maximumAttendees: z.number().int().positive().nullable(),
                }),
                response: {
                    201: z.object({
                        id: z.string().uuid(),
                    }),
                },
            },
        },
        async (request, reply) => {
            const { title, details, maximumAttendees } = request.body;

            const slug = generateSlug(title);

            const existingEvent = await prisma.event.findUnique({
                where: {
                    slug,
                },
            });

            if (existingEvent) {
                throw new BadRequest("Event with the given title already exists");
            }

            const event = await prisma.event.create({
                data: {
                    title,
                    details,
                    maximumAttendees,
                    slug,
                },
            });

            return reply.status(201).send({ id: event.id });
        }
    );
}
