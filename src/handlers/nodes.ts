import { Request, Response } from "express-serve-static-core";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getNodes(request: Request, response: Response) {
    try {
        const nodes = await prisma.node.findMany();
        response.json(nodes);
    } catch (error) {
        console.error("Error fetching nodes:", error);
        response.status(500).json({ error: 'Database error' });
    }
}

export async function getNodeById(request: Request, response: Response) {
    const id = parseInt(request.params.id, 10); // Добавлено 10 для указания основания системы счисления

    try {
        const node = await prisma.node.findUnique({ where: { id } });
        if (node) {
        response.json(node);
        } else {
        response.status(404).json({ error: 'Node not found' });
        }
    } catch (error) {
        console.error("Error fetching node:", error);
        response.status(500).json({ error: 'Database error' });
    }
}