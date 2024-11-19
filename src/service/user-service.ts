import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();


class UserService {
    async registration(email: string, password: string){
        const candidate = await prisma.user.findUnique({
            where: {
                email
            }
        })
    }
}

module.exports = new UserService()