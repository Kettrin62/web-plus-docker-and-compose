import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { FindManyOptions, Repository, UpdateResult } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { User } from 'src/users/entities/user.entity';
import { UpdateWishDto } from './dto/update-wish.dto';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  async create(createWishDto: CreateWishDto, owner: User): Promise<object> {
    const wish = await this.wishesRepository.create({
      ...createWishDto,
      owner,
    });
    await this.wishesRepository.save(wish);
    return {};
  }

  async findLast(): Promise<Wish[]> {
    const wishes = await this.wishesRepository.find({
      take: 40,
      order: {
        createdAt: 'DESC',
      },
      relations: {
        owner: true,
      },
    });
    return wishes;
  }

  async findTop(): Promise<Wish[]> {
    const wishes = await this.wishesRepository.find({
      take: 20,
      order: {
        copied: 'DESC',
      },
      relations: {
        owner: true,
      },
    });
    return wishes;
  }

  async findOne(id: number): Promise<Wish> {
    const wish = await this.wishesRepository.findOne({
      where: {
        id,
      },
      relations: {
        owner: true,
        offers: {
          user: true,
        },
      },
    });
    if (!wish) {
      throw new NotFoundException('Такого подарка не существует');
    }
    return wish;
  }

  async updateOne(
    wishId: number,
    updateWishDto: UpdateWishDto,
    userId: number,
  ): Promise<void> {
    const wish = await this.findOne(wishId);
    if (wish.owner.id !== userId) {
      throw new ForbiddenException('Нет прав на изменение данных подарка');
    }
    if (wish.offers.length !== 0) {
      delete updateWishDto.price;
    }
    await this.wishesRepository.update(wishId, updateWishDto);
    return;
  }

  async remove(id: number, userId: number): Promise<Wish> {
    const wish = await this.findOne(id);
    if (wish.owner.id !== userId) {
      throw new ForbiddenException('Нет прав на удаление подарка');
    }
    await this.wishesRepository.delete(id);
    return wish;
  }

  async updateCopied(id: number, user: User): Promise<object> {
    const wish = await this.findOne(id);
    if (wish.owner.id !== user.id) {
      const copied = wish.copied + 1;
      await this.wishesRepository.update(id, { copied });
      const { name, link, image, price, description } = wish;
      await this.create(
        {
          name,
          link,
          image,
          price,
          description,
        },
        user,
      );
    }
    return {};
  }

  updateRaised(id: number, raised: number): Promise<UpdateResult> {
    return this.wishesRepository.update(id, { raised });
  }

  findMany(options: FindManyOptions<Wish>): Promise<Wish[]> {
    return this.wishesRepository.find(options);
  }
}
