import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductQueryDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from './dto/product.dto';
import { Language, Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProductDto) {
    const existing = await this.prisma.product.findUnique({
      where: { slug: dto.slug },
    });
    if (existing) throw new ConflictException('Ce slug existe déjà');

    return this.prisma.product.create({
      data: {
        slug: dto.slug,
        price: dto.price,
        comparePrice: dto.comparePrice,
        stock: dto.stock ?? 0,
        isActive: dto.isActive ?? true,
        images: dto.images || [],
        translations: { create: dto.translations },
        categories: dto.categoryIds
          ? {
              create: dto.categoryIds.map((catId) => ({ categoryId: catId })),
            }
          : undefined,
      },
      include: {
        translations: true,
        categories: {
          include: { category: { include: { translations: true } } },
        },
      },
    });
  }

  async findAll(query: ProductQueryDto) {
    const { search, categoryId, lang, isActive, page = 1, limit = 12 } = query;
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 12;
    const skip = (pageNumber - 1) * limitNumber;
    const where: Prisma.ProductWhereInput = {};

    if (isActive !== undefined) where.isActive = isActive;
    if (categoryId) {
      where.categories = { some: { categoryId } };
    }
    if (search) {
      where.translations = {
        some: { name: { contains: search, mode: 'insensitive' } },
      };
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limitNumber,
        orderBy: { createdAt: 'desc' },
        include: {
          translations: lang ? { where: { language: lang } } : true,
          categories: {
            include: { category: { include: { translations: true } } },
          },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      meta: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    };
  }

  async findBySlug(slug: string, lang?: Language) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        translations: lang ? { where: { language: lang } } : true,
        categories: {
          include: { category: { include: { translations: true } } },
        },
      },
    });
    if (!product) throw new NotFoundException('Produit non trouvé');
    return product;
  }

  async findById(id: string, lang?: Language) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        translations: lang ? { where: { language: lang } } : true,
        categories: {
          include: { category: { include: { translations: true } } },
        },
      },
    });
    if (!product) throw new NotFoundException('Produit non trouvé');
    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Produit non trouvé');

    if (dto.translations) {
      await this.prisma.productTranslation.deleteMany({
        where: { productId: id },
      });
    }

    if (dto.categoryIds) {
      await this.prisma.productCategory.deleteMany({
        where: { productId: id },
      });
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        slug: dto.slug,
        price: dto.price,
        comparePrice: dto.comparePrice,
        stock: dto.stock,
        isActive: dto.isActive,
        isFeatured: dto.isFeatured,
        images: dto.images,
        translations: dto.translations
          ? { create: dto.translations }
          : undefined,
        categories: dto.categoryIds
          ? {
              create: dto.categoryIds.map((catId) => ({ categoryId: catId })),
            }
          : undefined,
      },
      include: {
        translations: true,
        categories: {
          include: { category: { include: { translations: true } } },
        },
      },
    });
  }

  async delete(id: string) {
    await this.prisma.product.delete({ where: { id } });
    return { message: 'Produit supprimé' };
  }

  async getCategories(lang?: Language) {
    return this.prisma.category.findMany({
      include: {
        translations: lang ? { where: { language: lang } } : true,
        _count: { select: { products: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createCategory(dto: CreateCategoryDto) {
    const existing = await this.prisma.category.findUnique({
      where: { slug: dto.slug },
    });
    if (existing) throw new ConflictException('Ce slug existe déjà');

    return this.prisma.category.create({
      data: {
        slug: dto.slug,
        translations: { create: dto.translations },
      },
      include: {
        translations: true,
        _count: { select: { products: true } },
      },
    });
  }

  async updateCategory(id: string, dto: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Catégorie non trouvée');

    if (dto.translations) {
      await this.prisma.categoryTranslation.deleteMany({
        where: { categoryId: id },
      });
    }

    return this.prisma.category.update({
      where: { id },
      data: {
        slug: dto.slug,
        translations: dto.translations
          ? { create: dto.translations }
          : undefined,
      },
      include: {
        translations: true,
        _count: { select: { products: true } },
      },
    });
  }

  async deleteCategory(id: string) {
    await this.prisma.category.delete({ where: { id } });
    return { message: 'Catégorie supprimée' };
  }
}
