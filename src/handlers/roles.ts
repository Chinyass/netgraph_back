import { Request, Response } from "express-serve-static-core";
import RoleService from "../service/role-service";
import { createRoleDto } from '../dtos/CreateRole.dto';
import { Role } from '@prisma/client';

export async function getRoles(req: Request, res: Response): Promise<void> {
    try {
        
        const roles = await RoleService.getAllRoles();
        res.json(roles);

    } catch (error: any) {
        console.error("Error fetching roles:", error);
        res.status(500).json({ error: 'Failed to fetch roles' });
    }
}

export async function getRoleById(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
        const roleId = parseInt(req.params.id, 10);

        if (isNaN(roleId)) {
            res.status(400).json({ error: 'Invalid role ID. ID must be an integer.' });
        }

        const role = await RoleService.getRoleById(roleId);

        if (role) {
            res.json(role);
        } else {
            res.status(404).json({ error: 'Role not found' });
        }
    } catch (error: any) {
        console.error("Error fetching role:", error);
        res.status(500).json({ error: 'Failed to fetch role' });
    }
}

export async function createRole(req: Request<{}, {}, createRoleDto>, res: Response): Promise<void> {
    try {
        const newRole = await RoleService.createRole(req.body);
        res.status(201).json(newRole);
    } catch (error: any) {
        if (error.message === 'Role with this name already exists') {
            res.status(409).json({ error: error.message });
        } else {
            console.error("Error creating role:", error);
            res.status(500).json({ error: 'Failed to create role' });
        }
    }
}

export async function updateRoleById(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
        const roleId = parseInt(req.params.id, 10);
        if (isNaN(roleId)) {
            res.status(400).json({ error: 'Invalid role ID' });
        }

        const data: Partial<Role> = req.body; // Поля для обновления
        if (!data) {
            res.status(400).json({ error: "No data provided for update" });
        }

        const updatedRole = await RoleService.updateRoleById(roleId, data);

        if (!updatedRole) {
            res.status(404).json({ error: 'Role not found' });
        } else {
            res.json(updatedRole);
        }
    } catch (error: any) {
        console.error("Error updating role:", error);
        res.status(500).json({ error: 'Failed to update role' });
    }
}

export async function deleteRoleById(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
        const roleId = parseInt(req.params.id, 10);
        if (isNaN(roleId)) {
            res.status(400).json({ error: 'Invalid role ID' });
        }

        const deletedRole = await RoleService.deleteRoleById(roleId);

        if (!deletedRole) {
            res.status(404).json({ error: 'Role not found' });
        } else {
            res.json({ message: 'Role deleted successfully' });
        }
    } catch (error: any) {
        console.error("Error deleting role:", error);
        res.status(500).json({ error: 'Failed to delete role' });
    }
}