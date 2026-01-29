import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import {
  CreateOrderDto,
  UpdateOrderStatusDto,
  OrderQueryDto,
} from './dto/order.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOrderDto, userId?: string) {
    const products = await this.prisma.product.findMany({
      where: { id: { in: dto.items.map((i) => i.productId) } },
    });

    if (products.length !== dto.items.length) {
      throw new NotFoundException('Un ou plusieurs produits non trouvés');
    }

    let subtotal = 0;
    const orderItems = dto.items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      const price = Number(product!.price);
      subtotal += price * item.quantity;
      return {
        productId: item.productId,
        quantity: item.quantity,
        price,
      };
    });

    const shippingCost = 0;
    const total = subtotal + shippingCost;

    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    return this.prisma.order.create({
      data: {
        orderNumber,
        customerName: dto.customerName,
        customerEmail: dto.customerEmail,
        customerPhone: dto.customerPhone,
        shippingAddress: dto.shippingAddress,
        subtotal,
        shippingCost,
        total,
        userId,
        items: { create: orderItems },
      },
      include: {
        items: {
          include: {
            product: { include: { translations: true } },
          },
        },
      },
    });
  }

  async findAll(query: OrderQueryDto) {
    const { status, page = 1, limit = 20 } = query;
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 20;
    const skip = (pageNumber - 1) * limitNumber;

    const where: Prisma.OrderWhereInput = {};
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limitNumber,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              product: { include: { translations: true } },
            },
          },
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders,
      meta: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    };
  }

  async findById(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: { include: { translations: true } },
          },
        },
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
    });

    if (!order) throw new NotFoundException('Commande non trouvée');
    return order;
  }

  async findByOrderNumber(orderNumber: string) {
    const order = await this.prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: {
          include: {
            product: { include: { translations: true } },
          },
        },
      },
    });

    if (!order) throw new NotFoundException('Commande non trouvée');
    return order;
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Commande non trouvée');

    const updateData: Prisma.OrderUpdateInput = { status: dto.status };

    if (dto.status === 'CONFIRMED' && !order.paidAt) {
      updateData.paidAt = new Date();
    }
    if (dto.status === 'SHIPPED' && !order.shippedAt) {
      updateData.shippedAt = new Date();
    }
    if (dto.status === 'DELIVERED' && !order.deliveredAt) {
      updateData.deliveredAt = new Date();
    }
    if (dto.status === 'CANCELLED' && !order.cancelledAt) {
      updateData.cancelledAt = new Date();
    }

    return this.prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        items: {
          include: {
            product: { include: { translations: true } },
          },
        },
      },
    });
  }

  async getMyOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: { include: { translations: true } },
          },
        },
      },
    });
  }

  async getStats() {
    const [total, pending, processing, delivered, cancelled, revenue] =
      await Promise.all([
        this.prisma.order.count(),
        this.prisma.order.count({ where: { status: 'PENDING' } }),
        this.prisma.order.count({
          where: { status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED'] } },
        }),
        this.prisma.order.count({ where: { status: 'DELIVERED' } }),
        this.prisma.order.count({
          where: { status: { in: ['CANCELLED', 'REFUNDED'] } },
        }),
        this.prisma.order.aggregate({
          where: { status: 'DELIVERED' },
          _sum: { total: true },
        }),
      ]);

    return {
      total,
      pending,
      processing,
      delivered,
      cancelled,
      revenue: revenue._sum.total || 0,
    };
  }
}
