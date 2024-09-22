import passport from "passport";
import GitHubStrategy from "passport-github2";
import local from "passport-local";
import userService from "../dao/models/user.model.js";
import cartsModel from "../dao/models/carts.model.js";
import { createHash, isValidPassword } from "../utils.js";

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.use("github", new GitHubStrategy({
        clientID: "Iv23liSYHTwwlrcbPS9c",
        clientSecret: "8ed53d3b958654e51a1a38e29199f257400ce30f",
        callbackURL: "http://localhost:8080/api/users/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile._json.email || `${profile.username}@github.com`;
          let user = await userService.findOne({ email });

          if (!user) {
            const firstName = profile._json.name || profile.username;
            const role = email.includes("@admin") ? "admin" : "user";

            const newCart = new cartsModel({ products: [] })
            await newCart.save()

            let newUser = {
              first_name: firstName,
              last_name: "",
              age: null,
              email: email,
              password: "",
              cartId: newCart._id,
              role: role,
            };

            let result = await userService.create(newUser);
            return done(null, result);
          } else {
            return done(null, user);
          }
        } catch (error) {
          console.error("Error procesando la autenticacion:", error);
          return done(error);
        }
      }
    )
  );

  passport.use("register", new LocalStrategy({ passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        
        try {
          if (!email) {
            console.log("El email es requerido");
            return done(null, false, { message: "El email es requerido" });
          }

          let user = await userService.findOne({ email });
          if (user) {
            console.log("El usuario ya existe");
            return done(null, false, { message: "El usuario ya existe" });
          }  
          const newUser = new userService({
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            role: email.includes("@admin") ? "admin" : "user",
          });
  
          await newUser.save()
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
    if(user) {
      user.last_connection = new Date()
      await user.save()
    }
    done(null, user);
  });

  passport.use("login", new LocalStrategy({ usernameField: "email" },
      async (username, password, done) => {
        try {
          console.log(`Intentando iniciar sesión con email: ${username}`);
          
          const user = await userService.findOne({ email: username });
          if (!user) {
            console.log("El usuario no existe");
            return done(null, false, {message: "El usuario no existe" });
          }

          if (!isValidPassword(user, password)){
            console.log('Contraseña incorrecta')
            return done(null, false, { message: "Contraseña incorrecta" })
          };

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

export default initializePassport;
