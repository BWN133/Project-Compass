import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";
import FFRoutes from "./Routers/foldersAndFiles";
import * as FFModel from "./models/folder";

const app = express();

app.use(morgan('dev'));

app.use(express.json());


// TODO: File object upload
// TODO: User upload 
// TODO: Mission 

// app.get("/", async (req, res) => {

//     const foldersAndFiles = await FFModel.FolderModel.find({});
//     res.status(200).json(foldersAndFiles);
// });

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