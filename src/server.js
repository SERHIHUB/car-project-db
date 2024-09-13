import express from 'express';
import cors from 'cors';
import { env } from './utils/env.js';
import { ENV_VARS, UPLOAD_DIR } from './constants/index.js';
import { notFoundMiddleWare } from './middlewares/notFoundMiddleWare.js';
import { errorHandlerMiddleware } from './middlewares/errorHandlerMiddleware.js';
import routers from './routers/index.js';

export const startServer = () => {
  const app = express();

  app.use(cors());

  app.use(express.json());

  app.use('/upload', express.static(UPLOAD_DIR));

  app.use(routers);

  app.use(notFoundMiddleWare);
  app.use(errorHandlerMiddleware);

  const PORT = env(ENV_VARS.PORT, 3005);

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}.`);
  });
};
