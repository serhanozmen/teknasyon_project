import app from './app';
import config from './config';
import { AppDataSource } from './config/data-source';

const PORT = config.port || 3001;

AppDataSource.initialize()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error during Data Source initialization:', error);
    });
