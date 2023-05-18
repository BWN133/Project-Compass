// import * as FFModel from "../models/folder";
// import { RequestHandler } from "express";
// import createHttpError from "http-errors";
// import mongoose from "mongoose";
// import {Schema} from "mongoose";
// import { assertIsDefined } from "../util/assertIsDefined";
// // TODO: Test create with postman

// interface CreateFolderBody{
//     title?: string,
//     parentId?: Schema.Types.ObjectId,
// }


// export const createFolder: RequestHandler<unknown, unknown, CreateFolderBody, unknown>  = async(req, res, next) => {
//     //TODO:  Authentication
//     const title = req.body.title;
//     const parentId = req.body.parentId;
    
//     try{
//         if (!title) {
//             throw createHttpError(400, "Note must have a title");
//         }
        
//         const foldersAndFiles = await FFModel.FolderModel.create({
//             userId: undefined ,
//             title: title,
//             parentId: parentId,
//         });
//         res.status(201).json(foldersAndFiles);
//     }catch(error){
//         next(error);
//     }
// };

// // TODO: GetAll 
// export const GetAllFoldersAndFiles: RequestHandler = async(req, res, next) => {
//     //TODO:  Authentication
//     try{
//         // const parentId = req.params.parentId;
//         const foldersAndFiles = await FFModel.FolderModel.find({}).exec();
//         res.status(200).json(foldersAndFiles);
//     }catch(error){
//         next(error);
//     }
// };

// // TODO: GetAll Folders
// export const GetAllFolders: RequestHandler = async(req, res, next) =>{
//     // TODO: Authentication
//     try{
//         const folders = await FFModel.FolderModel.find({__type: "Folder"});
//         res.status(200).json(folders);
//     }catch(error){
//         next(error);
//     }
// };



// // TODO: Getall Files 
// export const GetAllFiles: RequestHandler = async(req, res, next) =>{
//     // TODO: Authentication
//     try{
//         const files = await FFModel.FolderModel.find({__type: "File"});
//         res.status(200).json(files);
//     }catch(error){
//         next(error);
//     }
// };

// // TODO: Delete File
// export const DeleteFF: RequestHandler = async(req, res, next) =>{
//     // TODO: Authentication
//     const objectID = req.params.objectId;
//     try{
//         if(!mongoose.isValidObjectId(objectID)){
//             throw createHttpError(400, "Invalid note id");
//         }
//         const object = FFModel.FolderModel.findById(objectID);
//         if(!object){
//             throw createHttpError(404, "Note not found");
//         }
//         await object.remove();

//         await FFModel.FolderModel.deleteMany({parentId: objectID});

//         res.sendStatus(204);
        
//     }catch(error){
//         next(error);
//     }
// }


// // TODO: get Specific Folder || File
// export const GetFF: RequestHandler = async (req, res, next) =>{
//     const objectID = req.params.objectId;
//     try{
//         if (!mongoose.isValidObjectId(objectID)) {
//             throw createHttpError(400, "Invalid note id");
//         }
//         const note = await FFModel.FolderModel.findById(objectID).exec();
//         if(!note){
//             throw createHttpError(404, "Note not found");
//         }
        
//     } catch(error){
//         next(error);
//     }

// };

// interface UpdateNoteParams {
//     ffID: string,
// }

// interface UpdateFFBody{
//     title?: string,
//     parentId?: Schema.Types.ObjectId,
//     fileType?: string,
//     fileContent?: Buffer,
// }
// // TODO: Update Specific Folder || File 
// export const UpdateFF:RequestHandler<UpdateNoteParams, unknown, UpdateFFBody, unknown> = async(req, res, next) => {
//     const objectId = req.params.ffID;
//     const newTitle = req.body.title;
//     const newParentId = req.body.parentId;
//     const newFileType = req.body.fileType;
//     const fileContent = req.body.fileContent;
//     try{
//         if (!mongoose.isValidObjectId(objectId)) {
//             throw createHttpError(400, "Invalid note id");
//         }
//         if(newFileType && !fileContent){
//             throw createHttpError(400, "Please provide file content");
//         }
//         if(!newFileType && fileContent ){
//             throw createHttpError(400, "Please provide file type");
//         }

//         const ffObject = await FFModel.FolderModel.findById(objectId);
        
//         if(!ffObject){
//             throw createHttpError(404, "File or Folder not found");
//         }
//         if(newTitle) ffObject.title = newTitle;
//         if(newParentId) ffObject.parentId = newParentId;
//     }catch(error){
//         next(error);
//     }
// };

