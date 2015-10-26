import koa from 'koa';
import body from 'koa-body';
import cors from 'kcors';
import helmet from 'koa-helmet';
import auth from './auth';
import router from './router';

const app = koa();

app.experimental = true;
app.proxy = true;

app.use(body({ multipart: true }));
app.use(cors());
app.use(helmet());

auth(app);
router(app);

app.listen(process.env.PORT || 3000, () => {
  /* eslint-disable no-console */
  console.log('listening');
  /* eslint-enable no-console */
});
