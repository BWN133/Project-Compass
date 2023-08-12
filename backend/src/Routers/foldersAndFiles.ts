import express from "express";
import * as FFController from "../Controllers/foldersAndFiles";
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import env from "../util/validateEnv";
const router = express.Router();

const storage = new GridFsStorage({
    url: env.MONGO_CONNECTION_STRING,
    // options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            const fileInfo = {
                bucketName: 'uploads',
            };
            resolve(fileInfo);
        });
    }
});


const upload = multer({ storage });

router.get("/", FFController.GetHomeFolder);

router.post("/folder", FFController.createFolder);

router.post("/file", upload.single('fileContent'), FFController.createFile);

// router.post("/files", upload.array('filesContent'), FFController.createMultipleFiles);
// router.get("/folder/:parentId", FFController.GetFileFromParentCached, FFController.GetFileFromParent);

router.get("/folder/:parentId", FFController.GetFileFromParent);

router.get("/folderG/:parentId", FFController.GetGrandParentFolder);

router.get("/file/:fileId", FFController.GetFileDataCached, FFController.GetFile);

router.delete("/folder", FFController.deleteItem);

router.delete("/", FFController.DeleteAll);


router.patch("/folder", FFController.renameItem);

// TODO: change to a post request
router.post("/openai", FFController.getOpenaiResponse);

export default router;