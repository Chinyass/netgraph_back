import { Prisma, PrismaClient, Location } from '@prisma/client';
import { createLocationDto } from '../dtos/CreateLocation.dto';

const prisma = new PrismaClient();

class LocationService {

    async getAllLocations() {
        try {

          const locations = prisma.location.findMany()

          return locations;
          
        } catch (error) {
            console.log("Error fetching locations", error);
            throw new Error("Failed to fetch locations");
        }
    }

    async getLocationById(id: number) {
        try {
            const location = await prisma.location.findUnique({where: { id }})
            return location

        } catch (error: any) {
            console.log("Error fetching node")
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'){
                throw new Error("Location not found")
            }

            throw new Error(`Failed to fetch location`)
        }
    }

    async createLocation(location: createLocationDto ){
        try {

            const new_location = await prisma.location.create({data: location})

            return new_location

        } catch (error: any) {
            console.error("Error creating nodes:", error);
            throw new Error(`Failed to create location`);
        }
    }
    async updateLocationById(id: number, data: Partial<Location>): Promise<Location | null> {
        try {
            const updatedNode = await prisma.location.update({
                where: { id },
                data,
            });

            return updatedNode;
        } catch (error:any) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    return null;
                }
            }
            console.error("Error updating node:", error);
            throw new Error("Failed to update node");
        }
    }

    async deleteLocationById(id: number): Promise<Location | null> {
        try {
            const deletedLocation = await prisma.location.delete({
                where: { id },
            });
            return deletedLocation;

        } catch (error: any) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                // Запись не найдена
                return null;
            }
            console.error("Error deleting node:", error);
            throw new Error("Failed to delete node");
        }
    }
}

export default new LocationService()