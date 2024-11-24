import { Router } from 'express';
import {
    getRoles,
    getRoleById,
    createRole,
    updateRoleById,
    deleteRoleById,
} from '../handlers/roles';

const router = Router();

router.get('/', getRoles);
router.get('/:id', getRoleById);
router.post('/', createRole);
router.put('/:id', updateRoleById);
router.delete('/:id', deleteRoleById);

export default router;