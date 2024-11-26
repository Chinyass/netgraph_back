import { Prisma, PrismaClient, Locality } from '@prisma/client';
import { createLocalityDto } from '../dtos/CreateLocality.dto';

const prisma = new PrismaClient();

class LocalityService {

    async getAllLocalities() {
        try {
          // Шаг 1: Получаем список всех Locality с их зонами
          const localities = await prisma.locality.findMany({
            select: {
              id: true,
              name: true,
              zones: {
                select: {
                  id: true,
                },
              },
            },
          });
      
          const localityDetailsList = await Promise.all(
            localities.map(async (locality) => {
              // Шаг 2: Получаем ID зон в данной Locality
              const zoneIds = locality.zones.map((zone) => zone.id);
      
              if (zoneIds.length === 0) {
                // Если в Locality нет зон, возвращаем нулевые значения
                return {
                  name: locality.name,
                  _count: {
                    nodes: 0,
                  },
                  locationCounts: {},
                };
              }
      
              // Шаг 3: Группируем узлы по Location и считаем количество узлов
              const nodeCountsByLocation = await prisma.node.groupBy({
                by: ['locationId'],
                where: {
                  zoneId: { in: zoneIds },
                },
                _count: {
                  id: true,
                },
              });
      
              // Шаг 4: Подсчитываем общее количество узлов
              const nodeCount = nodeCountsByLocation.reduce(
                (sum, item) => sum + item._count.id,
                0
              );
      
              // Шаг 5: Получаем названия локаций
              const locationIds = nodeCountsByLocation
                .map((item) => item.locationId)
                .filter((id): id is number => id !== null);
      
              const locations = await prisma.location.findMany({
                where: { id: { in: locationIds } },
                select: {
                  id: true,
                  name: true,
                },
              });
      
              const locationNamesMap = new Map<number, string>();
              locations.forEach((loc) => {
                locationNamesMap.set(loc.id, loc.name);
              });
      
              // Шаг 6: Формируем объект locationCounts
              const locationCounts: { [key: string]: number } = {};
      
              nodeCountsByLocation.forEach((item) => {
                const locationName =
                  item.locationId !== null
                    ? locationNamesMap.get(item.locationId) || 'Unknown Location'
                    : 'Unknown Location';
      
                locationCounts[locationName] = item._count.id;
              });
      
              // Шаг 7: Формируем данные для текущей Locality с изменённой структурой _count
              return {
                name: locality.name,
                _count: {
                  nodes: nodeCount,
                },
                locationCounts,
              };
            })
          );
      
          // Шаг 8: Возвращаем список данных по всем Locality
          return localityDetailsList;
        } catch (error) {
          console.error('Error fetching localities:', error);
          throw new Error('Failed to fetch localities');
        }
    }

    async getLocalityById(id: number) {
        try {
            const locality = await prisma.locality.findUnique({
                where: { id }
            })
            
            return locality

        } catch (error) {
            console.log("Error fetching node")
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'){
                throw new Error("Locality not found")
            }
            throw new Error(`Failed to fetch locality`)
        }
    }

    async getLocalityByName(name: string) {
        try {
            const locality = await prisma.locality.findUnique({
                where: { name }
            })
            
            return locality

        } catch (error) {
            console.log("Error fetching node")
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'){
                throw new Error("Locality not found")
            }
            throw new Error(`Failed to fetch locality`)
        }
    }

    async createLocality(locality: createLocalityDto) {
        try {
            const newLocality = await prisma.locality.create({data: locality})
            return newLocality
        } catch (error) {
            console.log("Error create locality", error);
            throw new Error("Failed to create locality");
        }
    }

    async updateLocality(id: number, part_locality: Partial<Locality>) {
        try {
            const updatedLocality = await prisma.locality.update({
                where: {
                    id: id
                },
                data: part_locality
            })
            return updatedLocality

        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    return null;
                }
            }
            console.error("Error updating locality:", error);
            throw new Error("Failed to update locality");
        }
    }

    async deletelocality(id: number) {
        try {

            const deletedLocality = await prisma.locality.delete({
                where: { id }
            })

            return deletedLocality

        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                // Запись не найдена
                return null;
            }
            console.error("Error deleting locality:", error);
            throw new Error("Failed to delete locality");
        }
    }

}


export default new LocalityService()