import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Length, IsUrl, IsInt, IsDate, IsString } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Offer } from 'src/offers/entities/offer.entity';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  @IsInt()
  id: number;

  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;

  @Column()
  @IsString()
  @Length(1, 250)
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

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
  price: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: {
      to(value: number): number {
        return value;
      },
      from(value: string): number {
        return parseFloat(value);
      },
    },
  })
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @Column({
    nullable: true,
  })
  @IsString()
  @Length(1, 1024)
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item, { cascade: true, eager: true })
  offers: Offer[];

  @Column({
    default: 0,
  })
  @IsInt()
  copied: number;
}
