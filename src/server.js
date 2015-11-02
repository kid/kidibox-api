import fs from 'fs';
import spdy from 'spdy';
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


const options = {
  key: fs.readFileSync(process.env.SSL_CERTIFICATE_KEY || 'server.key'),
  cert: fs.readFileSync(process.env.SSL_CERTIFICATE || 'server.crt'),
};

spdy.createServer(options, app.callback()).listen(process.env.PORT || 8080, () => {
  /* eslint-disable no-console */
  console.log(`listening on port ${process.env.PORT || 8080}`);
  /* eslint-enable no-console */
});
