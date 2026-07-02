import { describe, it, expect, beforeEach } from 'vitest';
import { RegisterUseCase } from './register-use-case';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from './erros/user-already-exits';
import { compare } from 'bcryptjs';

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        sut = new RegisterUseCase(usersRepository);
    })
    it("should be able to register", async () => {
        
        const { user } = await sut.execute({
            name: "Raul Lopes",
            email: "eu.proton@email.com",
            password: "abcde123"
        })
        expect(user.id).toEqual(expect.any(String))
    })
    it("should hash user password upon registration", async () => {
        const { user } = await sut.execute({
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
        const email = 'eu.raullopes@email.com'
        await sut.execute({
            name: 'Raul Lopes',
            email,
            password: '123456',
        })
        await expect(() =>
            sut.execute({
                name: 'Raul Lopes',
                email,
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(UserAlreadyExistsError)
    })
})