import logger from "../utils/logger.js";

export const loggerTestR = (req, res) => {
    const environment = process.env.LOGGER_ENV || 'development'; 
    res.render("loggerTest", { environment });
};

export const testLogger = (req, res) => {
    const { environment = 'development', logType } = req.body; 
    
    console.log(`Tipo de logger recibido: ${logType}`);
    console.log(`Entorno recibido: ${environment}`);

    if (environment === 'production' && ['debug', 'http'].includes(logType)) {
        return res.status(403).json({ message: `El tipo de log ${logType} no está permitido en producción.` });
    }

    switch (logType) {
        case "debug":
            logger.debug("Este es un mensaje de debug");
            break;
        case "http":
            logger.http("Este es un mensaje de http");
            break;
        case "info":
            logger.info("Este es un mensaje de info");
            break;
        case "warning":
            logger.warning("Este es un mensaje de warning");
            break;
        case "error":
            logger.error("Este es un mensaje de error");
            break;
        case "fatal":
            logger.fatal("Este es un mensaje de fatal");
            break;
        default:
            logger.info("Tipo de logger no especificado");
    }
    
    res.status(200).json({ message: `Log de tipo ${logType} generado en entorno ${environment}. Revisa la consola y el archivo de errores si estás en producción.` });
};
