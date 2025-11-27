/**
 * Logger utility to control console output
 * Set DEBUG=true in development, false in production
 */

const DEBUG = import.meta.env.DEV; // Only log in development mode

export const logger = {
    log: (...args) => {
        if (DEBUG) console.log(...args);
    },
    warn: (...args) => {
        if (DEBUG) console.warn(...args);
    },
    error: (...args) => {
        // Always log errors
        console.error(...args);
    },
    info: (...args) => {
        if (DEBUG) console.info(...args);
    },
    debug: (...args) => {
        if (DEBUG) console.debug(...args);
    }
};

export default logger;