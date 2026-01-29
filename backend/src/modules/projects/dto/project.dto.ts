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
import { Type, Transform } from 'class-transformer';
import { ProjectStatus, Language } from '@prisma/client';

// Translation DTO
export class ProjectTranslationDto {
  @IsEnum(Language)
  language: Language;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  shortDesc?: string;
}

// Create Project DTO
export class CreateProjectDto {
  @IsString()
  slug: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  goalAmount: number;

  @IsOptional()
  @IsString()
  featuredImage?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  gallery?: string[];

  @IsOptional()
  @IsBoolean()
  isUrgent?: boolean;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsArray()
  @Type(() => ProjectTranslationDto)
  translations: ProjectTranslationDto[];
}

// Update Project DTO
export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  goalAmount?: number;

  @IsOptional()
  @IsString()
  featuredImage?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  gallery?: string[];

  @IsOptional()
  @IsBoolean()
  isUrgent?: boolean;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsArray()
  @Type(() => ProjectTranslationDto)
  translations?: ProjectTranslationDto[];
}

// Query DTO
export class ProjectQueryDto {
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isUrgent?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isFeatured?: boolean;

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
