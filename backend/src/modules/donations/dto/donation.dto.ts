import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsEnum,
  Min,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DonationType, PaymentMethod } from '@prisma/client';

// Create Donation DTO
export class CreateDonationDto {
  @IsNumber()
  @Min(100)
  @Type(() => Number)
  amount: number;

  @IsOptional()
  @IsString()
  currency?: string = 'XOF';

  @IsOptional()
  @IsEnum(DonationType)
  type?: DonationType = DonationType.ONE_TIME;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsUUID()
  campaignId?: string;

  @IsOptional()
  @IsString()
  donorName?: string;

  @IsOptional()
  @IsString()
  donorEmail?: string;

  @IsOptional()
  @IsString()
  donorPhone?: string;

  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;

  @IsOptional()
  @IsString()
  message?: string;
}

// Query DTO
export class DonationQueryDto {
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsUUID()
  campaignId?: string;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsEnum(DonationType)
  type?: DonationType;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  limit?: number = 10;
}

// Payment verification DTO
export class VerifyPaymentDto {
  @IsString()
  reference: string;

  @IsString()
  provider: string;
}
