import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Coin } from './Coin';
import { User } from './User';

@Entity('collected_coins')
export class CollectedCoin {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'timestamp' })
    date!: string;

    @ManyToOne(() => User, (user) => user.collectedCoins)
    user!: User;

    @ManyToOne(() => Coin, (coin) => coin.collectedCoins)
    @JoinColumn({ name: 'coinId', referencedColumnName: 'coinId' })
    coin!: Coin;
}
