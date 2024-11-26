import { Prisma, PrismaClient, Zone } from '@prisma/client';
import { createZoneDto } from '../dtos/CreateZone.dto';

const prisma = new PrismaClient();

class ZoneService {

    async getAllZones() {
        try {
            // Получаем список зон
            const zones = await prisma.zone.findMany({
                include: {
                    _count: {
                        select: { nodes: true },
                    },
                },
            });
    
            // Для каждой зоны получаем количество узлов по локациям
            const zonesWithLocationCounts = await Promise.all(
                zones.map(async (zone) => {
                    // Получаем количество узлов по локациям в данной зоне
                    const locationCounts = await prisma.node.groupBy({
                        by: ['locationId'],
                        where: { zoneId: zone.id },
                        _count: {
                            id: true,
                        },
                    });
    
                    // Преобразуем результат в удобный формат
                    const locationCountsObj:any = {};
                    for (const item of locationCounts) {
                        const locationId:any = item.locationId;
                        const count = item._count.id;
    
                        // Получаем информацию о локации (например, название)
                        const location = await prisma.location.findUnique({
                            where: { id: locationId },
                            select: { id: true, name: true },
                        });
    
                        if (location) {
                            locationCountsObj[location.name] = count;
                        } else {
                            locationCountsObj[`Location ${locationId}`] = count;
                        }
                    }
    
                    return {
                        ...zone,
                        locationCounts: locationCountsObj,
                    };
                })
            );
    
            return zonesWithLocationCounts;
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

    async getZoneByName(name: string): Promise<Zone | null> {
        try {
            const zone = await prisma.zone.findUnique({ where: { name } });
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

    async assignLocalityToZone(zoneId: number, localityId: number) {
        try {
          // Проверяем, существует ли Zone
          const zone = await prisma.zone.findUnique({ where: { id: zoneId } });
          if (!zone) {
            throw new Error('Zone not found');
          }
      
          // Проверяем, существует ли Locality
          const locality = await prisma.locality.findUnique({ where: { id: localityId } });
          if (!locality) {
            throw new Error('Locality not found');
          }
      
          // Обновляем запись Zone, назначая localityId
          const updatedZone = await prisma.zone.update({
            where: { id: zoneId },
            data: { localityId },
            include: { locality: true },
          });
      
          return updatedZone;

        } catch (error:any) {
            console.error(`Failed to assign locality to zone: ${error.message}`)
            throw new Error(`Failed to assign locality to zone`);
        }
      }

      async removeLocalityFromZone(zoneId: number) {
        try {
        // Проверяем, существует ли Zone
        const zone = await prisma.zone.findUnique({ where: { id: zoneId } });
        if (!zone) {
            throw new Error('Zone not found');
        }
    
        // Обновляем запись Zone, убирая localityId
        const updatedZone = await prisma.zone.update({
            where: { id: zoneId },
            data: { localityId: null },
        });
    
        return updatedZone;
        } catch (error:any) {
        throw new Error(`Failed to remove locality from zone: ${error.message}`);
        }
    }
}

    

export default new ZoneService();