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
  


router.get("/", FFController.GetAllFoldersAndFiles);

router.get("/test", FFController.testGetImg);

router.post("/folder", FFController.createFolder);

router.post("/file", upload.single('fileContent'), FFController.createFile);

router.get("/folder",FFController.GetAllFolders);

router.get("/file", FFController.GetAllFiles);

router.get("/:objectId", FFController.GetFF);

router.delete("/:objectId", FFController.DeleteFF);

router.delete("/",  FFController.DeleteAll);



export default router;
