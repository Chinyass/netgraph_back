import { Router } from "express"
import { getNodeById, getNodes, createNode, createNodes, updateNode, patchNode, deleteNode, getNodeGroup } from '../handlers/nodes'
const router = Router()

router.post('/create', createNode)
router.post('/create_nodes', createNodes)
router.get('/', getNodes)
router.get('/group', getNodeGroup)
router.get('/:id', getNodeById )
router.put('/:id', updateNode)
router.patch('/:id', patchNode)
router.delete('/:id', deleteNode)

export default router