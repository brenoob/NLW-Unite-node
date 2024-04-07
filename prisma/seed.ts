import { prisma } from './../src/lib/prisma';
async function seed(){
    await prisma.event.create({
        data: {
            id: '84a0181b-e445-41d8-8522-773a183efa4c',
            title: 'My first event',
            slug: 'my-first-event',
            details: 'This is my first event',
            maximumAttendees: 10
        }
    })
}

seed().then(() => {
    console.log('Database seeded!');
    prisma.$disconnect();
})