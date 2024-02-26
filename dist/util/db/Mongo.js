import mongoose from "mongoose";
export async function connect(url) {
    await mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
    return;
}
