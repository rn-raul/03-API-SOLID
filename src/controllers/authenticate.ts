import { FastifyRequest, FastifyReply } from "fastify";
import { InvalidCredentialsError } from "@/use-cases/erros/invalid-credentials";
import { makeAuthenticateUseCase } from "@/use-cases/factories/make-authenticate-use-case";
import { z } from 'zod';

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
    const authenticateBodySchema = z.object({
        email: z.email(),
        password: z.string().min(6),
    });
    const { email, password } = authenticateBodySchema.parse(request.body);
    try {
        const authenticateUseCase = makeAuthenticateUseCase();
        await authenticateUseCase.execute({
            email,
            password
        })
    } catch (error) {
        if (error instanceof InvalidCredentialsError) {
            return reply.status(400).send({ error: error.message });
        }
        throw error;
    }
    reply.status(200).send();
}