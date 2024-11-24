import { Prisma, PrismaClient, Role } from '@prisma/client';
import { createRoleDto } from '../dtos/CreateRole.dto';

const prisma = new PrismaClient();

class RoleService {

    async getAllRoles() {
        try {

          const roles = prisma.role.findMany()

          return roles;
          
        } catch (error) {
            console.log("Error fetching roles", error);
            throw new Error("Failed to fetch roles");
        }
    }

    async getRoleById(id: number) {
        try {
            const role = await prisma.role.findUnique({where: { id }})
            return role

        } catch (error: any) {
            console.log("Error fetching role")
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'){
                throw new Error("role not found")
            }

            throw new Error(`Failed to fetch role`)
        }
    }

    async createRole(role: createRoleDto ){
        try {

            const new_role = await prisma.role.create({data: role})

            return new_role

        } catch (error: any) {
            console.error("Error creating role:", error);
            throw new Error(`Failed to create role`);
        }
    }
    async updateRoleById(id: number, data: Partial<Role>): Promise<Role | null> {
        try {
            const updatedRole = await prisma.role.update({
                where: { id },
                data,
            });

            return updatedRole;
        } catch (error:any) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    return null;
                }
            }
            console.error("Error updating role:", error);
            throw new Error("Failed to update role");
        }
    }

    async deleteRoleById(id: number): Promise<Role | null> {
        try {
            const deletedRole = await prisma.role.delete({
                where: { id },
            });
            return deletedRole;

        } catch (error: any) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                // Запись не найдена
                return null;
            }
            console.error("Error deleting role:", error);
            throw new Error("Failed to delete role");
        }
    }
}

export default new RoleService()