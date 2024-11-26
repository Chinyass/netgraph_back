import { Router } from 'express';
import {
    getZones,
    getZoneById,
    getZoneByName,
    createZone,
    updateZoneById,
    deleteZoneById,
    assignLocality,
    removeLocality
} from '../handlers/zone';

const router = Router();

router.get('/', getZones);
router.get('/name/:name',getZoneByName)
router.get('/:id', getZoneById);
router.post('/', createZone);
router.put('/:id', updateZoneById);
router.delete('/:id', deleteZoneById);

router.post('/:zoneId/locality/:localityId', assignLocality)
router.delete('/:zoneId/locality/', removeLocality);

export default router;