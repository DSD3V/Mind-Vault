import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import neo4j from 'neo4j-driver';
import { dirname } from 'path';
import * as path from 'path';
import { fileURLToPath } from 'url';

import { rootRouter } from './routes/rootRouter.js';

const app = express();
app.use(express.json());
app.use('/', rootRouter);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('../frontend/build'));
  const __dirname = dirname(fileURLToPath(import.meta.url));
  app.get('*', (_, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'));
  });
}

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);
export const session = driver.session();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}.`));
