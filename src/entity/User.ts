import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CollectedCoin } from './CollectedCoin';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    timezone!: string;

    @OneToMany(() => CollectedCoin, (collectedCoin) => collectedCoin.user)
    collectedCoins!: CollectedCoin[];
}
