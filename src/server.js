import koa from 'koa';
import body from 'koa-body';
import cors from 'kcors';
import helmet from 'koa-helmet';
import passport from 'koa-passport';
import router from './router';

const app = koa();
app.experimental = true;
app.proxy = true;

require('./auth');

// router.post('/custom', function *custom(next) {
//   const ctx = this;
//   yield passport.authenticate('jwt', { session: false }, function *authenticate(err, user, info) {
//     console.log(err, user, info);
//     if (err) throw err;
//     if (user === false) {
//       ctx.status = 401;
//       ctx.body = { success: false };
//     } else {
//       yield ctx.login(user);
//       ctx.body = { success: true };
//     }
//   }).call(this, next);
// });

// router.post('/register', async function register() {
//   const service = new UserService();
//   const repository = new UserRepository();

//   const user = {
//     name: 'kid',
//     passwordHash: await service.hashPassword('foobar'),
//   };

//   console.log(user.passwordHash);

//   this.body = await repository.create(user);
// });

// router.post('/login', async function login() {
//   const repository = new UserRepository();
//   const service = new UserService();

//   const user = await repository.findByName('kid');
//   console.log(user);
//   const result = await service.verifyPassword(user, 'foobar');
//   console.log(result);

//   const options = {
//     expiresIn: '7d',
//     audience: 'localhost:3000',
//     issuer: 'localhost:3000',
//     subject: user.id,
//   };

//   this.body = { token: jwt.sign({}, 'secret', options) };
// });

app.use(cors());
app.use(body());
app.use(helmet());
app.use(passport.initialize());
app.use(router.middleware());

app.listen(process.env.PORT || 3000, () => { console.log('started'); });
