import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { expect, describe, it } from "vitest";
import { AuthenticateUseCase } from "./authenticate-use-case";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "./erros/invalid-credentials";

describe('Authenticate Use Case', () => {
    it('should be able to authenticate', async () => {
        const usersRepository = new InMemoryUsersRepository();
        const sut = new AuthenticateUseCase(usersRepository);

        await usersRepository.create({
            name: "Raul Lopes",
            email: "eu.raullopes@email.com",
            password_hash: await hash('123456', 6)
        })
        const { user } = await sut.execute({
            email: "eu.raullopes@email.com",
            password: '123456'
        })
        expect(user.id).toEqual(expect.any(String))
    })
    it('should be able to authenticate with wrong email', async () => {
        const usersRepository = new InMemoryUsersRepository();
        const sut = new AuthenticateUseCase(usersRepository);
        await expect(() =>
            sut.execute({
                email: "eu.raullopes@email.com",
                password: '123456'
            }),
        ).rejects.toBeInstanceOf(InvalidCredentialsError)
    })
    it('should be able to authenticate with wrong password', async () => {
        const usersRepository = new InMemoryUsersRepository();
        const sut = new AuthenticateUseCase(usersRepository);
        await usersRepository.create({
            name: "Raul Lopes",
            email: "eu.raullopes@email.com",
            password_hash: await hash('123456', 6)
        })
        await expect(() =>
            sut.execute({
                email: "eu.raullopes@email.com",
                password: '1234567'
            }),
        ).rejects.toBeInstanceOf(InvalidCredentialsError)
    })
})