import { Prisma, PrismaClient, Node } from '@prisma/client';
import { CreateNodeDto } from '../dtos/CreateNode.dto';

const prisma = new PrismaClient();

class NodeService {
    
      async getAllNodes(take: number = 100, skip: number = 0, filters: any = {}) {
        try {
            // Формируем объект условий для фильтрации
            const whereCondition: any = {};

            if (filters.zone_id) {
                whereCondition.zoneId = Number(filters.zone_id);
            }

            if (filters.location_id) {
                whereCondition.locationId = Number(filters.location_id);
            }

            // Добавьте дополнительные условия фильтрации по другим полям при необходимости
            // Например, фильтрация по имени узла
            if (filters.name) {
                // Используем contains для поиска по подстроке (независимо от регистра)
                whereCondition.name = { contains: filters.name };
            }

            if (filters.ip) {
                whereCondition.ip = {
                  contains: filters.ip 
                }
            }
            if (filters.address) {
              whereCondition.address = {
                contains: filters.address
              }
            }

            // Выполняем параллельные запросы для получения узлов и общего количества
            const [nodes, total_count] = await Promise.all([
                prisma.node.findMany({
                    where: whereCondition,
                    take,
                    skip,
                    include: {
                        zone: true,
                        location: true,
                        roles: true,
                    }
                }),
                prisma.node.count({
                    where: whereCondition,
                }),
            ]);

            return { nodes, total_count };

        } catch (error) {
            console.log("Error fetching nodes", error);
            throw new Error("Failed to fetch nodes");
        }
    }
    
