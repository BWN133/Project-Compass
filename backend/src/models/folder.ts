import {Schema,InferSchemaType, model} from "mongoose";

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
    userId: { type: Schema.Types.ObjectId },
    title: { type: String},
    parentId: {type: Schema.Types.ObjectId},

}, baseOptions);

const dataSchemaExtra = new Schema({
    fileType: {type: String},
    fileContent: {type: Buffer}
});


type Folder = InferSchemaType<typeof folderSchema>;

const FolderModel = model<Folder>('Folder', folderSchema);



const DataModel = FolderModel.discriminator('Data',dataSchemaExtra);

export {FolderModel, DataModel};


// type Note = InferSchemaType<typeof folderSchema>;

// export default model<Note>("Note", folderSchema);



