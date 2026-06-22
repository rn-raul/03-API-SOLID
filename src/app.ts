import fastify from 'fastify';
import { appRoutes } from './routes';
import { ZodError } from 'zod';
import { env } from './env';
export const app = fastify();

app.register(appRoutes);


app.setErrorHandler((error, request, reply) => {
    if (error instanceof ZodError) {
        return reply.status(400).send({
            error: 'Validation error',
            issues: error.format(),
        });
    }
    if(env.NODE_ENV != 'production') {
        console.error(error);
    } else {
        // TODO: Implementar um logger para registrar os erros em produção
    }
    return reply.status(500).send({
        error: 'Internal Server Error',
    });
})