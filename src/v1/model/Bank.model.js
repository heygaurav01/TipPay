import mongoose from 'mongoose'
const { Schema } = mongoose;
const bankSchema = new Schema({
    bankAccount: { type: String, required: true },
    ifsc: { type: String, required: true, unique: true },
    name: { type: String, default: '' },
    phone: { type: String, default: '' },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

const Bank = mongoose.model('Bank', bankSchema);

export default Bank;