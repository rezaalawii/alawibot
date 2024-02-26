import mongoose from "mongoose";
export const model = mongoose.model("Tags", new mongoose.Schema({
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
