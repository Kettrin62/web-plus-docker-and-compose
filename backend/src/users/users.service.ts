import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  createHash(password: string) {
    return bcrypt.hash(password, 10);
  }

  errorUnique(userByUsername: User, userByEmail: User): void {
    if (userByUsername && userByEmail) {
      throw new BadRequestException(
        'Пользователь с таким именем и email уже есть',
      );
    } else if (userByUsername) {
      throw new BadRequestException('Пользователь с таким именем уже есть');
    } else if (userByEmail) {
      throw new BadRequestException('Пользователь с таким email уже есть');
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, email } = createUserDto;
    const userByUsername = await this.findOptions({
      where: { username },
    });
    const userByEmail = await this.findOptions({
      where: { email },
    });
    this.errorUnique(userByUsername, userByEmail);

    const hash = await this.createHash(createUserDto.password);
    const createUserHash: CreateUserDto = {
      ...createUserDto,
      password: hash,
    };

    const createUser = await this.usersRepository.create(createUserHash);

    const user = await this.usersRepository.save(createUser);
    delete user.password;
    return user;
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .where({ id })
      .addSelect('user.email')
      .getOne();

    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .where({ username })
      .addSelect('user.password')
      .addSelect('user.email')
      .getOne();
    if (!user) {
      throw new NotFoundException('Такого пользователя не существует');
    }
    return user;
  }

  async findOptions(options: FindOneOptions): Promise<User> {
    const user = await this.usersRepository.findOne(options);
    return user;
  }

  async findMany(query: string): Promise<User[]> {
    const users = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { username: query })
      .orWhere('user.email = :email', { email: query })
      .addSelect('user.email')
      .getMany();

    return users;
  }

  async updateOne(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    const { username, email } = updateUserDto;
    const userByUsername =
      username &&
      username !== user.username &&
      (await this.findOptions({
        where: { username },
      }));
    const userByEmail =
      email &&
      email !== user.email &&
      (await this.findOptions({
        where: { email },
      }));
    this.errorUnique(userByUsername, userByEmail);

    if (updateUserDto.password) {
      const hash = await this.createHash(updateUserDto.password);
      updateUserDto.password = hash;
    }
    await this.usersRepository.update({ id }, updateUserDto);
    return this.findOne(id);
  }

  async findWishesUser(username: string): Promise<Wish[]> {
    const user = await this.usersRepository.findOne({
      where: {
        username,
      },
      relations: {
        wishes: {
          owner: true,
        },
      },
    });
    return user.wishes;
  }

  async findWishes(username: string): Promise<Wish[]> {
    const user = await this.usersRepository.findOne({
      where: {
        username,
      },
      relations: {
        wishes: true,
      },
    });
    return user.wishes;
  }

  async findMails(usersId: number[]): Promise<string[]> {
    const users = await this.usersRepository
      .createQueryBuilder()
      .select('user')
      .from(User, 'user')
      .where('user.id IN (:...usersId)', { usersId })
      .addSelect('user.email')
      .getMany();

    return users.map((user) => user.email);
  }
}
