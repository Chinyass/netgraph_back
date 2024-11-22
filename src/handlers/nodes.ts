import { Request, Response } from "express-serve-static-core";
import NodeService from "../service/node-service"
import { CreateNodeDto } from '../dtos/CreateNode.dto';
import { SearchNodeDto } from "../dtos/SearchNode.dto";
import { Node } from '@prisma/client';

export async function getNodes(req: Request<{}, any, SearchNodeDto[] | undefined , { limit?: string; offset?: string }>, res: Response): Promise<void> {
    try {

        const take = parseInt(req.query.limit ?? '100', 10) || 100; // limit is 100 by default
        const skip = parseInt(req.query.offset ?? '0', 10) || 0; // offset is 0 by default

        let search_datas: any = []

        if( Array.isArray(req.body) ){
            search_datas = req.body
        }
        
        const nodes = await NodeService.getAllNodes(take, skip, search_datas );
        const total_count = await NodeService.getCountNodes(search_datas)
        
        res.json({ nodes, total_count });

    } catch (error: any) {
        console.error("Error fetching nodes:", error);
        res.status(500).json({ error: 'Failed to fetch nodes' });
    }
}

export async function getStantions(req: Request, res: Response) {
    try {
        const data = await NodeService.getLocationsCounts()
        console.log(data)
        res.json(data)

    } catch (error: any) {
        console.error("Error fetching stantions:", error);
        res.status(500).json({ error: 'Failed to fetch stantions' });
    }
}
export async function getNodeGroup(req: Request<{}, any, any, { limit?: string; offset?: string; groupBy: string }>, res: Response): Promise<void> {
    try {
        const take = parseInt(req.query.limit ?? '100', 10) || 100; // limit is 100 by default
        const skip = parseInt(req.query.offset ?? '0', 10) || 0; // offset is 0 by default
        const groupBy = req.query.groupBy

        const nodes = await NodeService.getNodeGroup(take, skip, groupBy);
        
        res.json(nodes);

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
export async function getNodeByIp(request: Request, response: Response) {
    try {
        const ip = request.params.ip;
        const node = await NodeService.getNodeByIp(ip);
    
        if (!node) {
          return response.status(404).json({ error: 'Node not found' });
        }
    
        response.json(node);
    
      } catch (error) {
        console.error('Error fetching node by IP', error);
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

// Функция для обновления всего узла
export async function updateNode(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
        const nodeId = parseInt(req.params.id, 10);
        if (isNaN(nodeId)) {
            res.status(400).json({ error: 'Invalid node ID' });
        }

        const data: Node = req.body; // Обновляем все поля
        if (!data) {
            res.status(400).json({ error: "No data provided for update" });
        }

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

// Функция для частичного обновления узла (PATCH)
export async function patchNode(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
        const nodeId = parseInt(req.params.id, 10);
        if (isNaN(nodeId)) {
            res.status(400).json({ error: 'Invalid node ID' });
        }

        const data: Partial<Node> = req.body; // Обновляем частично
        if (!data) {
            res.status(400).json({ error: "No data provided for update" });
        }

        const hasUpdate = Object.keys(data).some(key => key !== 'id');
        if (!hasUpdate) {
            res.status(400).json({ error: 'No fields to update' });
        }


        const updatedNode = await NodeService.patchNode(nodeId, data);

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
