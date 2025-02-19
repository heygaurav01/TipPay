import mongoose from 'mongoose';

const employerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    companyName: { type: String, required: true },
    role: { type: String, default: 'employer' },
    fcmToken: { type: String, default: '' }, // FCM token for push notifications
}, { timestamps: true });

const Employer = mongoose.model('Employer', employerSchema);

export default Employer;
