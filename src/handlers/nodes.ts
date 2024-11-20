import { Request, Response } from "express-serve-static-core";
import NodeService from "../service/node-service"
import { CreateNodeDto } from '../dtos/CreateNode.dto';
import { Node } from '@prisma/client';

export async function getNodes(req: Request<{}, any, any, { limit?: string; offset?: string }>, res: Response): Promise<void> {
    try {
        const take = parseInt(req.query.limit ?? '100', 10) || 100; // limit is 100 by default
        const skip = parseInt(req.query.offset ?? '0', 10) || 0; // offset is 0 by default

        const nodes = await NodeService.getAllNodes(take, skip);
        const total_count = await NodeService.getCountNodes()
        res.json({ nodes, total_count });
    } catch (error: any) {
        console.error("Error fetching nodes:", error);
        res.status(500).json({ error: 'Failed to fetch nodes' });
    }
}

export async function getNodeById(request: Request, response: Response) {
    try {
        const nodeId = parseInt(request.params.id, 10);

        if (isNaN(nodeId)) {
            response.status(400).json({ error: 'Invalid node ID. ID must be an integer.' });
        }

        const node = await NodeService.getNodeById(nodeId);
        if (node) {
            response.json(node);
        }
        else {
            response.status(404).json({ error: 'Node not found' });
        }

        

    } catch (error: any) {
        console.error("Error fetching node:", error);
        response.status(500).json({ error: 'Failed to fetch node' });
    }
}

export async function createNode(request: Request<{}, {}, CreateNodeDto>, response: Response) {
    try {
        const newNode = await NodeService.CreateNode(request.body)
        response.status(201).json(newNode)

    } catch (error: any) {
        if (error.message == 'Node with this IP already exists') {
            response.status(409).json({ error: error.message })
        } else {
            console.error(error)
            response.status(500).json({ error: error.message })
        }
    }
}

export async function createNodes(request: Request<{}, {}, CreateNodeDto[]>, response: Response) {
    try {
        const newNodes = await NodeService.CreateNodes(request.body)
        response.status(201).json(newNodes)
    } catch (error: any) {
        console.error(error)
        response.status(500).json({ error: error.message })
    }
}

export async function updateNode(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
        const nodeId = parseInt(req.params.id, 10);
        if (isNaN(nodeId)) {
            res.status(400).json({ error: 'Invalid node ID' });
        }

        const data: Partial<Node> = req.body; // Данные для обновления из тела запроса

        const updatedNode = await NodeService.updateNode(nodeId, data);

        if (!updatedNode) {
            res.status(404).json({ error: 'Node not found' });
        }

        res.json(updatedNode);
    } catch (error: any) {
        console.error("Error updating node:", error);
        res.status(500).json({ error: 'Failed to update node' });
    }
}

export async function deleteNode(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
        const nodeId = parseInt(req.params.id, 10);
        if (isNaN(nodeId)) {
            res.status(400).json({ error: 'Invalid node ID' });
        }

        const deletedNode = await NodeService.deleteNode(nodeId);

        if (!deletedNode) {
            res.status(404).json({ error: 'Node not found' });
        }

        res.json(deletedNode); // Или res.status(204).send(); для ответа без тела
    } catch (error: any) {
        console.error("Error deleting node:", error);
        res.status(500).json({ error: 'Failed to delete node' });
    }
}
