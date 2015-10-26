import passport from 'koa-passport';
import { Strategy as JwtStrategy } from 'passport-jwt';

const options = {
  secretOrKey: 'secret',
  issuer: 'localhost:3000',
  adience: 'localhost:3000',
};

passport.use(new JwtStrategy(options, function verify(payload, done) {
  if (payload.id) {
    done(null, { id: payload.sub });
  } else {
    done(null, false);
  }
}));
