import Router from 'koa-router';
import * as torrents from './torrents';
import * as users from './users';

const router = new Router();

torrents.register(router);
users.register(router);

export default router;
