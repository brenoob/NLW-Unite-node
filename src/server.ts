import fastify from 'fastify';

const app = fastify();
// const baseURL = 'http://localhost:3333'


app.get('/', () => {
    return 'Hello World!';
})

app.get('/test', () => {
    return 'Hello test!';
})

app.listen({port: 3333}).then(() => {
    console.log(`HTTP server running on http://localhost:3333` )
})