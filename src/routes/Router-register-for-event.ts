import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";

export async function registerForEvent(app: FastifyInstance) {
    app
    .withTypeProvider<ZodTypeProvider>().post('/events/:eventId/attendee', {
        schema: {
            body: z.object({
                name: z.string().min(4),
                email: z.string().email()
            }),
            params: z.object({
                eventId: z.string().uuid()
            }),
            response: {
                201: z.object({
                    attendeeId: z.number()
                })
            }
        }
    }, async(request, reply) => {
        const { eventId } = request.params  
        const { name, email } = request.body

        // verificação se o email e o eventId são unicos antes de verificar no banco novamente por garantia la
        const attendeeFromEmail = await prisma.attendee.findUnique({
            where: {
                eventId_email: {
                    eventId,
                    email
                }
            }
        })

        if(attendeeFromEmail !== null) {
            throw new Error('Email already registered for this event')
        }

        const [amountOfAttendeesForEvent, event] = await Promise.all([
            prisma.attendee.count({
                where: {
                    eventId
                }
            }),
            prisma.event.findUnique({
                where: {
                    id: eventId
                }
            })
        ])

        if(event?.maximumAttendees && amountOfAttendeesForEvent >= event.maximumAttendees) {
            throw new Error('Maximum number of attendees for this event')
        }

        const attendee = await prisma.attendee.create({
            data: {
                name,
                email,
                eventId
            }
        })

        return reply.status(201).send({attendeeId: attendee.id})
    })
}