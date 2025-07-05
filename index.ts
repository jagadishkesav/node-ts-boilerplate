import config from './config';
import { connectDatabase } from './config/dbConnection';
import app from './config/express';
import { logger } from './lib/logger';

const { port } = config;

app.listen(port, async () => {
  logger.info(`Server running on port ${port}`);
  await connectDatabase();
});
