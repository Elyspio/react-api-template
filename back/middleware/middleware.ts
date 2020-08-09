import express from "express"
import {logger} from "../util/logger";

const cors = require("cors");
export const middlewares : any[] = [];

middlewares.push((req: express.Request,  res: express.Response, next: Function) => {
    logger?.log("request", undefined, {
        method: req.method,
        url: req.originalUrl,
        from: req.hostname,
        data: req.method === "get" ? req.params : req.body
    })
    next();
})



middlewares.push(...[
    express.json(),
    express.urlencoded({extended: false}),
    cors()
])



