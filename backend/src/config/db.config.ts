import { registerAs } from '@nestjs/config';
import { Wish } from '../wishes/entities/wish.entity';
import { User } from '../users/entities/user.entity';
import { Wishlist } from '../wishlists/entities/wishlist.entity';
import { Offer } from '../offers/entities/offer.entity';

// require('dotenv').config();

export default registerAs('database', () => ({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [User, Wish, Wishlist, Offer],
  synchronize: process.env.POSTGRES_SYNC,
}));
