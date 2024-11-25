import { Request, Response } from "express-serve-static-core";
import NodeService from "../service/node-service"
import { CreateNodeDto } from '../dtos/CreateNode.dto';
import { Node } from '@prisma/client';

export async function getNodes(req: Request<{}, any, any, { [key: string]: string | undefined }>, res: Response): Promise<void> {
  try {
      const take = parseInt(req.query.limit ?? '100', 10) || 100; // limit is 100 by default
      const skip = parseInt(req.query.offset ?? '0', 10) || 0; // offset is 0 by default

      // Получаем фильтры из запроса
      const filters = {
          zone_id: req.query.zone_id,
          location_id: req.query.location_id,
          name: req.query.name,
          address: req.query.address,
          ip: req.query.ip
      };

      const { nodes, total_count } = await NodeService.getAllNodes(take, skip, filters);

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
export async function getNodeByIp(request: Request, response: Response): Promise<void> {
    try {
        const ip = request.params.ip;
        const node = await NodeService.getNodeByIp(ip);
    
        if (!node) {
          response.status(404).json({ error: 'Node not found' });
        }
        else{
          response.json(node);
        }
    
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
        console.log(request.body)
        if (error.message == 'Node with this IP already exists') {
            response.status(409).json({ error: error.message })
        } else {
            console.error(error)
            response.status(500).json({ error: error.message })
        }
    }
}

// Функция для обновления всего узла
export async function updateNodeById(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
        const nodeId = parseInt(req.params.id, 10);
        if (isNaN(nodeId)) {
            res.status(400).json({ error: 'Invalid node ID' });
        }

        const data: Node = req.body; // Обновляем все поля
        if (!data) {
            res.status(400).json({ error: "No data provided for update" });
        }

        const updatedNode = await NodeService.updateNodeById(nodeId, data);

        if (!updatedNode) {
            res.status(404).json({ error: 'Node not found' });
        }

        res.json(updatedNode);

    } catch (error: any) {
        console.error("Error updating node:", error);
        res.status(500).json({ error: 'Failed to update node' });
    }
}

export async function deleteNodeById(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
        const nodeId = parseInt(req.params.id, 10);
        if (isNaN(nodeId)) {
            res.status(400).json({ error: 'Invalid node ID' });
        }

        const deletedNode = await NodeService.deleteNodeById(nodeId);

        if (!deletedNode) {
            res.status(404).json({ error: 'Node not found' });
        }

        res.json(deletedNode); // Или res.status(204).send(); для ответа без тела
    } catch (error: any) {
        console.error("Error deleting node:", error);
        res.status(500).json({ error: 'Failed to delete node' });
    }
}

// Контроллер для добавления роли к узлу
export async function addRoleToNode(req: Request, res: Response): Promise<void> {
    try {
      const nodeId = parseInt(req.params.nodeId, 10);
      const roleId = parseInt(req.params.roleId, 10);
  
      if (isNaN(nodeId) || isNaN(roleId)) {
        res.status(400).json({ error: 'Invalid nodeId or roleId. Both must be integers.' });
      }
  
      const updatedNode = await NodeService.addRoleToNode(nodeId, roleId);
  
      res.json(updatedNode);
    } catch (error: any) {
      console.error("Error in addRoleToNode controller:", error);
      if (error.message.includes('does not exist') || error.message.includes('already assigned')) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to add role to node' });
      }
    }
}

export async function removeRoleFromNode(req: Request, res: Response): Promise<void> {
    try {
      const nodeId = parseInt(req.params.nodeId, 10);
      const roleId = parseInt(req.params.roleId, 10);
  
      if (isNaN(nodeId) || isNaN(roleId)) {
        res.status(400).json({ error: 'Invalid nodeId or roleId. Both must be integers.' });
      }
  
      const updatedNode = await NodeService.removeRoleFromNode(nodeId, roleId);
  
      res.json(updatedNode);
    } catch (error: any) {
      console.error('Error in removeRoleFromNode controller:', error);
      if (error.message.includes('does not exist')) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to remove role from node' });
      }
    }
  }

export async function assignLocationToNode(req: Request, res: Response): Promise<void> {
    try {
      const nodeId = parseInt(req.params.nodeId, 10);
      const locationId = parseInt(req.params.locationId, 10);
  
      if (isNaN(nodeId) || isNaN(locationId)) {
        res.status(400).json({ error: 'Invalid nodeId or locationId. Both must be integers.' });
      }
  
      const updatedNode = await NodeService.assignLocationToNode(nodeId, locationId);
  
      res.json(updatedNode);
    } catch (error: any) {
      console.error('Error in assignLocationToNode controller:', error);
      if (error.message.includes('does not exist')) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to assign location to node' });
      }
    }
}

// Контроллер для удаления локации из узла
export async function removeLocationFromNode(req: Request, res: Response): Promise<void> {
    try {
      const nodeId = parseInt(req.params.nodeId, 10);
  
      if (isNaN(nodeId)) {
        res.status(400).json({ error: 'Invalid nodeId. Must be an integer.' });
      }
  
      const updatedNode = await NodeService.removeLocationFromNode(nodeId);
  
      res.json(updatedNode);
    } catch (error: any) {
      console.error('Error in removeLocationFromNode controller:', error);
      if (error.message.includes('does not exist') || error.message.includes('does not have a location assigned')) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to remove location from node' });
      }
    }
}

// Контроллер для присвоения зоны узлу
export async function assignZoneToNode(req: Request, res: Response): Promise<void> {
    try {
      const nodeId = parseInt(req.params.nodeId, 10);
      const zoneId = parseInt(req.params.zoneId, 10);
  
      if (isNaN(nodeId) || isNaN(zoneId)) {
        res.status(400).json({ error: 'Invalid nodeId or zoneId. Both must be integers.' });
      }
  
      const updatedNode = await NodeService.assignZoneToNode(nodeId, zoneId);
  
      res.json(updatedNode);
    } catch (error: any) {
      console.error('Error in assignZoneToNode controller:', error);
      if (error.message.includes('does not exist')) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to assign zone to node' });
      }
    }
  }
  
// Контроллер для удаления зоны из узла
export async function removeZoneFromNode(req: Request, res: Response): Promise<void> {
try {
    const nodeId = parseInt(req.params.nodeId, 10);

    if (isNaN(nodeId)) {
    res.status(400).json({ error: 'Invalid nodeId. Must be an integer.' });
    }

    const updatedNode = await NodeService.removeZoneFromNode(nodeId);

    res.json(updatedNode);
} catch (error: any) {
    console.error('Error in removeZoneFromNode controller:', error);
    if (error.message.includes('does not exist')) {
    res.status(404).json({ error: error.message });
    } else {
    res.status(500).json({ error: 'Failed to remove zone from node' });
    }
}
}

