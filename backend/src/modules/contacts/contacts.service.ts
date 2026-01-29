import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import {
  CreateContactDto,
  ContactQueryDto,
  SubscribeNewsletterDto,
} from './dto/contact.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateContactDto) {
    const contact = await this.prisma.contact.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        subject: dto.subject,
        message: dto.message,
      },
    });

    // TODO: Send notification email to admin

    return contact;
  }

  async findAll(query: ContactQueryDto) {
    const { isRead, page = 1, limit = 10 } = query;
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const where: Prisma.ContactWhereInput = {};
    if (isRead !== undefined) {
      where.isRead = isRead;
    }

    const [contacts, total] = await Promise.all([
      this.prisma.contact.findMany({
        where,
        skip,
        take: limitNumber,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.contact.count({ where }),
    ]);

    return {
      data: contacts,
      meta: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    };
  }

  async findOne(id: string) {
    const contact = await this.prisma.contact.findUnique({
      where: { id },
    });

    if (!contact) {
      throw new NotFoundException('Message non trouvé');
    }

    return contact;
  }

  async markAsRead(id: string) {
    const contact = await this.prisma.contact.findUnique({
      where: { id },
    });

    if (!contact) {
      throw new NotFoundException('Message non trouvé');
    }

    return this.prisma.contact.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async reply(id: string, replyMessage: string) {
    const contact = await this.prisma.contact.findUnique({
      where: { id },
    });

    if (!contact) {
      throw new NotFoundException('Message non trouvé');
    }

    // TODO: Send reply email to contact.email
    console.log(`Reply to ${contact.email}: ${replyMessage}`);

    return this.prisma.contact.update({
      where: { id },
      data: { repliedAt: new Date(), isRead: true },
    });
  }

  async delete(id: string) {
    const contact = await this.prisma.contact.findUnique({
      where: { id },
    });

    if (!contact) {
      throw new NotFoundException('Message non trouvé');
    }

    await this.prisma.contact.delete({ where: { id } });

    return { message: 'Message supprimé' };
  }

  async getStats() {
    const [total, unread, repliedCount] = await Promise.all([
      this.prisma.contact.count(),
      this.prisma.contact.count({ where: { isRead: false } }),
      this.prisma.contact.count({ where: { repliedAt: { not: null } } }),
    ]);

    return { total, unread, replied: repliedCount };
  }

  // Newsletter
  async subscribeNewsletter(dto: SubscribeNewsletterDto) {
    const existing = await this.prisma.newsletter.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      if (existing.isSubscribed) {
        return { message: 'Vous êtes déjà inscrit à la newsletter' };
      }
      await this.prisma.newsletter.update({
        where: { email: dto.email },
        data: { isSubscribed: true },
      });
      return { message: 'Réinscription réussie' };
    }

    await this.prisma.newsletter.create({
      data: { email: dto.email },
    });

    return { message: 'Inscription à la newsletter réussie' };
  }

  async unsubscribeNewsletter(email: string) {
    const existing = await this.prisma.newsletter.findUnique({
      where: { email },
    });

    if (!existing) {
      throw new NotFoundException('Email non trouvé');
    }

    await this.prisma.newsletter.update({
      where: { email },
      data: { isSubscribed: false },
    });

    return { message: 'Désinscription réussie' };
  }

  async getNewsletterSubscribers() {
    return this.prisma.newsletter.findMany({
      where: { isSubscribed: true },
      orderBy: { subscribedAt: 'desc' },
    });
  }
}
