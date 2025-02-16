import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    profilePicture: { type: String, default: '' }, // Store image URL
    jobTitle: { type: String, required: true },
    department: { type: String, required: true },
    location: { type: String, required: true },
    role: { type: String, default:'employee'},
    pinCode: { type: String, default:0 },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    emailOtp: { type: Number, default: 0 },
    mobileOtp: { type: Number, default: 0 },
    mobileVerified: { type: Number, default: 0 },
    emailVerified: { type: Number, default: 0 }
}, { timestamps: true });

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;
