import * as FFModel from "../models/folderAndFiles";
import { NextFunction, RequestHandler } from "express";
import createHttpError from "http-errors";
import { isValidObjectId, Schema, ObjectId } from "mongoose";
import { assertIsDefined } from "../util/assertIsDefined";
import multer from "multer";
import env from "../util/validateEnv";
import { getCache } from '../cache'
import { parse, stringify, toJSON, fromJSON } from 'flatted';
import getResponse from "../util/openaiConnection";

// TODO: Test create with postman


export const fileType = ["img", "txt"];

interface CreateFolderBody {
    title?: string,
    parentId?: string,
}

export const createFolder: RequestHandler<unknown, unknown, CreateFolderBody, unknown> = async (req, res, next) => {
    //TODO:  Authentication
    const title = req.body.title;
    const parentId = req.body.parentId;
    console.log("Here is title recieved: ", title);
    console.log("here is parentId recieved;", parentId);
    try {
        if (!title) {
            throw createHttpError(400, "Folder must have a title");
        }
        const foldersAndFiles = await FFModel.FolderModel.create({
            userId: undefined,
            title: title,
            parentId: parentId,
            objectType: "FOLDER",
        });

        res.status(201).json(foldersAndFiles);
    } catch (error) {
        next(error);
    }
};

