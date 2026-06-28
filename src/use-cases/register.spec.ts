import { describe, it, expect } from 'vitest';
import { RegisterUseCase } from './register-use-case';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { compare } from 'bcryptjs';
import { UserAlreadyExistsError } from './erros/user-already-exits';

describe('Register Use Case', () => {
    it("should be able to register", async () => {
        const usersRepository = new InMemoryUsersRepository
        const registerUseCase = new RegisterUseCase(usersRepository);

        const { user } = await registerUseCase.execute({
            name: "Raul Lopes",
            email: "eu.proton@email.com",
            password: "abcde123"
        })
        expect(user.id).toEqual(expect.any(String))
    })
    it("should hash user password upon registration", async () => {
        const usersRepository = new InMemoryUsersRepository
        const registerUseCase = new RegisterUseCase(usersRepository);

        const { user } = await registerUseCase.execute({
            name: "Raul Lopes",
            email: "eu.proton@email.com",
            password: "abcde123"
        })
        const isPasswordCorrectlyHashed = await compare(
            'abcde123',
            user.password_hash
        )
        expect(isPasswordCorrectlyHashed).toBe(true)
    })
    it('should not be able to register with same email twice', async () => {
        const usersRepository = new InMemoryUsersRepository()
        const registerUseCase = new RegisterUseCase(usersRepository)

        const email = 'eu.raullopes@email.com'

        await registerUseCase.execute({
            name: 'Raul Lopes',
            email,
            password: '123456',
        })

        await expect(() =>
            registerUseCase.execute({
                name: 'Raul Lopes',
                email,
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(UserAlreadyExistsError)
    })
})