import config from './src/config';
import { connectDatabase } from './src/config/dbConnection';
import app from './src/config/express';
import { logger } from './src/lib/logger';

const { port } = config;

app.listen(port, async () => {
  logger.info(`Server running on port ${port}`);
  await connectDatabase();
});
