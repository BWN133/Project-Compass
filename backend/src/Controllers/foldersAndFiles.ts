import * as FFModel from "../models/folderAndFiles";
import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose, {Schema} from "mongoose";
import { assertIsDefined } from "../util/assertIsDefined";
import multer from "multer";
// TODO: Test create with postman

export const fileType = ["img","txt"];

interface CreateFolderBody{
    title?: string,
    parentId?: string,
}


export const createFolder: RequestHandler<unknown, unknown, CreateFolderBody, unknown>  = async(req, res, next) => {
    //TODO:  Authentication
    const title = req.body.title;
    const parentId = req.body.parentId;
    
    try{
        if (!title) {
            throw createHttpError(400, "Note must have a title");
        }
        const foldersAndFiles = await FFModel.FolderModel.create({
            userId: undefined ,
            title: title,
            parentId: parentId,
            
        });
        res.status(201).json(foldersAndFiles);
    }catch(error){
        next(error);
    }
};

export const DeleteAllFolders: RequestHandler = async(req, res, next)=> {
    try{
        await FFModel.FolderModel.remove({});
        res.sendStatus(204);
    }catch(error){
        next(error);
    }
};

export const DeleteAll: RequestHandler = async(req, res, next)=> {
    try{
        await FFModel.BaseModel.remove({});
        await FFModel.uploadMetaModel.remove({});
        await FFModel.chunkModel.remove({});
        res.sendStatus(204);
    }catch(error){
        next(error);
    }
};




interface CreateFileBody{
    parentId?: string,
    title?: string,
}


export const createFile: RequestHandler<unknown, unknown, CreateFileBody, unknown>  = async(req, res, next) => {
    //TODO:  Authentication
    const title = req.body.title;
    const parentId = req.body.parentId;
    try{
        if (!title) {
            throw createHttpError(400, "Note must have a title");
        }
        if(!req.file){
            throw createHttpError(400, "Please provide a file and filetype")
        }
        console.log(req.file.filename);
        const foldersAndFiles = await FFModel.FileModel.create({
            userId: undefined ,
            title: title,
            parentId: parentId,
            fileMeta: req.file.filename
        });
        res.status(201).json(foldersAndFiles);
    }catch(error){
        next(error);
    }
};

// TODO: GetAll 
export const GetAllFoldersAndFiles: RequestHandler = async(req, res, next) => {
    //TODO:  Authentication
    try{
        // const parentId = req.params.parentId;
        const foldersAndFiles = await FFModel.BaseModel.find({}).exec();
        res.status(200).json(foldersAndFiles);
    }catch(error){
        next(error);
    }
};


export const testGetImg: RequestHandler = async(req, res, next) => {
    //TODO:  Authentication
    try{
        // const parentId = req.params.parentId;
        const foldersAndFiles = await FFModel.uploadMetaModel.find({}).exec();
        res.status(200).json(foldersAndFiles);
    }catch(error){
        next(error);
    }
};

// TODO: GetAll Folders
export const GetAllFolders: RequestHandler = async(req, res, next) =>{
    // TODO: Authentication
    try{
        const folders = await FFModel.FolderModel.find({__type: "Folder"});
        res.status(200).json(folders);
    }catch(error){
        next(error);
    }
};



// TODO: Getall Files 
export const GetAllFiles: RequestHandler = async(req, res, next) =>{
    // TODO: Authentication
    try{
        const files = await FFModel.FolderModel.find({__type: "File"});
        res.status(200).json(files);
    }catch(error){
        next(error);
    }
};

// TODO: Delete File
export const DeleteFF: RequestHandler = async(req, res, next) =>{
    // TODO: Authentication
    const objectID = req.params.objectId;
    try{
        if(!mongoose.isValidObjectId(objectID)){
            throw createHttpError(400, "Invalid note id");
        }
        const object = FFModel.FolderModel.findById(objectID);
        if(!object){
            throw createHttpError(404, "Note not found");
        }
        await object.remove();

        await FFModel.FolderModel.deleteMany({parentId: objectID});

        res.sendStatus(204);
        
    }catch(error){
        next(error);
    }
}


// TODO: get Specific Folder || File
export const GetFF: RequestHandler = async (req, res, next) =>{
    const objectID = req.params.objectId;
    try{
        if (!mongoose.isValidObjectId(objectID)) {
            throw createHttpError(400, "Invalid note id");
        }
        const note = await FFModel.FolderModel.findById(objectID).exec();
        if(!note){
            throw createHttpError(404, "Note not found");
        }
        
    } catch(error){
        next(error);
    }

};

interface UpdateNoteParams {
    ffID: mongoose.Types.ObjectId,
}

interface UpdateFFBody{
    title?: string,
    parentId?: mongoose.Types.ObjectId,
    fileType?: string,
    fileContent?: Buffer,
}

