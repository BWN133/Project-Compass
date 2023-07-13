import * as FFModel from "../models/folderAndFiles";
import { NextFunction, RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose, {Schema, ObjectId} from "mongoose";
import { assertIsDefined } from "../util/assertIsDefined";
import multer from "multer";
import env from "../util/validateEnv";
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
    console.log("Here is title recieved: ", title);
    console.log("here is parentId recieved;",  parentId);
    try{
        if (!title) {
            throw createHttpError(400, "Folder must have a title");
        }
        const foldersAndFiles = await FFModel.FolderModel.create({
            userId: undefined ,
            title: title,
            parentId: parentId,
            objectType: "FOLDER",
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
}


export const createFile: RequestHandler<unknown, unknown, CreateFileBody, unknown>  = async(req, res, next) => {
    //TODO:  Authentication
    const parentId = req.body.parentId;
    try{
        if(!mongoose.isValidObjectId(parentId)){
            throw createHttpError(400, "Invalid parent Id");
        }
        const parentFolder = await FFModel.FolderModel.findById(parentId);
        if(!parentFolder || parentFolder.objectType == "FILE"){
            throw createHttpError(400, "Incorrecrt parent ID");
        }
        if(!req.file){
            throw createHttpError(400, "Please provide a file and filetype");
        }
        const title = req.file.originalname;
        const foldersAndFiles = await FFModel.FileModel.create({
            userId: undefined ,
            title: title,
            parentId: parentId,
            fileMeta: req.file.filename,
            objectType: "FILE",
        });
        res.status(201).json(foldersAndFiles);
    }catch(error){
        next(error);
    }
};


export const getParentFolder: RequestHandler= async(req, res, next) => {
    const parentFieldId = env.DEFAULTPAGE_PARENTID;
    try{
        if(!mongoose.isValidObjectId(parentFieldId)){
            throw createHttpError(400, "Invalid file id");
        }
        const result = await GetFileFromParentHelper(parentFieldId, next); 
        res.status(200).json(result);
    }catch(error){
        next(error);
    }
}

export const GetGrandParentFolder: RequestHandler= async(req, res, next) => {
    const folderId = req.params.parentFieldId;
    try{
        if(!mongoose.isValidObjectId(folderId)){
            throw createHttpError(400, "Invalid file id");
        }
        const currentFolderMeta = await FFModel.FolderModel.findById(folderId);
        if(!currentFolderMeta){
            throw createHttpError(400, "Parent Folder Does not Exist");
        }
        const result = await GetFileFromParentHelper(currentFolderMeta.parentId.toString(), next); 
        res.status(200).json(result);
    }catch(error){
        next(error);
    }
}

//TODO: take in file object, return file Data
const getFileHelper = async(file: FFModel.File, id: string) => {
    if(!file){
        throw  createHttpError(404, "File not found");
    }
    
    const fileMeta = await FFModel.uploadMetaModel.find({filename:file.fileMeta});
    if(!fileMeta){
        throw createHttpError(404, "File content missing");
    }
    const fileContents = await FFModel.chunkModel.find({files_id: fileMeta[0]._id});//.sort("-postDate")
    if(!fileContents[0].data)
    {
        throw createHttpError(404, "File data missing in Chunk");
    }
    const resultFileData = {
        _id: id,
        parentId: file.parentId,
        objectType: file.objectType,
        title:file.title,
        fileContent: fileContents[0].data,
        };
    return resultFileData;
}


export const GetFile: RequestHandler = async(req, res, next) =>{
    // TODO: Authentication
    const fileId = req.params.fileId;
    try{
        if(!mongoose.isValidObjectId(fileId)){
            throw createHttpError(400, "Invalid file id");
        }
        const file = await FFModel.FileModel.findById(fileId);

        const resultFileData = await getFileHelper(<FFModel.File>file, fileId);
        res.status(200).json(resultFileData);
    }catch(error){
        next(error);
    }
};


export const GetFileFromParent:RequestHandler = async(req, res, next) => {
    const parentFieldId = req.params.parentFieldId;
    try{
        if(!mongoose.isValidObjectId(parentFieldId)){
            throw createHttpError(400, "Invalid file id");
        }
        const result = await GetFileFromParentHelper(parentFieldId, next); 
        res.status(200).json(result);
    }catch(error){
        next(error);
    }
}

export const GetHomeFolder: RequestHandler= async(req, res, next) => {
    const parentFieldId = env.DEFAULTPAGE_PARENTID;
    try{
        if(!mongoose.isValidObjectId(parentFieldId)){
            throw createHttpError(400, "Invalid file id");
        }

        const result = await GetFileFromParentHelper(parentFieldId, next); 
        res.status(200).json(result);
    }catch(error){
        next(error);
    }
}

export const GetFileFromParentHelper = async(parentFieldId:string, next:NextFunction) => {
    try{
        if(!mongoose.isValidObjectId(parentFieldId)){
            throw createHttpError(400, "Invalid file id");
        }
        const subFileCursor = await FFModel.BaseModel.find({parentId: parentFieldId}).cursor();
        const result = [];
        for (let document = await subFileCursor.next(); document != null; document = await subFileCursor.next()){
            if(document.objectType == 'FOLDER'){
                result.push(document);
            }else{
                const fileResult = await getFileHelper(<FFModel.File> document, document.id);
                result.push(fileResult);
            }
        }

        return result;
    }catch(error){
        next(error);
    }
}

const deleteFileHelper = async(file: FFModel.File) =>{
    if(!file){
        throw  createHttpError(404, "File not found");
    }
    const fileMeta = await FFModel.uploadMetaModel.find({filename:file.fileMeta});
    if(!fileMeta){
        throw createHttpError(404, "File content missing");
    }
    const fileContentsCursor = await FFModel.chunkModel.find({files_id : fileMeta[0].id}).cursor();
    for (let document = await fileContentsCursor.next(); document != null; document = await fileContentsCursor.next()){
        document.remove();
    }
    fileMeta[0].remove();
    return
};





interface DeleteFolderBody{
    objectId: string
}

export const deleteFolder: RequestHandler<unknown, unknown, DeleteFolderBody, unknown> = async(req, res, next) =>{
    // TODO: Authentication
    const objectID = req.body.objectId;
    console.log(objectID);
    try{
        if(!mongoose.isValidObjectId(objectID)){
            throw createHttpError(400, "Invalid note id");
        }
        const object = await FFModel.BaseModel.findById(objectID);
        if(!object){
            throw createHttpError(404, "Note not found");
        }
        if(object.objectType == 'FILE')
        {
            await deleteFileHelper(<FFModel.File>object);
        }else
        {
            await deleteFolderContent(objectID);
        }
        await object.remove();
        console.log("sueccessfully deleted");
        res.sendStatus(204);
    }catch(error){
        next(error);
    }
}

const deleteFolderContent = async(parentId: string) => {

    if(!mongoose.isValidObjectId(parentId))
    {
        throw createHttpError(400, "Invalid note id");
    }
    const subFoldersAndFilesCursor = await FFModel.BaseModel.find({parentId: parentId}).cursor();
    //can not recursively delete, need to cbhange this to helper function and make delete tecursive 
    for (let document = await subFoldersAndFilesCursor.next(); document != null; document = await subFoldersAndFilesCursor.next()){
        if(document.objectType == 'FOLDER'){
            deleteFolderContent(document._id.toString());
        }else{
            deleteFileHelper(<FFModel.File>document);
        }
        document.remove();
    }
}
export const deleteFile: RequestHandler = async (req, res, next) => {
    const objectID = req.params.objectId;
    try{
        if(!mongoose.isValidObjectId(objectID)){
            throw createHttpError(400, "Invalid note id");
        }
        const file = await FFModel.FileModel.findById((objectID));
        if(!file){
            throw createHttpError(404, "File not found");
        }
        await deleteFileHelper(file);
        res.sendStatus(204);
    }catch(error){
        next(error);
    }
}

