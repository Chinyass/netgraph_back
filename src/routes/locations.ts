import { Router } from 'express';
import {
    getLocations,
    getLocationById,
    createLocation,
    updateLocationById,
    deleteLocationById,
} from '../handlers/locations';

const router = Router();

router.get('/', getLocations);
router.get('/:id', getLocationById);
router.post('/', createLocation);
router.put('/:id', updateLocationById);
router.delete('/:id', deleteLocationById);

export default router;