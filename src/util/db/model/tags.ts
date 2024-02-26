import mongoose from "mongoose";

export interface TagsSchema extends mongoose.Document {
   isGlobal: boolean,
   isGroup: boolean,
   groupName: string,
   key: string,
   value: string,
}

export const model = mongoose.model<TagsSchema>("Tags", new mongoose.Schema({
  isGlobal: {
    type: Boolean,
    required: false,
    default: false,
  },
  isGroup: {
    type: Boolean,
    required: false,
    default: false,
  },
  groupName: {
    type: String,
    required: false,
  },
  key: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
}));
