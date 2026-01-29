import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import {
  CreateProjectDto,
  UpdateProjectDto,
  ProjectQueryDto,
} from './dto/project.dto';
import { ProjectStatus, Language } from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        slug: dto.slug,
        goalAmount: dto.goalAmount,
        featuredImage: dto.featuredImage,
        gallery: dto.gallery || [],
        isUrgent: dto.isUrgent ?? false,
        isFeatured: dto.isFeatured ?? false,
        startDate: dto.startDate ? new Date(dto.startDate) : null,
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        translations: {
          create: dto.translations,
        },
      },
      include: {
        translations: true,
      },
    });
  }

  async findAll(query: ProjectQueryDto) {
    const { status, isUrgent, isFeatured, lang, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) where.status = status;
    if (isUrgent !== undefined) where.isUrgent = isUrgent;
    if (isFeatured !== undefined) where.isFeatured = isFeatured;

    const [projects, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { isUrgent: 'desc' },
          { isFeatured: 'desc' },
          { createdAt: 'desc' },
        ],
        include: {
          translations: lang ? { where: { language: lang } } : true,
        },
      }),
      this.prisma.project.count({ where }),
    ]);

    return {
      data: projects,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, lang?: Language) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        translations: lang ? { where: { language: lang } } : true,
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

    if (!project) {
      throw new NotFoundException('Projet non trouvé');
    }

    return project;
  }

  async findBySlug(slug: string, lang?: Language) {
    const project = await this.prisma.project.findUnique({
      where: { slug },
      include: {
        translations: lang ? { where: { language: lang } } : true,
      },
    });

    if (!project) {
      throw new NotFoundException('Projet non trouvé');
    }

    return project;
  }

  async update(id: string, dto: UpdateProjectDto) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) {
      throw new NotFoundException('Projet non trouvé');
    }

    // Update translations if provided
    if (dto.translations) {
      // Delete existing translations and create new ones
      await this.prisma.projectTranslation.deleteMany({
        where: { projectId: id },
      });

      await this.prisma.projectTranslation.createMany({
        data: dto.translations.map((t) => ({
          ...t,
          projectId: id,
        })),
      });
    }

    return this.prisma.project.update({
      where: { id },
      data: {
        slug: dto.slug,
        status: dto.status,
        goalAmount: dto.goalAmount,
        featuredImage: dto.featuredImage,
        gallery: dto.gallery,
        isUrgent: dto.isUrgent,
        isFeatured: dto.isFeatured,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
      include: {
        translations: true,
      },
    });
  }

  async remove(id: string) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) {
      throw new NotFoundException('Projet non trouvé');
    }

    await this.prisma.project.delete({ where: { id } });
    return { message: 'Projet supprimé' };
  }

  async getStats() {
    const [total, active, urgent, totalCollected] = await Promise.all([
      this.prisma.project.count(),
      this.prisma.project.count({ where: { status: ProjectStatus.ACTIVE } }),
      this.prisma.project.count({
        where: { isUrgent: true, status: ProjectStatus.ACTIVE },
      }),
      this.prisma.project.aggregate({
        _sum: { collectedAmount: true },
      }),
    ]);

    return {
      total,
      active,
      urgent,
      totalCollected: totalCollected._sum.collectedAmount || 0,
    };
  }
}
