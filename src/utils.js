import { fileURLToPath } from 'url'
import { dirname } from 'path'
import bcrypt from 'bcryptjs'

export const __filename = fileURLToPath(import.meta.url)
export const __dirname = dirname(__filename)
export const createHash = password => bcrypt.hashSync( password, bcrypt.genSaltSync(10) )

export const isValidPassword = async (user, password) => {
    if (!user.password || !password) {
        throw new Error("Las contraseñas no pueden ser indefinidas o nulas.");
    }
    return bcrypt.compare(password, user.password);
}

export const isSamePassword = async (inputPassword, storedPassword) => {
    if (!inputPassword || !storedPassword) {
        throw new Error("Las contraseñas no pueden ser indefinidas o nulas.");
    }
    return bcrypt.compare(inputPassword, storedPassword);
}