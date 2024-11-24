import { Router } from 'express';
import {
    getZones,
    getZoneById,
    createZone,
    updateZoneById,
    deleteZoneById,
} from '../handlers/zone';

const router = Router();

router.get('/', getZones);
router.get('/:id', getZoneById);
router.post('/', createZone);
router.put('/:id', updateZoneById);
router.delete('/:id', deleteZoneById);

export default router;