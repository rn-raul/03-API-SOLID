import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { expect, describe, it, beforeEach } from "vitest";
import { AuthenticateUseCase } from "./authenticate-use-case";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "./erros/invalid-credentials";

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase
describe('Authenticate Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        sut = new AuthenticateUseCase(usersRepository);
    })
    it('should be able to authenticate', async () => {
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
        await expect(() =>
            sut.execute({
                email: "eu.raullopes@email.com",
                password: '123456'
            }),
        ).rejects.toBeInstanceOf(InvalidCredentialsError)
    })
    it('should be able to authenticate with wrong password', async () => {
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