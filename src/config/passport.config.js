import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as LocalStrategy } from "passport-local";
import userModel from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";

const initializePassport = () => {
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv23liSYHTwwlrcbPS9c",
        clientSecret: "8ed53d3b958654e51a1a38e29199f257400ce30f",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log(profile);

          if (!profile._json.email) {
            return done(null, false, {
              message:
                "El email no fue otorgado por GitHub. Por favor, complete su perfil.",
            });
          }

          let user = await userModel.findOne({ email: profile._json.email });
          if (!user) {
            /* const nameParts = profile._json.name.split(' ');
                const first_name = nameParts[0];
                const last_name = nameParts.slice(1).join(' ') || "N/A"; */

            let newUser = {
              first_name: profile._json.name || profile.username,
              last_name: profile._json.last_name || profile.usaername,
              age: null,
              email: profile._json.email,
              password: createHash("defaultpassword"),
            };
            let result = await userModel.create(newUser);
            done(null, result);
          } else {
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        try {
          const { first_name, last_name, email, age } = req.body;

          if (!first_name || !last_name || !email || !age || !password) {
            return done(null, false, {
              message: "Todos los campos son requeridos",
            });
          }

          const existingUser = await userModel.findOne({ email });
          if (existingUser) {
            return done(null, false, { message: "El email ya existe" });
          }

          const newUser = new userModel({
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
          });
          await newUser.save();
          return done(null, newUser);
        } catch (error) {
          return done("Error al obtener el usuario" + error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await userModel.findOne({ email });
          if (!user) {
            return done(null, false, { message: "Usuario no encontrado" });
          }
          if (!isValidPassword(user, password))
            return done(null, false, { message: "Password incorrecta" });
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await userModel.findById(id);
    done(null, user);
  });
};

export default initializePassport;
