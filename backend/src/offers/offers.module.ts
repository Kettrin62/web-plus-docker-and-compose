import { Module } from '@nestjs/common';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { WishesModule } from 'src/wishes/wishes.module';
import { MailModule } from 'src/mail/mail.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Offer]),
    WishesModule,
    MailModule,
    UsersModule,
  ],
  providers: [OffersService],
  controllers: [OffersController],
})
export class OffersModule {}
