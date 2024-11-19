import { Router } from "express"
import { getNodeById, getNodes, createNode, createNodes, updateNode, deleteNode } from '../handlers/nodes'
const router = Router()

router.post('/create', createNode)
router.post('/create_nodes', createNodes)
router.get('/', getNodes)
router.get('/:id', getNodeById )
router.put('/:id', updateNode)
router.delete('/:id', deleteNode)

export default router