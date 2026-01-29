import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma';
import {
  CreateContentDto,
  UpdateContentDto,
  ContentQueryDto,
} from './dto/content.dto';
import { ContentType, Language, Prisma } from '@prisma/client';

@Injectable()
export class ContentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateContentDto) {
    const existing = await this.prisma.content.findUnique({
      where: { slug: dto.slug },
    });
    if (existing) throw new ConflictException('Ce slug existe déjà');

    return this.prisma.content.create({
      data: {
        slug: dto.slug,
        type: dto.type,
        featuredImage: dto.featuredImage,
        isPublished: dto.isPublished ?? false,
        publishedAt: dto.isPublished ? new Date() : null,
        translations: { create: dto.translations },
      },
      include: { translations: true },
    });
  }

  async findAll(query: ContentQueryDto) {
    const { type, lang, isPublished, page = 1, limit = 10 } = query;
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;
    const where: Prisma.ContentWhereInput = {};
    if (type) where.type = type;
    if (isPublished !== undefined) where.isPublished = isPublished;

    const [contents, total] = await Promise.all([
      this.prisma.content.findMany({
        where,
        skip,
        take: limitNumber,
        orderBy: { publishedAt: 'desc' },
        include: {
          translations: lang ? { where: { language: lang } } : true,
        },
      }),
      this.prisma.content.count({ where }),
    ]);

    return {
      data: contents,
      meta: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    };
  }

  async findBySlug(slug: string, lang?: Language) {
    const content = await this.prisma.content.findUnique({
      where: { slug },
      include: { translations: lang ? { where: { language: lang } } : true },
    });
    if (!content) throw new NotFoundException('Contenu non trouvé');
    return content;
  }

  async update(id: string, dto: UpdateContentDto) {
    const content = await this.prisma.content.findUnique({ where: { id } });
    if (!content) throw new NotFoundException('Contenu non trouvé');

    if (dto.translations) {
      await this.prisma.contentTranslation.deleteMany({
        where: { contentId: id },
      });
    }

    return this.prisma.content.update({
      where: { id },
      data: {
        slug: dto.slug,
        featuredImage: dto.featuredImage,
        isPublished: dto.isPublished,
        publishedAt:
          dto.isPublished && !content.publishedAt
            ? new Date()
            : content.publishedAt,
        translations: dto.translations
          ? { create: dto.translations }
          : undefined,
      },
      include: { translations: true },
    });
  }

  async delete(id: string) {
    await this.prisma.content.delete({ where: { id } });
    return { message: 'Contenu supprimé' };
  }

  async getArticles(lang?: Language, limit = 10) {
    return this.prisma.content.findMany({
      where: { type: ContentType.ARTICLE, isPublished: true },
      take: limit,
      orderBy: { publishedAt: 'desc' },
      include: { translations: lang ? { where: { language: lang } } : true },
    });
  }

  async getEvents(lang?: Language) {
    return this.prisma.content.findMany({
      where: { type: ContentType.EVENT, isPublished: true },
      orderBy: { publishedAt: 'desc' },
      include: { translations: lang ? { where: { language: lang } } : true },
    });
  }
}
