import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";
import FFRoutes from "./Routers/foldersAndFiles";
import userRouters from "./Routers/users"
import session from "express-session";
import env from "./util/validateEnv";
import MongoStore from "connect-mongo";
const app = express();

app.use(morgan('dev'));

app.use(express.json());



app.use(session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 1000,
    },
    rolling: true,
    store: MongoStore.create({
        mongoUrl: env.MONGO_CONNECTION_STRING
    }),
}))


app.use("/api/users", userRouters);




app.use("/api/FF", FFRoutes);




app.use((req, res, next) => {
    next(createHttpError(404, "Endpoint not found"));
});


// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    let errorMessage = "An unknown error occurred";
    let statusCode = 500;
    if (isHttpError(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode).json({ error: errorMessage });
});

export default app;