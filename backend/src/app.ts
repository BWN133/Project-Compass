import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";
import FFRoutes from "./Routers/foldersAndFiles";
import * as FFModel from "./models/folder";
import fs from "fs";

const app = express();

app.use(morgan('dev'));

app.use(express.json());


// TODO: File object upload
// TODO: User upload 
// TODO: Mission 

// app.get("/", async (req, res) => {
//     const folder = new FFModel.FolderModel({
//         title: "test saved 1",
//     });

//     folder.save((err, savedOrder) => {
//         console.log(JSON.stringify(savedOrder));
//     });
//     console.log(process.cwd());

//     const img = fs.readFileSync('./img1.jpeg');
//     // const encode_image = img.toString('base64');
//     const file = new FFModel.FileModel({
//         title: "test saved img 1",
//         fileType: "Img",
//         fileContent: img,
//     });
//     file.save((err, savedOrder) => {
//         console.log(JSON.stringify(savedOrder));
//     });
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