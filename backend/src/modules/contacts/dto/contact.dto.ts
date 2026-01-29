import { IsEmail, IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateContactDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsString()
  message: string;
}

export class ContactQueryDto {
  @IsOptional()
  @IsBoolean()
  isRead?: boolean;

  @IsOptional()
  page?: number = 1;

  @IsOptional()
  limit?: number = 10;
}

export class SubscribeNewsletterDto {
  @IsEmail()
  email: string;
}
