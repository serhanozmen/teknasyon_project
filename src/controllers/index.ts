import { Request, Response } from 'express';
import {
    createCollectedCoin,
    getCoin,
    getCollectedCoins,
    getTodaysCoin,
    getUser,
    parseCollectedCoins,
} from '../services';

export const days = async (req: Request, res: Response) => {
    try {
        const userId = req.query.user_id;

        const user = await getUser(Number(userId));

        const collectedCoins = await getCollectedCoins(user);

        const parsedCollectedCoins = parseCollectedCoins(collectedCoins, user);

        res.json({ data: parsedCollectedCoins });
    } catch (error) {
        return res.json({
            status: 'error',
            message: error,
        });
    }
};

export const collect = async (req: Request, res: Response) => {
    try {
        const { dayIndex } = req.body;
        const userId = req.query.user_id;

        const user = await getUser(Number(userId));

        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        }

        const coin = await getCoin(dayIndex);

        if (!coin) {
            return res.status(400).json({ message: 'Böyle bir ödül yok.' });
        }

        const todaysCoin = await getTodaysCoin(user);

        if (todaysCoin.title.split('Day ')[1] < dayIndex) {
            return res.json({
                status: 'error',
                message: 'Vakti gelmemiş gün için ödül toplanamaz.',
            });
        } else if (todaysCoin.title.split('Day ')[1] > dayIndex) {
            return res.json({
                status: 'error',
                message: 'Bugün için ödül zaten toplandı.',
            });
        }

        if (todaysCoin.state == 2) {
            return res.json({
                status: 'error',
                message: 'Bugün için ödül zaten toplandı.',
            });
        }

        await createCollectedCoin(user, coin);

        return res.json({
            status: 'success',
            message: 'Ödül başarıyla toplandı.',
        });
    } catch (error) {
        return res.json({
            status: 'error',
            message: error,
        });
    }
};
