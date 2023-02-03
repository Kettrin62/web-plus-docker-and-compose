import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from 'src/mail/mail.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { WishesService } from 'src/wishes/wishes.service';
import { Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    private wishesService: WishesService,
    private usersService: UsersService,
    private mailService: MailService,
  ) {}

  async create(createOfferDto: CreateOfferDto, user: User): Promise<object> {
    const wish = await this.wishesService.findOne(createOfferDto.itemId);

    if (wish.owner.id === user.id) {
      throw new BadRequestException(
        'Собирать деньги на свой подарок запрещено',
      );
    }
    if (wish.price === wish.raised) {
      throw new BadRequestException('Необходимая сумма уже собрана');
    }
    if (createOfferDto.amount > wish.price - wish.raised) {
      throw new BadRequestException(
        `Предложенная сумма превышает остаток. Осталось собрать ${
          wish.price - wish.raised
        } рублей`,
      );
    }

    const offer = await this.offersRepository.create({
      amount: createOfferDto.amount,
      hidden: createOfferDto.hidden,
      user,
      item: wish,
    });
    await this.wishesService.updateRaised(
      wish.id,
      wish.raised + createOfferDto.amount,
    );

    if (wish.price === wish.raised + createOfferDto.amount) {
      const users = wish.offers.map((offer) => offer.user.id);
      users.push(user.id);
      const mails = await this.usersService.findMails(users);
      await this.mailService.sendEmail(mails, wish);
    }

    await this.offersRepository.save(offer);
    return {};
  }

  async findOne(id: number): Promise<Offer> {
    const offer = await this.offersRepository.findOne({
      where: {
        id,
      },
      relations: {
        item: {
          owner: true,
        },
        user: {
          wishes: {
            owner: true,
          },
          offers: true,
        },
      },
    });
    if (!offer) {
      throw new NotFoundException('Такого оффера не существует');
    }
    return offer;
  }

  async findMany(): Promise<Offer[]> {
    const offers = await this.offersRepository.find({
      relations: {
        item: {
          owner: true,
        },
        user: {
          wishes: {
            owner: true,
          },
          offers: true,
        },
      },
    });
    return offers;
  }
}
