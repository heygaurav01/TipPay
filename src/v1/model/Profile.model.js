import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: false
    },
    designation: {
        type: String,
        required: true
    },
    bank_account: {
        type: String,
        required: false
    },
    ifsc: {
        type: String,
        required: false
    },
    wallet_id: {
        type: String,
        required: false
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

const Profile = mongoose.model('Profile', ProfileSchema);

export default Profile;