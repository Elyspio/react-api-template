import express, {Response} from "express"
import {logger} from "../util/logger";

const cors = require("cors");
export const middlewares: any[] = [];

let logRequest = (req: express.Request, res: express.Response, next: Function) => {
    logger?.log("request", undefined, {
        method: req.method,
        url: req.originalUrl,
        from: req.hostname,
        data: req.method === "get" ? req.params : req.body
    })
    next();
};

let logOutput = (req: express.Request, res: express.Response, next: Function) => {

    const send = res.json;

    res.json = (obj: any): any => {
        logger.log("send", undefined, {
            to: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            uri: req.url,
            data: obj
        });

        send.apply(res, obj);
    }

    if(next) next();
};

middlewares.push(logRequest, logOutput)


middlewares.push(...[
    express.json(),
    express.urlencoded({extended: false}),
    cors()
])



