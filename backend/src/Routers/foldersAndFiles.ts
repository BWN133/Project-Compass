import express from "express";
import * as FFController from "../Controllers/foldersAndFiles";
import multer from "multer";
import {GridFsStorage} from "multer-gridfs-storage";
import env from "../util/validateEnv";
const router = express.Router();

const storage = new GridFsStorage({
    url: env.MONGO_CONNECTION_STRING,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
          const fileInfo = {
            bucketName: 'uploads'
          };
          resolve(fileInfo);
      });
    }
  });

  
const upload = multer({storage});

router.get("/", FFController.GetHomeFolder);

router.post("/folder", FFController.createFolder);

router.post("/file", upload.single('fileContent'), FFController.createFile);

router.get("/folder/:parentFieldId",FFController.GetFileFromParent);

router.get("/folderG/:parentFieldId", FFController.GetGrandParentFolder);

router.get("/file/:fileId", FFController.GetFile);

router.delete("/folder/:objectId", FFController.deleteFolder);

router.delete("/",  FFController.DeleteAll);



export default router;

export default router;