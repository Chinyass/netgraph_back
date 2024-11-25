import { Request, Response } from "express-serve-static-core";
import ZoneService from "../service/zone-service";
import { createZoneDto } from '../dtos/CreateZone.dto';
import { Zone } from '@prisma/client';

export async function getZones(req: Request, res: Response): Promise<void> {
    try {

        const zones = await ZoneService.getAllZones();
        res.json(zones);

    } catch (error: any) {
        console.error("Error fetching zones:", error);
        res.status(500).json({ error: 'Failed to fetch zones' });
    }
}

export async function getZoneById(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
        const zoneId = parseInt(req.params.id, 10);

        if (isNaN(zoneId)) {
            res.status(400).json({ error: 'Invalid zone ID. ID must be an integer.' });
        }

        const zone = await ZoneService.getZoneById(zoneId);

        if (zone) {
            res.json(zone);
        } else {
            res.status(404).json({ error: 'Zone not found' });
        }
    } catch (error: any) {
        console.error("Error fetching zone:", error);
        res.status(500).json({ error: 'Failed to fetch zone' });
    }
}

export async function getZoneByName(req: Request<{ name: string }>, res: Response): Promise<void> {
    try {

        const zoneName = req.params.name
        const zone = await ZoneService.getZoneByName(zoneName);

        if (zone) {
            res.json(zone);
        } else {
            res.status(404).json({ error: 'Zone not found' });
        }
    } catch (error: any) {
        console.error("Error fetching zone:", error);
        res.status(500).json({ error: 'Failed to fetch zone' });
    }
}

export async function createZone(req: Request<{}, {}, createZoneDto>, res: Response): Promise<void> {
    try {
        const newZone = await ZoneService.createZone(req.body);
        res.status(201).json(newZone);
    } catch (error: any) {
        if (error.message === 'Zone with this code or name already exists') {
            res.status(409).json({ error: error.message });
        } else {
            console.error("Error creating zone:", error);
            res.status(500).json({ error: 'Failed to create zone' });
        }
    }
}

export async function updateZoneById(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
        const zoneId = parseInt(req.params.id, 10);
        if (isNaN(zoneId)) {
            res.status(400).json({ error: 'Invalid zone ID' });
        }

        const data: Partial<Zone> = req.body; // Поля для обновления
        if (!data) {
            res.status(400).json({ error: "No data provided for update" });
        }

        const updatedZone = await ZoneService.updateZoneById(zoneId, data);

        if (!updatedZone) {
            res.status(404).json({ error: 'Zone not found' });
        } else {
            res.json(updatedZone);
        }
    } catch (error: any) {
        console.error("Error updating zone:", error);
        res.status(500).json({ error: 'Failed to update zone' });
    }
}

export async function deleteZoneById(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
        const zoneId = parseInt(req.params.id, 10);
        if (isNaN(zoneId)) {
            res.status(400).json({ error: 'Invalid zone ID' });
        }

        const deletedZone = await ZoneService.deleteZoneById(zoneId);

        if (!deletedZone) {
            res.status(404).json({ error: 'Zone not found' });
        } else {
            res.json({ message: 'Zone deleted successfully' });
        }
    } catch (error: any) {
        console.error("Error deleting zone:", error);
        res.status(500).json({ error: 'Failed to delete zone' });
    }
}