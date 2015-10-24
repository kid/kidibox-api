import Router from 'koa-router';
import * as torrents from './torrents';

const router = new Router();

torrents.register(router);

export default router;
