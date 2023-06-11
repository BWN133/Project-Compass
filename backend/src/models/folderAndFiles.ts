import {Schema,InferSchemaType, model} from "mongoose";
import mongoose from "mongoose";
import env from "../util/validateEnv";



const baseOptions = {
    discriminatorKey: "__type",
    collection:'data',
    timestamps: true,
}


const folderSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, default: new mongoose.Types.ObjectId(env.DEFAULTPAGE_PARENTID)},
    title: { type: String, defualt: "none"},
    parentId: {type: Schema.Types.ObjectId, default: new mongoose.Types.ObjectId(env.DEFAULTPAGE_PARENTID)},
    objectType: {type: String},
}, baseOptions);

const fileSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, default: new mongoose.Types.ObjectId(env.DEFAULTPAGE_PARENTID)},
    title: { type: String, defualt: "none"},
    parentId: {type: Schema.Types.ObjectId, default: new mongoose.Types.ObjectId(env.DEFAULTPAGE_PARENTID)},
    objectType: {type: String},
    fileMeta:{type: String},
}, baseOptions);

const fileMetaSchema = new Schema({filename:{type: String}}, {collection:'uploads.files'});
const chunkSchema = new Schema({files_id:{type: Schema.Types.ObjectId}}, {collection:'uploads.chunks'});
type Base = InferSchemaType<typeof folderSchema>;

type File = InferSchemaType<typeof fileSchema>;

const BaseModel = model<Base>('Base', folderSchema);
//test connection with file chunk
const uploadMetaModel = model('uploads_files', fileMetaSchema);

const chunkModel = model('uploads_chunks', chunkSchema);

const FolderModel = BaseModel.discriminator<Base>('Folder', new Schema({}, baseOptions));

const FileModel = BaseModel.discriminator<File>('File', fileSchema);





export {FolderModel, FileModel, BaseModel, uploadMetaModel, chunkModel, File, Base};





