// IMPORTS
import passport from "passport";
import local from "passport-local";
import GHStrategy from "passport-github2";
import { Strategy as JwtStrategy } from "passport-jwt";
import { ExtractJwt } from "passport-jwt";

import config from "../../config.js";
import UserController from "../../controllers/users.controller.js";
import CustomError from "../errors/CustomErrors.class.js";
import errorsDictionary from "../errors/errrosDictionary.js";

// INIT
const localStrategy = local.Strategy;
const userController = new UserController();

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.JWT_SECRET,
};

// STRATEGIES

const initAuthStrategies = () => {
  // Local login
  passport.use(
    "login",
    new localStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        try {
          const user = await userController.login(username, password);
          if (!user) {
            return done(null, false);
          }
          return done(null, user);
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );
  // Local register
  passport.use(
    "register",
    new localStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        try {
          const user = await userController.create(req.body);
          if (!user) {
            return done(null, false);
          }
          return done(null, user);
        } catch (err) {
          if (err instanceof CustomError && err.type === errorsDictionary.EMAIL_ALREADY_EXISTS) {
            console.log(err);
            return done(null, false, { redirectUrl: `/login?error=${encodeURI("El usuario ya existe")}` });
          } else if (err instanceof CustomError && err.type === errorsDictionary.INVALID_TYPE) {
            return done(null, false, { redirectUrl: `/register?error=${encodeURI("Datos incompletos")}` });
          }
          return done(err, false);
        }
      }
    )
  );

  // Github login
  passport.use(
    "ghlogin",
    new GHStrategy(
      {
        clientID: config.GITHUB_CLIENT_ID,
        clientSecret: config.GITHUB_CLIENT_SECRET,
        callbackURL: config.GITHUB_CALLBACK_URL,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          const email = profile._json?.email || null;

          if (email) {
            const foundUser = await userController.getOne({ email: email });

            if (!foundUser) {
              const user = {
                first_name: profile._json.name.split(" ")[0],
                last_name: profile._json.name.split(" ")[1],
                email: email,
                password: "none",
              };
              const process = await userController.create(user);

              return done(null, process);
            } else {
              return done(null, foundUser);
            }
          } else {
            return done(new Error("Faltan datos de perfil"), null);
          }
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );

  // Verify JWT
  passport.use(
    "jwt",
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        const user = await userController.getById(jwt_payload.id);
        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};

export default initAuthStrategies;
