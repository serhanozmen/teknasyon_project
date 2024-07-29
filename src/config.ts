import dotenv from 'dotenv';

dotenv.config();

interface DBConfig {
    host: string;
    port: number;
    username: string;
    password: string;
    name: string;
}

interface Config {
    port: number;
    dbConfig: DBConfig;
}

const config: Config = {
    port: Number(process.env.PORT || 3000),
    dbConfig: {
        host: process.env.DATABSE_HOST || 'localhost',
        port: Number(process.env.DATABSE_PORT || 5432),
        username: process.env.DATABASE_USERNAME || '',
        password: process.env.DATABASE_PASSWORD || '',
        name: process.env.DATABASE_NAME || '',
    },
};

export default config;
