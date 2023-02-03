import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { In, Repository } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>,
    private readonly wishesService: WishesService,
  ) {}

  async create(
    createWishlistDto: CreateWishlistDto,
    owner: User,
  ): Promise<Wishlist> {
    const wishesId = createWishlistDto.itemsId;
    const wishes = await this.wishesService.findMany({
      where: { id: In(wishesId) },
    });
    const wishlist = await this.wishlistsRepository.create({
      name: createWishlistDto.name,
      image: createWishlistDto.image,
      items: wishes,
      owner,
    });
    return this.wishlistsRepository.save(wishlist);
  }

  async findOne(id: number): Promise<Wishlist> {
    const wishlist = await this.wishlistsRepository.findOne({
      where: {
        id,
      },
      relations: {
        owner: true,
        items: true,
      },
    });
    if (!wishlist) {
      throw new NotFoundException('Такого списка не существует');
    }
    return wishlist;
  }

  findMany(): Promise<Wishlist[]> {
    return this.wishlistsRepository.find({
      relations: {
        owner: true,
        items: true,
      },
    });
  }

  async updateOne(
    wishlistId: number,
    updateWishlistDto: UpdateWishlistDto,
    user: User,
  ): Promise<Wishlist> {
    const wishlist = await this.findOne(wishlistId);
    if (wishlist.owner.id !== user.id) {
      throw new ForbiddenException('Нет прав на редактирование списка');
    }
    const wishes = await this.wishesService.findMany({
      where: { id: In(updateWishlistDto.itemsId) },
    });

    (wishlist.name = updateWishlistDto.name || wishlist.name),
      (wishlist.image = updateWishlistDto.image || wishlist.image),
      (wishlist.items = wishes || wishlist.items);

    return this.wishlistsRepository.save(wishlist);
  }

  async removeOne(id: number, userId: number): Promise<Wishlist> {
    const wishlist = await this.findOne(id);
    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException('Нет прав на удаление списка');
    } else {
      await this.wishlistsRepository.delete(id);
      return wishlist;
    }
  }
}
