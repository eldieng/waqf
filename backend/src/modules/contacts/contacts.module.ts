import { Module } from '@nestjs/common';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';
import { PrismaModule } from '../../prisma';

@Module({
  controllers: [ContactsController],
  providers: [ContactsService],
  imports: [PrismaModule],
  exports: [ContactsService],
})
export class ContactsModule {}
