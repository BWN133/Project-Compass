import * as FFModel from "../models/folder";
import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import {Schema} from "mongoose";
import { assertIsDefined } from "../util/assertIsDefined";
// TODO:create

interface CreateFolderBody{
    title?: string,
    parentId?: Schema.Types.ObjectId,
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

// TODO: GetAll 
export const GetAllFoldersAndFiles: RequestHandler = async(req, res, next) => {
    //TODO:  Authentication
    try{
        // const parentId = req.params.parentId;
        const foldersAndFiles = await FFModel.FolderModel.find({});
        res.status(200).json(foldersAndFiles);
    }catch(error){
        next(error);
    }
};

// TODO: GetAll Folder


// TODO: Getall Files 


// TODO: Delete Files


// TODO: get Specific Folder || File

// TODO: Update Specific FOlder || File 