export const DeleteAllFolders: RequestHandler = async (req, res, next) => {
    const cache = await getCache();
    try {
        await FFModel.FolderModel.remove({});
        await cache.flushDb;
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

export const DeleteAll: RequestHandler = async (req, res, next) => {
    const cache = await getCache();
    try {
        await FFModel.BaseModel.remove({});
        await FFModel.uploadMetaModel.remove({});
        await FFModel.chunkModel.remove({});
        await cache.flushDb;
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

interface CreateFileBody {
    parentId?: string,
}

export const createFile: RequestHandler<unknown, unknown, CreateFileBody, unknown> = async (req, res, next) => {
    //TODO:  Authentication
    const cache = await getCache()

    const parentId = req.body.parentId;

    try {
        if (!isValidObjectId(parentId)) {
            throw createHttpError(400, "Invalid parent Id");
        }
        const parentFolder = await FFModel.FolderModel.findById(parentId);
        if (!parentFolder || parentFolder.objectType == "FILE") {
            throw createHttpError(400, "Incorrecrt parent ID");
        }
        if (!req.file) {
            throw createHttpError(400, "Please provide a file and filetype");
        }
        const title = req.file.originalname;
        const foldersAndFiles = await FFModel.FileModel.create({
            userId: undefined,
            title: title,
            parentId: parentId,
            fileMeta: req.file.filename,
            objectType: "FILE",
        });
        // cache metaFileData
        const metaFileId = foldersAndFiles._id;
        const fileId = metaFileId + "";
        const fileName = foldersAndFiles.title;
        const fileIdName = fileId + fileName;
        cache.set(fileIdName, JSON.stringify(foldersAndFiles), {
            EX: 300,
            NX: true,
        });
        console.log("save meta file data to redis");
        res.status(201).json(foldersAndFiles);
    } catch (error) {
        next(error);
    }
};

export const getParentFolder: RequestHandler = async (req, res, next) => {
    const parentId = env.DEFAULTPAGE_PARENTID;
    try {
        if (!isValidObjectId(parentId)) {
            throw createHttpError(400, "Invalid file id");
        }
        const result = await GetFileFromParentHelper(parentId, next);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export const GetGrandParentFolder: RequestHandler = async (req, res, next) => {
    const folderId = req.params.parentId;
    try {
        if (!isValidObjectId(folderId)) {
            throw createHttpError(400, "Invalid file id");
        }
        const currentFolderMeta = await FFModel.FolderModel.findById(folderId);
        if (!currentFolderMeta) {
            throw createHttpError(400, "Parent Folder Does not Exist");
        }
        const result = await GetFileFromParentHelper(currentFolderMeta.parentId.toString(), next);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

//TODO: take in file object, return file Data
const getFileHelper = async (file: FFModel.File, id: string) => {
    if (!file) {
        throw createHttpError(404, "File not found");
    }

    const fileMeta = await FFModel.uploadMetaModel.find({ filename: file.fileMeta });
    if (!fileMeta) {
        throw createHttpError(404, "File content missing");
    }
    const fileContents = await FFModel.chunkModel.find({ files_id: fileMeta[0]._id });//.sort("-postDate")
    if (!fileContents[0].data) {
        throw createHttpError(404, "File data missing in Chunk");
    }
    const resultFileData = {
        _id: id,
        parentId: file.parentId,
        objectType: file.objectType,
        title: file.title,
        fileContent: fileContents[0].data,
    };
    return resultFileData;
}

// get fileData from redis
export const GetFileDataCached: RequestHandler = async (req, res, next) => {
    const cache = await getCache()
    const fileId = req.params.fileId + "";
    let resultFileDataRedis;
    try {
        const result = await cache.get(fileId);
        if (result) {
            resultFileDataRedis = JSON.parse(result);
            console.log("get resultFileData from redis");
            res.status(200).json(resultFileDataRedis);
        } else {
            next();
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
}


export const GetFile: RequestHandler = async (req, res, next) => {
    // TODO: Authentication
    const fileId = req.params.fileId + "";
    const cache = await getCache();

    try {
        if (!isValidObjectId(fileId)) {
            throw createHttpError(400, "Invalid file id");
        }

        const file = await FFModel.FileModel.findById(fileId);

        const resultFileData = await getFileHelper(<FFModel.File>file, fileId);
        cache.set(fileId, JSON.stringify(resultFileData), {
            EX: 300,
            NX: true,
        });
        console.log("save resultFileData to redis");
        console.log("get resultFileData from mongodb");
        res.status(200).json(resultFileData);
    } catch (error) {
        next(error);
    }
};


export const GetFileFromParent: RequestHandler = async (req, res, next) => {
    const parentId = req.params.parentId;
    try {
        if (!isValidObjectId(parentId)) {
            throw createHttpError(400, "Invalid file id");
        }
        console.log("run GetFileFromParent");
        const result = await GetFileFromParentHelper(parentId, next);
        // const result = await CacheFileFromParent(parentId, next);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export const GetHomeFolder: RequestHandler = async (req, res, next) => {
    const parentId = env.DEFAULTPAGE_PARENTID;
    try {
        if (!isValidObjectId(parentId)) {
            throw createHttpError(400, "Invalid file id");
        }

        const result = await GetFileFromParentHelper(parentId, next);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}


export const GetFileFromParentHelper = async (parentId: string, next: NextFunction) => {
    const cache = await getCache();
    try {
        if (!isValidObjectId(parentId)) {
            throw createHttpError(400, "Invalid file id");
        }
        const subFileCursor = FFModel.BaseModel.find({ parentId: parentId }).cursor();
        const result = [];
        for (let document = await subFileCursor.next(); document != null; document = await subFileCursor.next()) {
            if (document.objectType == 'FOLDER') {
                result.push(document);
            } else {
                const fileResult = await getFileHelper(<FFModel.File>document, document.id);
                result.push(fileResult);
            }
        }
        console.log("save FileFromParent result to redis");
        // console.log("result[]: " + result);
        cache.set(parentId + "FileFromParent", JSON.stringify(result), {
            EX: 300,
            NX: true,
        });
        return result;
        return {};
    } catch (error) {
        next(error);
    }
}

/* 
export const deleteFile: RequestHandler = async (req, res, next) => {
    const objectId = req.params.objectId;
    try {
        if (!isValidObjectId(objectId)) {
            throw createHttpError(400, "Invalid note id");
        }
        const file = await FFModel.FileModel.findById((objectId));
        if (!file) {
            throw createHttpError(404, "File not found");
        }
        await deleteFileHelper(file);
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
}
 */

const deleteFile = async (file: FFModel.File) => {
    if (!file) {
        throw createHttpError(404, "File not found");
    }
    const fileMeta = await FFModel.uploadMetaModel.find({ filename: file.fileMeta });
    if (!fileMeta) {
        throw createHttpError(404, "File content missing");
    }
    const fileContentsCursor = FFModel.chunkModel.find({ files_id: fileMeta[0].id }).cursor();
    for (let document = await fileContentsCursor.next(); document != null; document = await fileContentsCursor.next()) {
        document.remove();
    }
    fileMeta[0].remove();
    return
};

const deleteFolder = async (parentId: string) => {

    if (!isValidObjectId(parentId)) {
        throw createHttpError(400, "Folder not found");
    }
    const subFoldersAndFilesCursor = FFModel.BaseModel.find({ parentId: parentId }).cursor();
    //can not recursively delete, need to cbhange this to helper function and make delete tecursive 
    for (let document = await subFoldersAndFilesCursor.next(); document != null; document = await subFoldersAndFilesCursor.next()) {
        if (document.objectType == 'FOLDER') {
            deleteFolder(document._id.toString());
        } else {
            deleteFile(<FFModel.File>document);
        }
        document.remove();
    }
}

interface DeleteItemBody {
    objectId: string
}

export const deleteItem: RequestHandler<unknown, unknown, DeleteItemBody, unknown> = async (req, res, next) => {
    // TODO: Authentication
    const objectId = req.body.objectId;
    console.log(objectId);
    try {
        if (!isValidObjectId(objectId)) {
            throw createHttpError(400, "Invalid id");
        }
        const object = await FFModel.BaseModel.findById(objectId);
        if (!object) {
            throw createHttpError(404, "Item not found");
        }
        if (object.objectType == 'FILE') {
            await deleteFile(<FFModel.File>object);
        } else {
            await deleteFolder(objectId);
        }
        await object.remove();
        console.log("sueccessfully deleted");
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
}

// export const CacheFileFromParent  = async (parentId: string, next: NextFunction) => {
//     const cache = await getCache();
//     try {
//         if (!isValidObjectId(parentId)) {
//             throw createHttpError(400, "Invalid file id");
//         }
//         // const subFileResult = await cache.get(parentId + "FileFromParent");
//         const subFileResult = await cache.get(parentId + "FileFromParent");
//         console.log("mongodb or redis?");
//         if (subFileResult) {
//         console.log("get subFileResult from redis");

//         const result = JSON.parse(subFileResult);
//         // console.log("result[]: " + result);
//         return result;
//         return {}; } else {
//             console.log("get FileFromParent from mongodb");

//             return await GetFileFromParentHelper(parentId, next);
//         }

//     } catch (error) {
//         next(error);
//     }
// }


// get fileData from redis
export const GetFileFromParentCached: RequestHandler = async (req, res, next) => {
    const cache = await getCache()
    const parentId = req.params.parentId;
    let resultFileDataRedis;
    try {
        const result = await cache.get(parentId + "FileFromParent");
        if (result) {
            console.log("Successfully get Data from cache");
            resultFileDataRedis = JSON.parse(result);
            res.status(200).json(resultFileDataRedis);
        } else {
            next();
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
}

interface RenameItemBody {
    objectId?: string
    title?: string
}

export const renameItem: RequestHandler<unknown, unknown, RenameItemBody, unknown> = async (req, res, next) => {
    const { objectId: objectId, title: title } = req.body;
    try {
        if (!isValidObjectId(objectId)) throw createHttpError(400, "Invalid item ID");
        if (!title) throw createHttpError(400, "Item must have a title");

        const item = await FFModel.BaseModel.findById(objectId);

        if (!item) throw createHttpError(404, "Item not found");

        item.title = title;
        res.status(200).json(await item.save());
    } catch (error) {
        next(error);
    }
}

// TODO: create new folders with the response
interface getOpenaiResponseBody {
    title?: string,
    description?: string
}

export const getOpenaiResponse: RequestHandler<unknown, unknown, getOpenaiResponseBody, unknown> = async (req, res, next) => {
    const { title: title, description: description } = req.body
    try {
        if (!title) throw createHttpError(400, "Project must have a name");
        if (!description) throw createHttpError(400, "Project must have a description");

        const response = await getResponse(title, description)

        res.status(200).json(response.data.choices[0].message?.content);
    } catch (error) {
        next(error);
    }
}