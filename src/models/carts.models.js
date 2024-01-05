import mongoose, { Schema } from "mongoose";

mongoose.pluralize(null);

const collection = "carts";


const schema = new mongoose.Schema({
    products: [
        {
            id: String, 
            quantity: Number,
        },
    ],
})

export default mongoose.model(collection, schema);