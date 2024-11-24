import { Prisma, PrismaClient, Zone } from '@prisma/client';
import { createZoneDto } from '../dtos/CreateZone.dto';

const prisma = new PrismaClient();

class ZoneService {

    async getAllZones() {
        try {
            const zones = await prisma.zone.findMany();
            return zones;
        } catch (error) {
            console.error("Error fetching zones:", error);
            throw new Error("Failed to fetch zones");
        }
    }

    async getZoneById(id: number): Promise<Zone | null> {
        try {
            const zone = await prisma.zone.findUnique({ where: { id } });
            return zone;
        } catch (error: any) {
            console.error("Error fetching zone:", error);
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new Error("Zone not found");
            }
            throw new Error("Failed to fetch zone");
        }
    }

    async createZone(zone: createZoneDto): Promise<Zone> {
        try {
            const newZone = await prisma.zone.create({ data: zone });
            return newZone;
        } catch (error: any) {
            console.error("Error creating zone:", error);
            throw new Error("Failed to create zone");
        }
    }

    async updateZoneById(id: number, data: Partial<Zone>): Promise<Zone | null> {
        try {
            const updatedZone = await prisma.zone.update({
                where: { id },
                data,
            });
            return updatedZone;
        } catch (error: any) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    // Запись не найдена
                    return null;
                }
            }
            console.error("Error updating zone:", error);
            throw new Error("Failed to update zone");
        }
    }

    async deleteZoneById(id: number): Promise<Zone | null> {
        try {
            const deletedZone = await prisma.zone.delete({
                where: { id },
            });
            return deletedZone;
        } catch (error: any) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                // Запись не найдена
                return null;
            }
            console.error("Error deleting zone:", error);
            throw new Error("Failed to delete zone");
        }
    }
}

export default new ZoneService();