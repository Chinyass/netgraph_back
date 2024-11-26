import { Request, Response } from "express-serve-static-core";
import LocalityService from "../service/locality-service";
import { createLocalityDto } from "../dtos/CreateLocality.dto";
import { Locality } from "@prisma/client";

export async function getLocalities(request: Request, response: Response) {
    try {
        const localities = await LocalityService.getAllLocalities()
        response.json(localities)

    } catch (error) {
        console.error("Error fetching localities:", error);
        response.status(500).json({ error: 'Failed to fetch localities' });
    }
}

export async function getLocalityById(request: Request<{ id: string }>, response: Response) {
    try {
        const localityId = parseInt(request.params.id, 10);

        if (isNaN(localityId)) {
            response.status(400).json({ error: 'Invalid location ID. ID must be an integer.' });
        }
        else {
            const locality = await LocalityService.getLocalityById(localityId)

            if (locality) {
                response.json(locality)
            }
            else {
                response.status(404).json({ error: "locality not found" })
            }
        }
    } catch (error) {
        console.error("Error fetching locality:", error);
        response.status(500).json({ error: 'Failed to fetch locality' });
    }
}

export async function getLocalityByName(request: Request<{ name: string }>, response: Response) {
    try {

        const localityName = request.params.name
        const locality = await LocalityService.getLocalityByName(localityName);

        if (locality) {
            response.json(locality);
        } else {
            response.status(404).json({ error: 'locality not found' });
        }
    } catch (error: any) {
        console.error("Error fetching locality:", error);
        response.status(500).json({ error: 'Failed to fetch locality' });
    }
}

export async function createLocality(request: Request<{}, {}, createLocalityDto>, response: Response): Promise<void> {
    try {

        const new_locality = await LocalityService.createLocality(request.body)
        response.status(201).json(new_locality)

    } catch (error) {
        console.error("Error create locality:", error);
        response.status(500).json({ error: 'Failed to create locality' });
    }
}

export async function updateLocalityById(request: Request<{ id: string }>, response: Response): Promise<void> {
    try {
        const localityId = parseInt(request.params.id, 10);
        if (isNaN(localityId)) {
            response.status(400).json({ error: 'Invalid location ID. ID must be an integer.' });
        } else {

            const data: Partial<Locality> = request.body
            
            if (data){
                const updated_locality = await LocalityService.updateLocality(localityId, data)
                if (updated_locality) {
                    response.json(updated_locality)
                } else {
                    response.status(404).json({ error: 'Location not found' });
                }
            } else {
                response.status(400).json({ error: "No data provided for update" });
            }

        }
    } catch (error) {
        console.error("Error updating locality:", error);
        response.status(500).json({ error: 'Failed to update locality' });
    }
}

export async function deleteLocalityById(request: Request<{ id: string }>, response: Response): Promise<void> {
    try {
        const localityId = parseInt(request.params.id, 10);
        if (isNaN(localityId)) {
            response.status(400).json({ error: 'Invalid location ID' });
        }

        const deletedLocality = await LocalityService.deletelocality(localityId);

        if (!deletedLocality) {
            response.status(404).json({ error: 'Location not found' });
        } else {
            response.json({ message: 'Location deleted successfully' });
        }
    } catch (error: any) {
        console.error("Error deleting location:", error);
        response.status(500).json({ error: 'Failed to delete location' });
    }
}
