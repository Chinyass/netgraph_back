import { Router } from "express"
import { 
    getNodeById,
    getNodeByIp,
    getNodes, 
    createNode, 
    updateNodeById, 
    deleteNodeById, 
    addRoleToNode,
    removeRoleFromNode, 
    assignLocationToNode,
    removeLocationFromNode,
    assignZoneToNode,
    removeZoneFromNode,
} from '../handlers/nodes'

const router = Router()

router.post('/', createNode)
router.get('/', getNodes)
router.get('/ip/:ip', getNodeByIp )
router.get('/:id', getNodeById )
router.put('/:id', updateNodeById)
router.delete('/:id', deleteNodeById)

router.post('/:nodeId/roles/:roleId', addRoleToNode)
router.delete('/:nodeId/roles/:roleId', removeRoleFromNode);
router.post('/:nodeId/locations/:locationId', assignLocationToNode);
router.delete('/:nodeId/locations', removeLocationFromNode);
router.post('/:nodeId/zones/:zoneId', assignZoneToNode);
router.delete('/:nodeId/zones', removeZoneFromNode);

export default router