    async getNodeById(id: number) {
        try {
            const node = await prisma.node.findUnique({
                where: { id },
                include: {
                    zone: true,
                    location: true,
                    roles: true,
                }
            })
            return node

        } catch (error: any) {
            console.log("Error fetching node")
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
                include: {
                    zone: true,
                    location: true,
                    roles: true,
                },
            });
            return node;
        } catch (error) {
            console.error("Error fetching node by IP:", error);
            return null; 
        }
    }

    async CreateNode(data: CreateNodeDto) {
        try {

            const { roleIds, locationId, zoneId, ...nodeData } = data;

            const newNode = await prisma.node.create({
                data: {
                  ...nodeData,
                  zone: data.zoneId ? { connect: { id: data.zoneId } } : undefined,
                  location: data.locationId ? { connect: { id: data.locationId } } : undefined,
                  roles: roleIds ? { connect: roleIds.map(id => ({ id })) } : undefined,
                },
                include: {
                  zone: true,
                  location: true,
                  roles: true,
                },
              });

            return newNode

        } catch (error: any) {
            console.log("Error creating node: ", error)
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'){
                throw new Error("Node with this IP already exists")
            }
            throw new Error(`Failed to create node`)
        }
    }

    async updateNodeById(id: number, data: Partial<Node>): Promise<Node | null> {
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

    async deleteNodeById(id: number): Promise<Node | null> {
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

    // Функция для добавления роли к узлу
  async addRoleToNode(nodeId: number, roleId: number) {
    try {
      // Проверяем, существует ли узел
      const nodeExists = await prisma.node.findUnique({
        where: { id: nodeId },
        select: { id: true },
      });
      if (!nodeExists) {
        throw new Error(`Node with id ${nodeId} does not exist.`);
      }

      // Проверяем, существует ли роль
      const roleExists = await prisma.role.findUnique({
        where: { id: roleId },
        select: { id: true },
      });
      if (!roleExists) {
        throw new Error(`Role with id ${roleId} does not exist.`);
      }

      // Проверяем, уже ли роль привязана к узлу
      const nodeWithRoles = await prisma.node.findUnique({
        where: { id: nodeId },
        select: {
          roles: {
            where: { id: roleId },
            select: { id: true },
          },
        },
      });
      if (nodeWithRoles?.roles.length) {
        throw new Error(`Role with id ${roleId} is already assigned to node ${nodeId}.`);
      }

      // Добавляем роль к узлу
      const updatedNode = await prisma.node.update({
        where: { id: nodeId },
        data: {
          roles: {
            connect: { id: roleId },
          },
        },
        include: {
          roles: true, // Включаем роли в ответе для проверки результата
        },
      });

      return updatedNode;
    } catch (error: any) {
      console.error("Error adding role to node:", error);
      throw new Error(error.message || "Failed to add role to node");
    }
  }

  // Функция для отвязки роли от узла
  async removeRoleFromNode(nodeId: number, roleId: number) {
    try {
      // Проверяем, существует ли узел
      const nodeExists = await prisma.node.findUnique({
        where: { id: nodeId },
        select: { id: true },
      });
      if (!nodeExists) {
        throw new Error(`Node with id ${nodeId} does not exist.`);
      }

      // Проверяем, существует ли роль
      const roleExists = await prisma.role.findUnique({
        where: { id: roleId },
        select: { id: true },
      });
      if (!roleExists) {
        throw new Error(`Role with id ${roleId} does not exist.`);
      }

      // Отвязываем роль от узла
      const updatedNode = await prisma.node.update({
        where: { id: nodeId },
        data: {
          roles: {
            disconnect: { id: roleId },
          },
        },
        include: {
          roles: true,
        },
      });

      return updatedNode;
    } catch (error: any) {
      console.error('Error removing role from node:', error);
      throw new Error(error.message || 'Failed to remove role from node');
    }
  }

  async assignLocationToNode(nodeId: number, locationId: number) {
    try {
      // Проверяем, существует ли узел
      const nodeExists = await prisma.node.findUnique({
        where: { id: nodeId },
        select: { id: true },
      });
      if (!nodeExists) {
        throw new Error(`Node with id ${nodeId} does not exist.`);
      }
  
      // Проверяем, существует ли локация
      const locationExists = await prisma.location.findUnique({
        where: { id: locationId },
        select: { id: true },
      });
      if (!locationExists) {
        throw new Error(`Location with id ${locationId} does not exist.`);
      }
  
      // Присваиваем локацию узлу с помощью connect
      const updatedNode = await prisma.node.update({
        where: { id: nodeId },
        data: {
          location: {
            connect: { id: locationId },
          },
        },
        include: {
          location: true, // Включаем локацию в ответе
        },
      });
  
      return updatedNode;
    } catch (error: any) {
      console.error('Error assigning location to node:', error);
      throw new Error(error.message || 'Failed to assign location to node');
    }
  }

  // Функция для отвязки локации от узла
  async removeLocationFromNode(nodeId: number) {
    try {
      // Проверяем, существует ли узел
      const nodeExists = await prisma.node.findUnique({
        where: { id: nodeId },
        select: { id: true, locationId: true },
      });
      if (!nodeExists) {
        throw new Error(`Node with id ${nodeId} does not exist.`);
      }

      if (nodeExists.locationId === null) {
        throw new Error(`Node with id ${nodeId} does not have a location assigned.`);
      }

      // Отвязываем локацию от узла
      const updatedNode = await prisma.node.update({
        where: { id: nodeId },
        data: {
          location: {
            disconnect: true,
          },
        },
        include: {
          location: true,
        },
      });

      return updatedNode;
    } catch (error: any) {
      console.error('Error removing location from node:', error);
      throw new Error(error.message || 'Failed to remove location from node');
    }
  }

  async assignZoneToNode(nodeId: number, zoneId: number) {
    try {
      // Проверяем, существует ли узел
      const nodeExists = await prisma.node.findUnique({
        where: { id: nodeId },
        select: { id: true },
      });
      if (!nodeExists) {
        throw new Error(`Node with id ${nodeId} does not exist.`);
      }

      // Проверяем, существует ли зона
      const zoneExists = await prisma.zone.findUnique({
        where: { id: zoneId },
        select: { id: true },
      });
      if (!zoneExists) {
        throw new Error(`Zone with id ${zoneId} does not exist.`);
      }

      // Присваиваем зону узлу используя connect
      const updatedNode = await prisma.node.update({
        where: { id: nodeId },
        data: {
          zone: {
            connect: { id: zoneId },
          },
        },
        include: {
          zone: true, // Включаем зону в ответе
        },
      });

      return updatedNode;
    } catch (error: any) {
      console.error('Error assigning zone to node:', error);
      throw new Error(error.message || 'Failed to assign zone to node');
    }
  }

  // Функция для удаления зоны из узла
  async removeZoneFromNode(nodeId: number) {
    try {
      // Проверяем, существует ли узел
      const nodeExists = await prisma.node.findUnique({
        where: { id: nodeId },
        select: { id: true },
      });
      if (!nodeExists) {
        throw new Error(`Node with id ${nodeId} does not exist.`);
      }

      // Убираем связь с зоной
      const updatedNode = await prisma.node.update({
        where: { id: nodeId },
        data: {
          zone: {
            disconnect: true,
          },
        },
        include: {
          zone: true, // Включаем зону в ответе (будет null)
        },
      });

      return updatedNode;
    } catch (error: any) {
      console.error('Error removing zone from node:', error);
      throw new Error(error.message || 'Failed to remove zone from node');
    }
  }

}

export default new NodeService()