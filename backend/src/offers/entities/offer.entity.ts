import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { IsInt, IsDate, IsBoolean } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  @IsInt()
  id: number;

  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: {
      to(value: number): number {
        return value;
      },
      from(value: string): number {
        return parseFloat(value);
      },
    },
  })
  amount: number;

  @Column({
    default: false,
  })
  @IsBoolean()
  hidden: boolean;
}
