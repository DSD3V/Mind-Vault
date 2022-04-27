import { Router } from 'express';

import mind from './mind.js';
import thought from './thought.js';
import vault from './vault.js';

export const rootRouter = Router();

rootRouter.use('/mind', mind);
rootRouter.use('/thought', thought);
rootRouter.use('/vault', vault);
