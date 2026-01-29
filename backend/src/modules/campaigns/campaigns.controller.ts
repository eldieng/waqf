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
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { CampaignsService } from './campaigns.service';
import {
  CreateCampaignDto,
  UpdateCampaignDto,
  CampaignQueryDto,
} from './dto/campaign.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { UserRole, Language } from '@prisma/client';

@ApiTags('Campaigns')
@Controller('campaigns')
export class CampaignsController {
  constructor(private campaignsService: CampaignsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer une nouvelle campagne' })
  async create(@Body() dto: CreateCampaignDto) {
    return this.campaignsService.create(dto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Lister toutes les campagnes' })
  async findAll(@Query() query: CampaignQueryDto) {
    return this.campaignsService.findAll(query);
  }

  @Get('active')
  @Public()
  @ApiOperation({ summary: 'Obtenir les campagnes actives' })
  async getActive() {
    return this.campaignsService.getActive();
  }

  @Get('slug/:slug')
  @Public()
  @ApiOperation({ summary: 'Obtenir une campagne par slug' })
  @ApiQuery({ name: 'lang', required: false, enum: Language })
  async findBySlug(
    @Param('slug') slug: string,
    @Query('lang') lang?: Language,
  ) {
    return this.campaignsService.findBySlug(slug, lang);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Obtenir une campagne par ID' })
  @ApiQuery({ name: 'lang', required: false, enum: Language })
  async findOne(@Param('id') id: string, @Query('lang') lang?: Language) {
    return this.campaignsService.findOne(id, lang);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour une campagne' })
  async update(@Param('id') id: string, @Body() dto: UpdateCampaignDto) {
    return this.campaignsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer une campagne' })
  async remove(@Param('id') id: string) {
    return this.campaignsService.remove(id);
  }
}
