import { FastifyRequest, FastifyReply } from "fastify";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repositories";
import { AuthenticateUseCase } from "@/use-cases/authenticate-use-case";
import { InvalidCredentialsError } from "@/use-cases/erros/invalid-credentials";
import { z } from 'zod';

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
    const authenticateBodySchema = z.object({
        email: z.email(),
        password: z.string().min(6),
    });
    const { email, password } = authenticateBodySchema.parse(request.body);
    try {
        const usersRepository = new PrismaUsersRepository()
        const authenticateUseCase = new AuthenticateUseCase(usersRepository)
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