import mongoose, { Schema } from "mongoose";

mongoose.pluralize(null);

const collection = "messages";

const schema = new mongoose.Schema({
    user: { type: String },
    message: { type: String },
});

export default mongoose.model(collection, schema);