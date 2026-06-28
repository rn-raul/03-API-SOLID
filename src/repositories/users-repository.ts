import { Prisma, User} from "../../generated/prisma/client";



/* Aqui é o contrato do repositório de usuários, 
que define os métodos que devem ser implementados para interagir com o banco de dados. */

export interface UsersRepository {
    findByEmail(email: string): Promise<User | null>
    create(data: Prisma.UserCreateInput): Promise<User>;
}