import koa from 'koa';
import cors from 'kcors';
import helmet from 'koa-helmet';
import router from './router';

const app = koa();
app.experimental = true;

app.use(cors());
app.use(helmet());
app.use(router.routes(), router.allowedMethods());

app.listen(3000, function onStarted() {
  /* eslint-disable no-console */
  console.log('Server started.');
  /* eslint-enable no-console */
});
