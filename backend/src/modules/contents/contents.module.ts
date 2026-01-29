import { Module } from '@nestjs/common';
import { ContentsController } from './contents.controller';
import { ContentsService } from './contents.service';
import { PrismaModule } from '../../prisma';

@Module({
  controllers: [ContentsController],
  providers: [ContentsService],
  imports: [PrismaModule],
  exports: [ContentsService],
})
export class ContentsModule {}
