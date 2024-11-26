import { Router } from 'express';
import {
    getLocalities,
    getLocalityById,
    createLocality,
    updateLocalityById,
    deleteLocalityById,
    getLocalityByName
} from '../handlers/locality';

const router = Router();

router.get('/', getLocalities);
router.get('/name/:name', getLocalityByName)
router.get('/:id', getLocalityById);
router.post('/', createLocality);
router.put('/:id', updateLocalityById);
router.delete('/:id', deleteLocalityById);

export default router;