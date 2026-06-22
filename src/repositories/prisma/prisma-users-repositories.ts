import { prisma } from "@/lib/prisma";
import { Prisma} from "../../../generated/prisma/client";
import { UsersRepository } from "../users-repository";

// Repository é onde há a conversa com o banco de dados.
export class PrismaUsersRepository implements UsersRepository{
    async findByEmail(email: string) {
        const user = await prisma.user.findUnique({
            where: {
                email,
            }
        });
        return user;
    }
    async create(data: Prisma.UserCreateInput) {
        const user = await prisma.user.create({
            data
        });
        return user;
    }
}