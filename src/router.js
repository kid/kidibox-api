import Router from 'koa-router';
import { authenticate } from './auth';
import * as torrents from './torrents';
import * as users from './users';

export default function register(app) {
  const router = new Router();

  users.register(router);
  torrents.register(router, authenticate);

  app.use(router.middleware());
}

