import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    OneToMany,
    Index,
} from 'typeorm';
import { CollectedCoin } from './CollectedCoin';

@Entity('coins')
export class Coin {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    @Index({ unique: true })
    coinId!: number;

    @Column()
    dayIndex!: number;

    @Column()
    title!: string;

    @Column()
    value!: number;

    @OneToMany(() => CollectedCoin, (collectedCoin) => collectedCoin.coin)
    collectedCoins!: CollectedCoin[];
}
