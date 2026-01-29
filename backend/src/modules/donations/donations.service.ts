import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { CreateDonationDto, DonationQueryDto } from './dto/donation.dto';
import { TransactionStatus, DonationType } from '@prisma/client';
import { randomUUID } from 'crypto';

@Injectable()
export class DonationsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateDonationDto, userId?: string) {
    // Validate project or campaign exists
    if (dto.projectId) {
      const project = await this.prisma.project.findUnique({
        where: { id: dto.projectId },
      });
      if (!project) throw new NotFoundException('Projet non trouvé');
    }
    if (dto.campaignId) {
      const campaign = await this.prisma.campaign.findUnique({
        where: { id: dto.campaignId },
      });
      if (!campaign) throw new NotFoundException('Campagne non trouvée');
    }

    // Generate external ID for transaction
    const externalId = `DON-${Date.now()}-${randomUUID().slice(0, 8).toUpperCase()}`;

    // Create donation with transaction
    const donation = await this.prisma.donation.create({
      data: {
        amount: dto.amount,
        currency: dto.currency || 'XOF',
        type: dto.type || DonationType.ONE_TIME,
        donorName: dto.donorName,
        donorEmail: dto.donorEmail,
        donorPhone: dto.donorPhone,
        isAnonymous: dto.isAnonymous ?? false,
        message: dto.message,
        projectId: dto.projectId,
        campaignId: dto.campaignId,
        userId: userId,
        transaction: {
          create: {
            externalId,
            amount: dto.amount,
            currency: dto.currency || 'XOF',
            paymentMethod: dto.paymentMethod,
            status: TransactionStatus.PENDING,
            userId: userId,
          },
        },
      },
      include: {
        transaction: true,
      },
    });

    // Return payment initiation data
    return {
      donation,
      paymentData: this.generatePaymentData(
        donation,
        dto.paymentMethod,
        externalId,
      ),
    };
  }

  async confirmPayment(donationId: string, providerRef: string) {
    const donation = await this.prisma.donation.findUnique({
      where: { id: donationId },
      include: { transaction: true },
    });

    if (!donation) throw new NotFoundException('Don non trouvé');
    if (donation.transaction?.status === TransactionStatus.SUCCESS) {
      throw new BadRequestException('Don déjà confirmé');
    }

    // Update transaction status
    await this.prisma.transaction.update({
      where: { donationId },
      data: {
        status: TransactionStatus.SUCCESS,
        providerRef,
        paidAt: new Date(),
      },
    });

    // Update project collected amount
    if (donation.projectId) {
      await this.prisma.project.update({
        where: { id: donation.projectId },
        data: {
          collectedAmount: { increment: donation.amount },
          donorCount: { increment: 1 },
        },
      });
    }

    // Update campaign collected amount
    if (donation.campaignId) {
      await this.prisma.campaign.update({
        where: { id: donation.campaignId },
        data: {
          collectedAmount: { increment: donation.amount },
        },
      });
    }

    return this.prisma.donation.findUnique({
      where: { id: donationId },
      include: { transaction: true },
    });
  }

  async findAll(query: DonationQueryDto) {
    const { projectId, campaignId, userId, type, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      transaction: { status: TransactionStatus.SUCCESS },
    };
    if (projectId) where.projectId = projectId;
    if (campaignId) where.campaignId = campaignId;
    if (userId) where.userId = userId;
    if (type) where.type = type;

    const [donations, total] = await Promise.all([
      this.prisma.donation.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          amount: true,
          currency: true,
          type: true,
          donorName: true,
          isAnonymous: true,
          message: true,
          createdAt: true,
          project: { select: { id: true, slug: true } },
          campaign: { select: { id: true, slug: true } },
        },
      }),
      this.prisma.donation.count({ where }),
    ]);

    return {
      data: donations.map((d) => ({
        ...d,
        donorName: d.isAnonymous ? 'Anonyme' : d.donorName,
      })),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const donation = await this.prisma.donation.findUnique({
      where: { id },
      include: {
        project: { select: { id: true, slug: true } },
        campaign: { select: { id: true, slug: true } },
        transaction: true,
      },
    });

    if (!donation) throw new NotFoundException('Don non trouvé');
    return donation;
  }

  async getStats() {
    const [totalDonations, totalAmount, donorCount, recentDonations] =
      await Promise.all([
        this.prisma.donation.count({
          where: { transaction: { status: TransactionStatus.SUCCESS } },
        }),
        this.prisma.donation.aggregate({
          where: { transaction: { status: TransactionStatus.SUCCESS } },
          _sum: { amount: true },
        }),
        this.prisma.donation.groupBy({
          by: ['donorEmail'],
          where: {
            transaction: { status: TransactionStatus.SUCCESS },
            donorEmail: { not: null },
          },
        }),
        this.prisma.donation.findMany({
          where: { transaction: { status: TransactionStatus.SUCCESS } },
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            amount: true,
            donorName: true,
            isAnonymous: true,
            createdAt: true,
          },
        }),
      ]);

    return {
      totalDonations,
      totalAmount: totalAmount._sum?.amount || 0,
      uniqueDonors: donorCount.length,
      recentDonations: recentDonations.map((d) => ({
        ...d,
        donorName: d.isAnonymous ? 'Anonyme' : d.donorName,
      })),
    };
  }

  private generatePaymentData(
    donation: any,
    paymentMethod: string,
    externalId: string,
  ) {
    // Placeholder for payment provider integration
    // This would integrate with PayDunya, Orange Money, Wave, etc.
    return {
      checkoutUrl: `https://payment-provider.com/pay/${externalId}`,
      reference: externalId,
      amount: donation.amount,
      currency: donation.currency,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
    };
  }
}
