import { Prisma, PrismaClient, Node } from '@prisma/client';
import { CreateNodeDto } from '../dtos/CreateNode.dto';

const prisma = new PrismaClient();

class NodeService {
    async getAllNodes(take: number = 100, skip: number = 0) {
        try {

            const nodes = await prisma.node.findMany({
                take,
                skip,
            })
            return nodes

        } catch (error) {
            console.log("Error fetching nodes")
            throw new Error("Failed to fetch nodes")
        }
    }
    async getCountNodes() {
        try {
            const count = await prisma.node.count()
            return count
        } catch (error) {
            console.log("Error fetching nodes")
            throw new Error("Failed to fetch nodes")
        }
    }
    async getNodeById(id: number) {
        try {
            const node = await prisma.node.findUnique({where: { id }})
            return node

        } catch (error: any) {
            console.log("Error fetching node")
            const errorMessage = error.message || String(error)
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'){
                throw new Error("Node not found")
            }

            throw new Error(`Failed to fetch node`)
        }
    }

    async CreateNode(nodeData: CreateNodeDto) {
        try {
            const newNode = await prisma.node.create({ data: nodeData })
            return newNode

        } catch (error: any) {
            console.log("Error creating node: ", error)
            const errorMessage = error.message || String(error)
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'){
                throw new Error("Node with this IP already exists")
            }
            throw new Error(`Failed to create node`)

        }
    }
    async CreateNodes(nodeData: CreateNodeDto[]){
        try {
            const newNodes = await prisma.$transaction(nodeData.map(data => prisma.node.create({ data: data })));
            return newNodes
        
        } catch (error: any) {
            console.error("Error creating nodes:", error);
            const errorMessage = error.message || String(error);
            throw new Error(`Failed to create nodes `);
        }
    }

    async updateNode(id: number, data: Partial<Node>): Promise<Node | null> {
        try {
            const updatedNode = await prisma.node.update({
                where: { id },
                data,
            });
            return updatedNode;
        } catch (error: any) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                // Запись не найдена
                return null;
            }
            console.error("Error updating node:", error);
            throw new Error("Failed to update node"); // Переброс ошибки для обработки в контроллере
        }
    }
    
    async deleteNode(id: number): Promise<Node | null> {
        try {
            const deletedNode = await prisma.node.delete({
                where: { id },
            });
            return deletedNode;
        } catch (error: any) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                // Запись не найдена
                return null;
            }
            console.error("Error deleting node:", error);
            throw new Error("Failed to delete node"); // Переброс ошибки для обработки в контроллере
        }
    }

}
export default new NodeService()