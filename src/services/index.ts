import { AppDataSource } from '../config/data-source';
import { User, Coin, CollectedCoin } from '../entity';
import { getDate, getToday, sortDates } from '../utils';

type TodaysCoin = {
    title: string;
    state: number;
    claimStartDate: string;
    claimEndDate: string | null;
    coin: number;
};

const getUser = async (userId: number): Promise<User> => {
    try {
        const userRepository = await AppDataSource.getRepository(User);
        const user = await userRepository.findOne({
            where: { id: Number(userId) },
        });

        if (!user) {
            throw new Error('Kullanıcı bulunurken hata oluştu');
        }

        return user;
    } catch (error) {
        throw new Error('Kullanıcı bulunurken hata oluştu');
    }
};

const getCollectedCoins = async (user: User): Promise<Coin[]> => {
    const coinRepository = AppDataSource.getRepository(Coin);

    const coins = await coinRepository
        .createQueryBuilder('coin')
        .leftJoinAndSelect(
            'coin.collectedCoins',
            'collectedCoin',
            `collectedCoin.userId = ${user.id}`,
        )
        .select([
            'coin.dayIndex',
            'coin.title',
            'coin.value',
            'collectedCoin.date',
        ])
        .getMany();

    return coins;
};

const parseCollectedCoins = (
    collectedCoins: Coin[],
    user: User,
): TodaysCoin[] => {
    const { today } = getToday(user.timezone);
    let initialDate = getDate(
        sortDates(
            collectedCoins[0].collectedCoins.map((d) => d.date),
            user.timezone,
        )[0],
        user.timezone,
    );
    const mostRecentDay =
        collectedCoins
            .map((collectedCoin) => {
                return getDate(
                    sortDates(
                        collectedCoin.collectedCoins.map((d) => d.date),
                        user.timezone,
                    )[0],
                    user.timezone,
                );
            })
            .filter((coin) => coin != null)
            .sort((a, b) => (b?.valueOf() || 0) - (a?.valueOf() || 0))[0] ||
        today;

    if (
        mostRecentDay.clone().add(1, 'days').startOf('day').valueOf() <
            today.valueOf() ||
        initialDate?.clone().add(7, 'days').startOf('day').valueOf() ==
            today.valueOf()
    ) {
        initialDate = today;
    }

    return collectedCoins.map((collectedCoin) => {
        let claimDate = null;
        const claimStartDate = initialDate
            ? initialDate
                  .clone()
                  .add(collectedCoin.dayIndex - 1, 'days')
                  .startOf('day')
            : today
                  .clone()
                  .add(collectedCoin.dayIndex - 1, 'days')
                  .startOf('day');
        const claimEndDate = claimStartDate.clone().endOf('day');
        if (initialDate != today) {
            claimDate = getDate(
                sortDates(
                    collectedCoin.collectedCoins.map((d) => d.date),
                    user.timezone,
                )[0],
                user.timezone,
            );
        }
        if (claimStartDate > today) {
            return {
                title: `Day ${collectedCoin.dayIndex}`,
                state: 0,
                claimStartDate: claimStartDate.format('YYYY-MM-DD HH-mm-ss'),
                claimEndDate: claimEndDate.format('YYYY-MM-DD HH-mm-ss'),
                coin: collectedCoin.value,
            };
        }

        if (
            claimDate &&
            claimDate.clone().add(7, 'days').startOf('day').valueOf() > today.valueOf()
        ) {
            return {
                title: `Day ${collectedCoin.dayIndex}`,
                state: 2,
                claimStartDate: claimDate.format('YYYY-MM-DD HH-mm-ss'),
                claimEndDate: null,
                coin: collectedCoin.value,
            };
        }

        return {
            title: `Day ${collectedCoin.dayIndex}`,
            state: 1,
            claimStartDate: claimStartDate.format('YYYY-MM-DD HH-mm-ss'),
            claimEndDate: claimEndDate.format('YYYY-MM-DD HH-mm-ss'),
            coin: collectedCoin.value,
        };
    });
};

const getCoin = async (index: number) => {
    const coinRepository = AppDataSource.getRepository(Coin);

    const coin = await coinRepository.findOne({ where: { dayIndex: index } });

    return coin;
};

const getTodaysCoin = async (user: User): Promise<TodaysCoin> => {
    const collectedCoins = await getCollectedCoins(user);
    const parsedCollectedCoins = parseCollectedCoins(collectedCoins, user);
    const { today } = getToday(user.timezone);
    let todaysCoin = {
      title: '',
      state: 0,
      claimStartDate: '',
      claimEndDate: '',
      coin: 0,
    };

    parsedCollectedCoins.forEach((coin) => {
        const claimStartDate = coin.claimStartDate;

        const parsedStartDate = getDate(claimStartDate, user.timezone)?.startOf(
            'day',
        );
        if (parsedStartDate?.valueOf() == today.valueOf()) {
            Object.assign(todaysCoin, coin);
        }
    });

    return todaysCoin;
};

const createCollectedCoin = async (user: User, coin: Coin) => {
    const collectedCoinRepository = AppDataSource.getRepository(CollectedCoin);
    const { now } = getToday(user.timezone);
    const newCollectedCoin = new CollectedCoin();

    newCollectedCoin.user = user;
    newCollectedCoin.coin = coin;
    newCollectedCoin.date = now.format('YYYY-MM-DD HH:mm:ss');

    await collectedCoinRepository.save(newCollectedCoin);
};

export {
    getUser,
    getCollectedCoins,
    parseCollectedCoins,
    getCoin,
    getTodaysCoin,
    createCollectedCoin,
};
