import { Request, Response } from "express-serve-static-core";
import LocationService from "../service/location-service";
import { createLocationDto } from '../dtos/CreateLocation.dto';
import { Location } from '@prisma/client';

export async function getLocations(req: Request, res: Response): Promise<void> {
    try {

        const locations= await LocationService.getAllLocations();

        res.json(locations);
        
    } catch (error: any) {
        console.error("Error fetching locations:", error);
        res.status(500).json({ error: 'Failed to fetch locations' });
    }
}

export async function getLocationById(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
        const locationId = parseInt(req.params.id, 10);

        if (isNaN(locationId)) {
            res.status(400).json({ error: 'Invalid location ID. ID must be an integer.' });
        }

        const location = await LocationService.getLocationById(locationId);

        if (location) {
            res.json(location);
        } else {
            res.status(404).json({ error: 'Location not found' });
        }
    } catch (error: any) {
        console.error("Error fetching location:", error);
        res.status(500).json({ error: 'Failed to fetch location' });
    }
}

export async function createLocation(req: Request<{}, {}, createLocationDto>, res: Response): Promise<void> {
    try {
        const newLocation = await LocationService.createLocation(req.body);
        res.status(201).json(newLocation);
    } catch (error: any) {
        if (error.message === 'Location with this name already exists') {
            res.status(409).json({ error: error.message });
        } else {
            console.error("Error creating location:", error);
            res.status(500).json({ error: 'Failed to create location' });
        }
    }
}

export async function updateLocationById(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
        const locationId = parseInt(req.params.id, 10);
        if (isNaN(locationId)) {
            res.status(400).json({ error: 'Invalid location ID' });
        }

        const data: Partial<Location> = req.body; // Поля для обновления
        if (!data) {
            res.status(400).json({ error: "No data provided for update" });
        }

        const updatedLocation = await LocationService.updateLocationById(locationId, data);

        if (!updatedLocation) {
            res.status(404).json({ error: 'Location not found' });
        } else {
            res.json(updatedLocation);
        }
    } catch (error: any) {
        console.error("Error updating location:", error);
        res.status(500).json({ error: 'Failed to update location' });
    }
}

export async function deleteLocationById(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
        const locationId = parseInt(req.params.id, 10);
        if (isNaN(locationId)) {
            res.status(400).json({ error: 'Invalid location ID' });
        }

        const deletedLocation = await LocationService.deleteLocationById(locationId);

        if (!deletedLocation) {
            res.status(404).json({ error: 'Location not found' });
        } else {
            res.json({ message: 'Location deleted successfully' });
        }
    } catch (error: any) {
        console.error("Error deleting location:", error);
        res.status(500).json({ error: 'Failed to delete location' });
    }
}