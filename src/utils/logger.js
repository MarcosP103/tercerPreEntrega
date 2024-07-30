import winston from "winston";
import dotenv from 'dotenv';

dotenv.config();

const customLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5,
    },
    colors: {
        fatal: "bold red",
        error: "red",
        warning: "yellow",
        info: "green",
        http: "magenta",
        debug: "blue",
    }
};

winston.addColors(customLevels.colors);

const devFormat = winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.simple()
);

const prodFormat = winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json()
);

const devLogger = winston.createLogger({
    levels: customLevels.levels,
    format: devFormat,
    transports: [
        new winston.transports.Console({ level: "debug" })
    ]
});

const prodLogger = winston.createLogger({
    levels: customLevels.levels,
    format: prodFormat,
    transports: [
        new winston.transports.Console({ level: "info" }),
        new winston.transports.File({ filename: "./errors.log", level: "error" })
    ]
});

const logger = process.env.LOGGER_ENV === 'production' ? prodLogger : devLogger;

export const addLogger = (req, res, next) => {
    req.logger = logger;
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleString()}`);
    next();
};

export default logger;
