import { AppDataSource } from '../config/data-source';
import { User } from '../entity/User';

const seed = async () => {
    try {
        await AppDataSource.initialize();
        const userRepository = AppDataSource.getRepository(User);

        const users = [
            {
                name: 'serhan',
                timezone: 'Turkey',
            },
            {
                name: 'test',
                timezone: 'Canada/Atlantic',
            },
        ];

        for (const user of users) {
            const newUser = userRepository.create(user);
            await userRepository.save(newUser);
        }

        await AppDataSource.destroy();
    } catch (error) {
        console.error(error);
    }
};

seed();

process.exit();
