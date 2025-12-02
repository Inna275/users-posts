import { buildApp } from './app.js';
import { PORT } from './consts.js';

const app = await buildApp();

app.listen({ host: '0.0.0.0', port: process.env.PORT || PORT });
