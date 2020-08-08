import {Express} from "express"
import {router as torrents} from "./routes/example";
import {middlewares} from "./middleware/middleware";
import {ArgumentParser} from 'argparse'

const express = require('express');
export const app: Express = express();

app.use(...middlewares);
app.use('/example', torrents);

if (require.main === module) {
    const parser = new ArgumentParser();
    parser.addArgument("--port", {type: "int", defaultValue: 4444})
    const args: { port: number } = parser.parseArgs();

    app.listen(args.port, () => {
        console.log("Starting server on port", args.port);
    })
}





