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
import { ProjectsService } from './projects.service';
import {
  CreateProjectDto,
  UpdateProjectDto,
  ProjectQueryDto,
} from './dto/project.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { UserRole, Language } from '@prisma/client';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un nouveau projet' })
  async create(@Body() dto: CreateProjectDto) {
    return this.projectsService.create(dto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Lister tous les projets' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'isUrgent', required: false })
  @ApiQuery({ name: 'isFeatured', required: false })
  @ApiQuery({ name: 'lang', required: false, enum: Language })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findAll(@Query() query: ProjectQueryDto) {
    return this.projectsService.findAll(query);
  }

  @Get('stats')
  @Public()
  @ApiOperation({ summary: 'Obtenir les statistiques des projets' })
  async getStats() {
    return this.projectsService.getStats();
  }

  @Get('slug/:slug')
  @Public()
  @ApiOperation({ summary: 'Obtenir un projet par son slug' })
  @ApiQuery({ name: 'lang', required: false, enum: Language })
  async findBySlug(
    @Param('slug') slug: string,
    @Query('lang') lang?: Language,
  ) {
    return this.projectsService.findBySlug(slug, lang);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Obtenir un projet par ID' })
  @ApiQuery({ name: 'lang', required: false, enum: Language })
  async findOne(@Param('id') id: string, @Query('lang') lang?: Language) {
    return this.projectsService.findOne(id, lang);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour un projet' })
  async update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projectsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un projet' })
  async remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}
