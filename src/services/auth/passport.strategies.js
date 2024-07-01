// IMPORTS
import passport from "passport";
import local from "passport-local";
import GHStrategy from "passport-github2";

import config from "../../config.js";
import { createUser, getOneUser, loginUser } from "../../controllers/users.controller.js";

// INIT
const localStrategy = local.Strategy;

// STRATEGIES

const initAuthStrategies = () => {
  // Local login
  passport.use(
    "login",
    new localStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        try {
          const user = await loginUser(username, password);
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
          const user = await createUser(req.body);
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
            const foundUser = await getOneUser({ email: email });

            if (!foundUser) {
              const user = {
                first_name: profile._json.name.split(" ")[0],
                last_name: profile._json.name.split(" ")[1],
                email: email,
                password: "none",
              };

              const process = await createUser(user);

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

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};

export default initAuthStrategies;
