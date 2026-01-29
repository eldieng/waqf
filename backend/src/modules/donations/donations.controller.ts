import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DonationsService } from './donations.service';
import {
  CreateDonationDto,
  DonationQueryDto,
  VerifyPaymentDto,
} from './dto/donation.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Donations')
@Controller('donations')
export class DonationsController {
  constructor(private donationsService: DonationsService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Créer un nouveau don' })
  async create(@Body() dto: CreateDonationDto) {
    return this.donationsService.create(dto);
  }

  @Post('authenticated')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un don (utilisateur connecté)' })
  async createAuthenticated(
    @Body() dto: CreateDonationDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.donationsService.create(dto, userId);
  }

  @Post(':id/confirm')
  @Public()
  @ApiOperation({ summary: 'Confirmer un paiement' })
  async confirmPayment(@Param('id') id: string, @Body() dto: VerifyPaymentDto) {
    return this.donationsService.confirmPayment(id, dto.reference);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Lister les dons confirmés' })
  async findAll(@Query() query: DonationQueryDto) {
    return this.donationsService.findAll(query);
  }

  @Get('stats')
  @Public()
  @ApiOperation({ summary: 'Obtenir les statistiques des dons' })
  async getStats() {
    return this.donationsService.getStats();
  }

  @Get('my-donations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtenir mes dons' })
  async getMyDonations(
    @CurrentUser('id') userId: string,
    @Query() query: DonationQueryDto,
  ) {
    return this.donationsService.findAll({ ...query, userId });
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Obtenir un don par ID' })
  async findOne(@Param('id') id: string) {
    return this.donationsService.findOne(id);
  }
}
