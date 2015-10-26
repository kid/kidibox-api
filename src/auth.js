import passport from 'koa-passport';
import { Strategy as JwtStrategy } from 'passport-jwt';

const options = {
  secretOrKey: 'secret',
  issuer: 'localhost:3000',
  adience: 'localhost:3000',
};

export default function register(app) {
  app.use(passport.initialize());

  passport.use(new JwtStrategy(options, function verify(payload, done) {
    if (payload.sub) {
      done(null, { id: payload.sub });
    } else {
      done(null, false);
    }
  }));
}

export const authenticate = passport.authenticate('jwt', { session: false });
