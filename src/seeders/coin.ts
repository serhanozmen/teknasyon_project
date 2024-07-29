import { AppDataSource } from '../config/data-source';
import { Coin } from '../entity/Coin';

const seed = async () => {
    try {
        await AppDataSource.initialize();
        const coinRepository = AppDataSource.getRepository(Coin);

        const coins = [
            {
                coinId: 1,
                title: 'Day1',
                dayIndex: 1,
                value: 10,
            },
            {
                coinId: 2,
                title: 'Day2',
                dayIndex: 2,
                value: 20,
            },
            {
                coinId: 3,
                title: 'Day3',
                dayIndex: 3,
                value: 30,
            },
            {
                coinId: 4,
                title: 'Day4',
                dayIndex: 4,
                value: 40,
            },
            {
                coinId: 5,
                title: 'Day5',
                dayIndex: 5,
                value: 50,
            },
            {
                coinId: 6,
                title: 'Day6',
                dayIndex: 6,
                value: 100,
            },
            {
                coinId: 7,
                title: 'Day7',
                dayIndex: 7,
                value: 200,
            },
        ];

        for (const coin of coins) {
            const newCoin = coinRepository.create(coin);
            await coinRepository.save(newCoin);
        }

        await AppDataSource.destroy();
    } catch (error) {
        console.error('Coins are already inserted', error);
    }
};

seed();

process.exit();
