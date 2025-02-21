import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    customerName: { type: String, required: true },
    date: { type: Date, default: Date.now },
    flagged: { type: Boolean, default: false }, // New field to flag inappropriate reviews
    reports: [{ 
        employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }, 
        reason: { type: String }
    }] // New field to store reports from employers
});

const tipSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    customerName: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    date: { type: Date, default: Date.now },
    reviews: [reviewSchema]
});

const payoutSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    method: { type: String, required: true }, // e.g., 'bank', 'wallet', 'upi'
    status: { type: String, default: 'pending' }, // e.g., 'pending', 'completed'
    fees: { type: Number, default: 0 },
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
    fcmToken: { type: String, default: "" },  // Store FCM token for push notifications
    upiId: { type: String, default: '' }, // Add UPI ID field
    employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employer' }, //  Add employer reference
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }, //  Track employee status
    lowPerformanceFlag: { type: Boolean, default: false }, //  New field for low performance
    payoutSchedule: { type: String, enum: ['weekly', 'biweekly', 'monthly'], default: 'monthly' }, //  New field
    tips: [tipSchema],
    payouts: [payoutSchema] // Ensure payouts field is defined
}, { timestamps: true });

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;
