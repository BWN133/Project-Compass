import {Schema,InferSchemaType, model} from "mongoose";


const folderSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    
    text: { type: String },
}, { timestamps: true });


type Note = InferSchemaType<typeof folderSchema>;

export default model<Note>("Note", folderSchema);



