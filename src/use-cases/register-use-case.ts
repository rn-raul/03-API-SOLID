import { UsersRepository } from "@/repositories/users-repository";
import { UserAlreadyExistsError } from "./erros/user-already-exits";
import { hash } from "bcryptjs";
import { User } from "../../generated/prisma/client";

// Use case é onde é tomada a decisão de negocio.

interface RegisterUseCaseRequest {
    name: string;
    email: string;
    password: string;
}
interface RegisterUseCaseResponse {
    user: User
}
export class RegisterUseCase {
    constructor(
        private usersRepository: UsersRepository
    ) {}
    async execute({ name, email, password }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
        const userWithSameEmail = await this.usersRepository.findByEmail(email)
        if(userWithSameEmail) {
            throw new UserAlreadyExistsError();
        }
        const password_hash = await hash(password, 4);
        const user = await this.usersRepository.create({
            name,
            email,
            password_hash,
        });
        return {
            user
        };
    }   
}