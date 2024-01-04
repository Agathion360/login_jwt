import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

mongoose.pluralize(null)

const collection = 'users'

const schema = new mongoose.Schema({
    first_name: { type: String, required: true, index: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    //age: { type: Number, required: true },
    gender: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'usuario'], default: 'usuario' },

});


schema.plugin(mongoosePaginate)

export default mongoose.model(collection, schema)