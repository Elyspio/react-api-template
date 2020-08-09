import E, {Express} from "express"
import {router as torrents} from "./routes/example";
import {middlewares} from "./middleware/middleware";
import {ArgumentParser} from 'argparse'
import path from "path";

const express = require('express');
export const app: Express = express();

app.use(...middlewares);
app.use('/example', torrents);

app.use("/", E.static(path.resolve(__dirname, "..", "front", "build")))


if (require.main === module) {
    const parser = new ArgumentParser();
    parser.addArgument("--port", {type: "int", defaultValue: 4000})
    const args: { port: number } = parser.parseArgs();

    app.listen(args.port, () => {
        console.log("Starting server on port", args.port);
    })
}





