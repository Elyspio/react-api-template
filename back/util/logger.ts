import * as path from "path";
import * as fs from "fs"
import {createLogger, transport} from "winston";
import * as dayjs from "dayjs"
import {platform} from "os";

Error.stackTraceLimit = 40;

const winston = require('winston');

export const logFolder = process.env.LOG_FOLDER ?? path.resolve(__dirname, "..", "..", "logs");

const dateFormat = () => dayjs().format("DD/MM/YY -- HH:mm:ss")

const getLogFile = (...node: string[]) => path.join(logFolder, ...node)

const getFileNameAndLineNumber = () => {
    let stack = (new Error()).stack;
    let stackUsefull = stack.split("\n").filter(str => !["node_modules", "internal"].some(s => str.includes(s)))
    let line;
    switch (platform()) {
        case "win32":
            line = stackUsefull.find(str => str.indexOf(":\\") !== -1 && !str.includes(path.join("util", "logger")))
            break;
        case "linux":
            line = stackUsefull.find(str => str.startsWith("/", 0) && !str.includes(path.join("util", "logger")))
            break;
    }

    const regex = /at (.*) .*\\(.*\.[jt]s):(.*):/g
    const regexWithoutFuncName = /at [A-Z]:\\.*\\([a-zA-Z]+.[jt]s):([0-9]+)/
    const matchWithFunctionName = Array.from(line?.matchAll(regex))[0];


    let str = "";

    if (matchWithFunctionName === undefined) {
        const match = Array.from(line.matchAll(regexWithoutFuncName))[0];
        let infos = {
            filename: match[1],
            line: match[2]
        }
        str = `${infos.filename} (${infos.line})`;
    } else {
        let infos = {
            func: matchWithFunctionName[1],
            filename: matchWithFunctionName[2],
            line: matchWithFunctionName[3]
        }

        str = `${infos.filename} (${infos.line})`;

        if (!infos.func.includes("anonymous")) {
            str += ` at ${infos.func}`
        }

    }
    return str;
};

const getFormat = () => {

    return winston.format.combine(
        winston.format.metadata({fillExcept: ['message', 'level']}),
        winston.format.printf((info) => {

            const callInfos = getFileNameAndLineNumber()

            const timestamp = dateFormat();
            const objs = Object.keys(info.metadata);

            const objsStr = objs.reduce((acc, now) => `${acc} ${now}=${JSON.stringify(info.metadata[now])}`, "")

            return `${timestamp} | ${info.level.toLocaleUpperCase()} | ${info.message.trim()}${objs.length ? ` |${objsStr} | ` : " | "}${callInfos}`
        }))


    // return winston.format.combine(...formats);
};

function getTransports(service: string): transport[] {
    const transports: transport[] = [];
    const format = getFormat()
    let logPath = path.join(logFolder, service);

    if (!fs.existsSync(logPath)) {
        fs.mkdirSync(logPath, {recursive: true});
    }
    const day = dayjs().format("DD-MM-YYYY")

    transports.push(
        new winston.transports.File({
            filename: getLogFile(service, day, 'combined.log'),
            format
        }),

        new winston.transports.File({
            filename: getLogFile(service, day, 'error.log'),
            level: "error",
            format,
        }),
    )

    transports.push(
        new winston.transports.Console({format})
    )

    return transports;
}


export const loggerConfig = {
    levels: {
        info: 3,
        request: 4,
        debug: 2,
        warning: 1,
        error: 0,
    },
    transports: getTransports("server"),
    level: "request"
}
export const logger = createLogger(loggerConfig)
