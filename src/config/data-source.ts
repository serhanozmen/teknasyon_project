import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../entity/User';
import { CollectedCoin } from '../entity/CollectedCoin';
import { Coin } from '../entity/Coin';
import config from '../config';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: config.dbConfig.host,
    port: config.dbConfig.port,
    username: config.dbConfig.username,
    password: config.dbConfig.password,
    database: config.dbConfig.name,
    synchronize: false,
    logging: false,
    entities: [User, Coin, CollectedCoin],
    migrations: ['src/migrations/**/*.ts'],
    subscribers: [],
});

AppDataSource.initialize()
    .then(() => {
        console.log('Data Source has been initialized!');
    })
    .catch((error) => console.log(error));
