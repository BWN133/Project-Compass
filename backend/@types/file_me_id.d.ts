import { isValidObjectId, Schema, ObjectId } from "mongoose";
declare global {
  namespace Express {
      namespace Multer {
          interface File {
              id: Schema.Types.ObjectId;  // assuming the id is a string
          }
      }
  }
}