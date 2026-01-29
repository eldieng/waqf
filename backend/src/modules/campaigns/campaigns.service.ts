import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import {
  CreateCampaignDto,
  UpdateCampaignDto,
  CampaignQueryDto,
} from './dto/campaign.dto';
import { CampaignStatus, Language } from '@prisma/client';

@Injectable()
export class CampaignsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCampaignDto) {
    const campaign = await this.prisma.campaign.create({
      data: {
        slug: dto.slug,
        goalAmount: dto.goalAmount,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        featuredImage: dto.featuredImage,
        isUrgent: dto.isUrgent ?? false,
        translations: {
          create: dto.translations,
        },
      },
      include: {
        translations: true,
      },
    });

    // Link projects if provided
    if (dto.projectIds?.length) {
      await this.prisma.campaignProject.createMany({
        data: dto.projectIds.map((projectId) => ({
          campaignId: campaign.id,
          projectId,
        })),
      });
    }

    return campaign;
  }

  async findAll(query: CampaignQueryDto) {
    const { status, isUrgent, lang, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (isUrgent !== undefined) where.isUrgent = isUrgent;

    const [campaigns, total] = await Promise.all([
      this.prisma.campaign.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ isUrgent: 'desc' }, { startDate: 'desc' }],
        include: {
          translations: lang ? { where: { language: lang } } : true,
          projects: {
            include: {
              project: {
                include: {
                  translations: lang ? { where: { language: lang } } : true,
                },
              },
            },
          },
        },
      }),
      this.prisma.campaign.count({ where }),
    ]);

    return {
      data: campaigns,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, lang?: Language) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id },
      include: {
        translations: lang ? { where: { language: lang } } : true,
        projects: {
          include: {
            project: {
              include: {
                translations: lang ? { where: { language: lang } } : true,
              },
            },
          },
        },
        donations: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            amount: true,
            donorName: true,
            isAnonymous: true,
            createdAt: true,
          },
        },
      },
    });

    if (!campaign) {
      throw new NotFoundException('Campagne non trouvée');
    }

    return campaign;
  }

  async findBySlug(slug: string, lang?: Language) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { slug },
      include: {
        translations: lang ? { where: { language: lang } } : true,
        projects: {
          include: {
            project: true,
          },
        },
      },
    });

    if (!campaign) {
      throw new NotFoundException('Campagne non trouvée');
    }

    return campaign;
  }

  async update(id: string, dto: UpdateCampaignDto) {
    const campaign = await this.prisma.campaign.findUnique({ where: { id } });
    if (!campaign) {
      throw new NotFoundException('Campagne non trouvée');
    }

    if (dto.translations) {
      await this.prisma.campaignTranslation.deleteMany({
        where: { campaignId: id },
      });
      await this.prisma.campaignTranslation.createMany({
        data: dto.translations.map((t) => ({ ...t, campaignId: id })),
      });
    }

    return this.prisma.campaign.update({
      where: { id },
      data: {
        slug: dto.slug,
        status: dto.status,
        goalAmount: dto.goalAmount,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        featuredImage: dto.featuredImage,
        isUrgent: dto.isUrgent,
      },
      include: { translations: true },
    });
  }

  async remove(id: string) {
    const campaign = await this.prisma.campaign.findUnique({ where: { id } });
    if (!campaign) {
      throw new NotFoundException('Campagne non trouvée');
    }

    await this.prisma.campaign.delete({ where: { id } });
    return { message: 'Campagne supprimée' };
  }

  async getActive() {
    return this.prisma.campaign.findMany({
      where: {
        status: CampaignStatus.ACTIVE,
        startDate: { lte: new Date() },
        endDate: { gte: new Date() },
      },
      include: { translations: true },
      orderBy: { isUrgent: 'desc' },
    });
  }
}
