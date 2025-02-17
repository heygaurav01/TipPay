import mongoose from 'mongoose';

const tipSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    customerName: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const employeeSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    profilePicture: { type: String, default: '' },
    jobTitle: { type: String, default: '' },
    department: { type: String, default: '' },
    location: { type: String, default: '' },
    role: { type: String, default: 'employee' },
    pinCode: { type: String, default: '0' },
    emailOtp: { type: Number, default: 0 },
    mobileOtp: { type: Number, default: 0 },
    mobileVerified: { type: Number, default: 0 },
    emailVerified: { type: Number, default: 0 },
    bankAccount: { type: String, default: '' },
    walletLink: { type: String, default: '' },
    tips: [tipSchema]
}, { timestamps: true });

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;
