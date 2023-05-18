import {Schema,InferSchemaType, model} from "mongoose";
import mongoose from "mongoose";

interface dataI {
    userId: Schema.Types.ObjectId,
    title: string,
    parentId: Schema.Types.ObjectId,
    fileType: string,
    filecontent: Buffer,
}


const baseOptions = {
    discriminatorKey: "__type",
    collection:'data',
    timestamps: true 
}


const folderSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, default: new mongoose.Types.ObjectId('6348acd2e1a47ca32e79f46f')},
    title: { type: String},
    parentId: {type: Schema.Types.ObjectId, default: new mongoose.Types.ObjectId('6348acd2e1a47ca32e79f46f')},

}, baseOptions);

const dataSchemaExtra = new Schema({
    fileType: {type: String},
    fileContent: {type: Buffer}
});


type Base = InferSchemaType<typeof folderSchema>;

const BaseModel = model<Base>('Base', folderSchema);

const FolderModel = BaseModel.discriminator('Folder', new Schema({}));


const FileModel = BaseModel.discriminator('File',dataSchemaExtra);

export {FolderModel, FileModel};


// type Note = InferSchemaType<typeof folderSchema>;

// export default model<Note>("Note", folderSchema);



