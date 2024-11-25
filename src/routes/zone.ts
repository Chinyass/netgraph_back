import { Router } from 'express';
import {
    getZones,
    getZoneById,
    getZoneByName,
    createZone,
    updateZoneById,
    deleteZoneById,
} from '../handlers/zone';

const router = Router();

router.get('/', getZones);
router.get('/name/:name',getZoneByName)
router.get('/:id', getZoneById);
router.post('/', createZone);
router.put('/:id', updateZoneById);
router.delete('/:id', deleteZoneById);

export default router;