import { Prisma, PrismaClient, Node } from '@prisma/client';
import { CreateNodeDto } from '../dtos/CreateNode.dto';
import { SearchNodeDto } from '../dtos/SearchNode.dto';

const prisma = new PrismaClient();

class NodeService {
    async getAllNodes(take: number = 100, skip: number = 0, search_datas: SearchNodeDto[] | undefined) {

        try {
            const whereClause: any= {};
            if (search_datas){
                search_datas.map( data => {
                    if (data.strict) {
                        whereClause[data.search_field] = { equals : data.query }
                    }
                    else {
                        whereClause[data.search_field] = { contains : data.query }
                    }
                })
            }

            const nodes = await prisma.node.findMany({
                where: whereClause,
                take,
                skip,
            })

            return nodes

        } catch (error) {
            console.log("Error fetching nodes", error)
            throw new Error("Failed to fetch nodes")
        }
    }
    async getLocationsCounts(){
        try {
            console.log("ENTER")
            const results = await prisma.$queryRaw<
                Array<{
                    location: string | null;
                    total_count: number;
                    station_count: number;
                    access_node_count: number;
                }>
            >`
                SELECT
                location,
                COUNT(*) AS total_count,
                SUM(CASE WHEN role = 'Станция' THEN 1 ELSE 0 END) AS station_count,
                SUM(CASE WHEN role = 'Узел доступа' THEN 1 ELSE 0 END) AS access_node_count
                FROM
                Node
                GROUP BY
                location
            `;

            console.log('RESULT',results)

            return results

        } catch (error) {
            console.log(error)
        }
    }
    async getCountNodes( search_datas: SearchNodeDto[] | undefined ) {
        try {
            const whereClause: any= {};
            if (search_datas){
                search_datas.map( data => {
                    if (data.strict) {
                        whereClause[data.search_field] = { equals : data.query }
                    }
                    else {
                        whereClause[data.search_field] = { contains : data.query }
                    }
                })
            }

            return await prisma.node.count({ where: whereClause });

        } catch (error) {
            console.log("Error fetching nodes")
            throw new Error("Failed to fetch nodes")
        }
    }

    async getNodeGroup(take: number = 100, skip: number = 0, groupBy: string){

        let whereClause: Prisma.NodeWhereInput = {};
        const groupedNodes = await prisma.node.groupBy({
            by: ['location'],
            _count: true,
            where: whereClause,
            orderBy: {
                _count: {
                    id: 'desc',
                },
            },
            take,
            skip
        })

        return groupedNodes
        
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

    async getNodeByIp(ip: string): Promise<Node | null> {
        try {
            const node = await prisma.node.findUnique({
                where: { ip },
            });
            return node;
        } catch (error) {
            console.error("Error fetching node by IP:", error);
            return null; 
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

    async updateNode(id: number, data: Node): Promise<Node | null> {
        try {
            const updatedNode = await prisma.node.update({
                where: { id },
                data,
            });
            return updatedNode;
        } catch (error: any) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    return null;
                } else if (error.code === 'P2002') { // Проверка на уникальность
                    console.error("Unique key violation");
                    throw new Error("Unique key violation");
                }
            }
            console.error("Error updating node:", error);
            throw new Error("Failed to update node");
        }
    }

    async patchNode(id: number, data: Partial<Node>): Promise<Node | null> {
        try {
            const updatedNode = await prisma.node.update({
                where: { id },
                data,
            });
            return updatedNode;
        } catch (error: any) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    return null;
                }
            }
            console.error("Error updating node:", error);
            throw new Error("Failed to update node");
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
            throw new Error("Failed to delete node");
        }
    }

}
export default new NodeService()