import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ContentsService } from './contents.service';
import {
  CreateContentDto,
  UpdateContentDto,
  ContentQueryDto,
} from './dto/content.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole, Language } from '@prisma/client';

@Controller('contents')
export class ContentsController {
  constructor(private readonly contentsService: ContentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  create(@Body() dto: CreateContentDto) {
    return this.contentsService.create(dto);
  }

  @Get()
  findAll(@Query() query: ContentQueryDto) {
    return this.contentsService.findAll(query);
  }

  @Get('articles')
  getArticles(@Query('lang') lang?: Language, @Query('limit') limit?: number) {
    return this.contentsService.getArticles(lang, limit);
  }

  @Get('events')
  getEvents(@Query('lang') lang?: Language) {
    return this.contentsService.getEvents(lang);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string, @Query('lang') lang?: Language) {
    return this.contentsService.findBySlug(slug, lang);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  update(@Param('id') id: string, @Body() dto: UpdateContentDto) {
    return this.contentsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  delete(@Param('id') id: string) {
    return this.contentsService.delete(id);
  }
}
