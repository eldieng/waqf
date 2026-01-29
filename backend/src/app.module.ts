import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma';
import { AuthModule } from './modules/auth';
import { ProjectsModule } from './modules/projects';
import { CampaignsModule } from './modules/campaigns';
import { DonationsModule } from './modules/donations';
import { UsersModule } from './modules/users';
import { ContactsModule } from './modules/contacts';
import { ContentsModule } from './modules/contents';
import { ProductsModule } from './modules/products';
import { OrdersModule } from './modules/orders/orders.module';
import { UploadModule } from './modules/upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    ProjectsModule,
    CampaignsModule,
    DonationsModule,
    UsersModule,
    ContactsModule,
    ContentsModule,
    ProductsModule,
    OrdersModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
