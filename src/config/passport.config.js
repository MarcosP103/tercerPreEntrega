import passport from "passport";
import GitHubStrategy from "passport-github2";
import local from "passport-local";
import userService from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";

const LocalStrategy = local.Strategy

const initializePassport = () => {
  
  passport.use("github", new GitHubStrategy({
        clientID: "Iv23liSYHTwwlrcbPS9c",
        clientSecret: "8ed53d3b958654e51a1a38e29199f257400ce30f",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },async (accessToken, refreshToken, profile, done) => {
        try {
          console.log(profile);

          if (!profile._json.email) {
            return done(null, false, {
              message:
                "El email no fue otorgado por GitHub. Por favor, complete su perfil.",
            });
          }

          let user = await userService.findOne({ email: profile._json.email });
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
            let result = await userService.create(newUser);
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

  passport.use("register", new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" }, async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {

          if (!first_name || !last_name || !email || !age || !password) {
            return done(null, false, {
              message: "Todos los campos son requeridos",
            });
          }

          const existingUser = await userService.findOne({ email: username });
          if (existingUser) {
            return done(null, false, { message: "El email ya existe" });
          }

          const newUser = new userService({
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
  
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await userService.findById(id);
    done(null, user);
  });
};

passport.use("login", new LocalStrategy({ usernameField: "email" }, async (username, password, done) => {
        try {
          const user = await userService.findOne({ email: username });
          if (!user) {
            return done(null, false, { message: "Usuario no encontrado" });
          }
          if (!isValidPassword(user, password)) return done(null, false, { message: "Password incorrecta" });
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );


export default initializePassport;
