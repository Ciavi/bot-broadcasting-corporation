import * as log4js from "log4js";
import * as log4jsconf from "../log4js.json";

export default class Logger {
    public file: log4js.Logger;
    public terminal: log4js.Logger;

    constructor() {
        log4js.configure(log4jsconf);
        this.file = log4js.getLogger("file");
        this.terminal = log4js.getLogger("console");
    }

    public trace(format: string, ...args: string[]) {
        this.file.trace(format, args);
        this.terminal.trace(format, args);
    }

    public debug(format: string, ...args: string[]) {
        this.file.debug(format, args);
        this.terminal.debug(format, args);
    }

    public info(format: string, ...args: string[]) {
        this.file.info(format, args);
        this.terminal.info(format, args);
    }

    public warn(format: string, ...args: string[]) {
        this.file.warn(format, args);
        this.terminal.warn(format, args);
    }

    public error(format: string, ...args: string[]) {
        this.file.error(format, args);
        this.terminal.error(format, args);
    }

    public fatal(format: string, ...args: string[]) {
        this.file.fatal(format, args);
        this.terminal.fatal(format, args);
    }
}
