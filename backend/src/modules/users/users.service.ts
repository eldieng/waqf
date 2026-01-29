import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma';
import {
  CreateUserDto,
  UpdateUserDto,
  ChangePasswordDto,
  UserQueryDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './dto/user.dto';
import { Prisma, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

type ResetTokenValue = {
  token: string;
  expiresAt: string;
};

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    if (!dto.email && !dto.phone) {
      throw new BadRequestException('Email ou téléphone requis');
    }

    // Check if user exists
    const orWhere: Prisma.UserWhereInput[] = [];
    if (dto.email) orWhere.push({ email: dto.email });
    if (dto.phone) orWhere.push({ phone: dto.phone });

    const existing = await this.prisma.user.findFirst({
      where: {
        OR: orWhere,
      },
    });

    if (existing) {
      throw new ConflictException(
        'Un utilisateur avec cet email ou téléphone existe déjà',
      );
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        phone: dto.phone,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role: dto.role || UserRole.DONOR,
      },
    });

    return this.sanitizeUser(user);
  }

  async findAll(query: UserQueryDto) {
    const { search, role, isActive, page = 1, limit = 10 } = query;
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const where: Prisma.UserWhereInput = {};

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role) {
      where.role = role;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limitNumber,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          phone: true,
          firstName: true,
          lastName: true,
          avatar: true,
          role: true,
          isVerified: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: { donations: true },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      meta: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        avatar: true,
        role: true,
        isVerified: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        donations: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            amount: true,
            currency: true,
            createdAt: true,
            project: { select: { id: true, slug: true } },
          },
        },
        _count: {
          select: { donations: true, orders: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Check for email/phone conflicts
    if (dto.email && dto.email !== user.email) {
      const existing = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (existing) {
        throw new ConflictException('Cet email est déjà utilisé');
      }
    }

    if (dto.phone && dto.phone !== user.phone) {
      const existing = await this.prisma.user.findUnique({
        where: { phone: dto.phone },
      });
      if (existing) {
        throw new ConflictException('Ce téléphone est déjà utilisé');
      }
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: dto,
    });

    return this.sanitizeUser(updated);
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Mot de passe actuel incorrect');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 12);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Mot de passe modifié avec succès' };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.identifier }, { phone: dto.identifier }],
      },
    });

    if (!user) {
      // Don't reveal if user exists
      return {
        message:
          'Si un compte existe avec cet identifiant, un email de réinitialisation a été envoyé',
      };
    }

    // Generate reset token
    const resetToken = randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // Store token in settings (or create a dedicated table)
    await this.prisma.setting.upsert({
      where: { key: `reset_token_${user.id}` },
      update: {
        value: { token: resetToken, expiresAt: resetTokenExpiry.toISOString() },
      },
      create: {
        key: `reset_token_${user.id}`,
        value: { token: resetToken, expiresAt: resetTokenExpiry.toISOString() },
      },
    });

    // TODO: Send email with reset link
    // For now, log the token (in production, send email)
    console.log(`Reset token for ${user.email || user.phone}: ${resetToken}`);

    return {
      message:
        'Si un compte existe avec cet identifiant, un email de réinitialisation a été envoyé',
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    // Find the reset token
    const settings = await this.prisma.setting.findMany({
      where: {
        key: { startsWith: 'reset_token_' },
      },
    });

    let userId: string | null = null;

    for (const setting of settings) {
      const value = setting.value;
      if (!this.isResetTokenValue(value)) {
        continue;
      }
      if (value.token === dto.token) {
        if (new Date(value.expiresAt) < new Date()) {
          throw new BadRequestException('Le lien de réinitialisation a expiré');
        }
        userId = setting.key.replace('reset_token_', '');
        break;
      }
    }

    if (!userId) {
      throw new BadRequestException('Token de réinitialisation invalide');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 12);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // Delete the reset token
    await this.prisma.setting.delete({
      where: { key: `reset_token_${userId}` },
    });

    return { message: 'Mot de passe réinitialisé avec succès' };
  }

  async delete(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Soft delete - just deactivate
    await this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });

    return { message: 'Utilisateur désactivé avec succès' };
  }

  async getStats() {
    const [total, donors, admins, activeThisMonth] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { role: UserRole.DONOR } }),
      this.prisma.user.count({ where: { role: UserRole.ADMIN } }),
      this.prisma.user.count({
        where: {
          lastLoginAt: {
            gte: new Date(new Date().setDate(1)), // First day of current month
          },
        },
      }),
    ]);

    return {
      total,
      donors,
      admins,
      activeThisMonth,
    };
  }

  private sanitizeUser<T extends { password?: unknown }>(
    user: T,
  ): Omit<T, 'password'> {
    const { password, ...sanitized } = user;
    void password;
    return sanitized;
  }

  private isResetTokenValue(value: unknown): value is ResetTokenValue {
    if (!value || typeof value !== 'object') return false;
    const v = value as Record<string, unknown>;
    return typeof v.token === 'string' && typeof v.expiresAt === 'string';
  }
}
