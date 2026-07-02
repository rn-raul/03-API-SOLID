import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { expect, describe, it, beforeEach } from "vitest";
import { GetUserProfileUseCase } from "./get-user-profile";
import { ResourceNotFoundError } from "./erros/resource-not-found-error";
import { hash } from "bcryptjs";


let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase
describe('Get User Profile Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        sut = new GetUserProfileUseCase(usersRepository);
    })
    it('should be able to get user profile', async () => {
        const createdUser = await usersRepository.create({
            name: "Raul Lopes",
            email: "eu.raullopes@email.com",
            password_hash: await hash('123456', 6)
        })
        const { user } = await sut.execute({
            userId: createdUser.id
        })
        expect(user.name).toEqual("Raul Lopes")
    })
    it('should be able to get user profile with invalid user ID', async () => {
        await expect(() =>
            sut.execute({
                userId: "invalid-user-id"
            }),
        ).rejects.toBeInstanceOf(ResourceNotFoundError)
    })
})