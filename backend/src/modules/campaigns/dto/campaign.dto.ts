import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsEnum,
  IsArray,
  IsDateString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CampaignStatus, Language } from '@prisma/client';

// Translation DTO
export class CampaignTranslationDto {
  @IsEnum(Language)
  language: Language;

  @IsString()
  title: string;

  @IsString()
  description: string; // Required, not optional
}

// Create Campaign DTO
export class CreateCampaignDto {
  @IsString()
  slug: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  goalAmount: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsString()
  featuredImage?: string;

  @IsOptional()
  @IsBoolean()
  isUrgent?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  projectIds?: string[];

  @IsArray()
  @Type(() => CampaignTranslationDto)
  translations: CampaignTranslationDto[];
}

// Update Campaign DTO
export class UpdateCampaignDto {
  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsEnum(CampaignStatus)
  status?: CampaignStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  goalAmount?: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  featuredImage?: string;

  @IsOptional()
  @IsBoolean()
  isUrgent?: boolean;

  @IsOptional()
  @IsArray()
  @Type(() => CampaignTranslationDto)
  translations?: CampaignTranslationDto[];
}

// Query DTO
export class CampaignQueryDto {
  @IsOptional()
  @IsEnum(CampaignStatus)
  status?: CampaignStatus;

  @IsOptional()
  @IsBoolean()
  isUrgent?: boolean;

  @IsOptional()
  @IsEnum(Language)
  lang?: Language;

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
