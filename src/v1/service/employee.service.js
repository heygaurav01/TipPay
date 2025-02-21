import Employee from "../model/Employee.model.js";
import EmployeeRepository from "../repository/empolyee.repository.js";
import FirebaseAuthService from '../service/firebaseAuth.service.js';
import { roundNumber, sendMailOtp } from "../utils/helper.js";
import bcrypt from 'bcryptjs';
import twilio from 'twilio'
import {config} from 'dotenv'
import jwt from 'jsonwebtoken';
import QRCode from 'qrcode';
import mongoose from 'mongoose';
config()
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const otpStorage = {}; // Store OTPs temporarily

const employeeRepository = new EmployeeRepository();
class EmployeeService {
    async register(data) {
        try {
            const { fullName, email, password, phoneNumber,firebaseToken, ...rest } = data;
              // Verify Firebase token
              console.log(fullName,email,password)
            //   const firebaseVerify = await FirebaseAuthService.verifyFirebaseToken(firebaseToken);
            //   if (!firebaseVerify.success) {
            //       return { status: 401, message: 'Invalid Firebase token' };
            //   }
              //hash password
            const hashedPassword = await bcrypt.hash(password, 10);
            const employee = new Employee({ fullName, email, password: hashedPassword, phoneNumber, ...rest });
            await employee.save();
            return { status: 201, message: 'Employee registered successfully' };
        } catch (error) {
            return { status: 500, message: error.message };
        }
    }

    async login(data) {
        try {
            const { email, password, firebaseToken } = data;
             // Verify Firebase token
             const firebaseVerify = await FirebaseAuthService.verifyFirebaseToken(firebaseToken);
             if (!firebaseVerify.success) {
                 return { status: 401, message: 'Invalid Firebase token' };
             }

             
            const employee = await Employee.findOne({ email });
            if (!employee) {
                return { status: 404, message: 'Employee not found' };
            }

            //check password
            const isMatch = await bcrypt.compare(password, employee.password);
            if (!isMatch) {
                return { status: 400, message: 'Invalid credentials' };
            }

            // Generate JWT token
            const token = jwt.sign({ id: employee._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return { status: 200, message: 'Login successful', token };
        } catch (error) {
            return { status: 500, message: error.message };
        }
    }

    verifyEmail = async (data) => {
        const { email, emailOtp } = data;
        const employee = await Employee.findOne({ email });
        if (!employee) {
            return { success: false, message: 'Email not found' };
        }
        if (emailOtp != employee.emailOtp) {
            return { success: false, message: 'Incorrect OTP' };
        }
        const result = await employeeRepository.verifyEmail(data);
        if (result) {
            return { success: true, message: 'Email verified successfully' };
        }
        return { success: false, message: 'Error verify email' };
    }

    mobileOtp = async (data) => {
        const result = await employeeRepository.mobileOtp(data);
        if (result.success) {
            const message = await client.messages.create({
                body: `Your OTP code is: ${data.phoneOtp}`,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: data.phoneNumber
            });
            if (message) {
                return { success: true, status: 200, message: 'OTP sent successfully on your mobile number', verificationId: verification.sid };
            }
            return {
                success: false,
                status: 500,
                message: 'Error sending OTP on mobile number'
            }
        }
        return result;
    }

    verifyPhoneNumber = async (data) => {
        const result = await employeeRepository.verifyPhoneNumber(data);
        return result;
    }

    setPinCode = async (data) => {
        const hashPinCode = await bcrypt.hash(data.pinCode, 12);
        data.pinCode = hashPinCode;
        const result = await employeeRepository.setPinCode(data);
        return result;
    }

    loginWithPinCode = async (data) => {
        const { pinCode } = data;
        const validPinCode = await bcrypt.compare()
        const employee = await employeeRepository.loginWithPinCode(data);
    }

    async qrcodeLink(req) {
        try {
            const { user_id } = req.body;
            if (!mongoose.Types.ObjectId.isValid(user_id)) {
                return { status: 400, message: 'Invalid user ID' };
            }

            const employee = await Employee.findById(user_id);

            if (!employee) {
                return { status: 404, message: 'Employee not found' };
            }

            const qrCodeData = `Employee ID: ${employee._id}`;
            const qrCodeUrl = await QRCode.toDataURL(qrCodeData);

            employee.qrCodeUrl = qrCodeUrl;
            await employee.save();

            return { status: 200, message: 'QR code link generated successfully', qrCodeUrl };
        } catch (err) {
            return { status: 500, message: err.message };
        }
    }

    verifyBank = async (data) => {
        const response = await (await fetch(process.env.BANK_URL, {
            method: 'POST',
            headers: {
                'x-client-id': process.env.CLIENT_ID,
                'x-client-secret': process.env.CLIENT_SECRET,
                'Content-Type': 'application/json'
            },
            body: `'{"bank_account":"${data.bank_account}","ifsc":"${data.ifsc}","name":"${data.name}","phone":"${data.phone}"}'`
        })).json();
        // console.log(response);
        return {
            success:true,
            status:400,
            message:response
        }
        // const result = await employeeRepository.verifyBank(data);
        // if(result.success){

        // }
        // return result;
    }

    async addEmployee(data) {
        try {
            const employee = new Employee(data);
            await employee.save();
            return { status: 201, message: 'Employee added successfully' };
        } catch (error) {
            return { status: 500, message: error.message };
        }
    }

    async getEmployees() {
        try {
            const employees = await Employee.find();
            return { status: 200, employees };
        } catch (error) {
            return { status: 500, message: error.message };
        }
    }

    async updateProfile(data) {
        try {
            const { user_id, fullName, profilePicture, jobTitle, department, location } = data;
            const employee = await Employee.findById(user_id);
            if (!employee) {
                return { status: 404, message: 'Employee not found' };
            }
            employee.fullName = fullName || employee.fullName;
            employee.profilePicture = profilePicture || employee.profilePicture;
            employee.jobTitle = jobTitle || employee.jobTitle;
            employee.department = department || employee.department;
            employee.location = location || employee.location;
            await employee.save();
            return { status: 200, message: 'Profile updated successfully', employee };
        } catch (error) {
            return { status: 500, message: error.message };
        }
    }

    async updateBankDetails(data) {
        try {
            const { user_id, bankAccount, walletLink } = data;
            const employee = await Employee.findById(user_id);
            if (!employee) {
                return { status: 404, message: 'Employee not found' };
            }
            employee.bankAccount = bankAccount || employee.bankAccount;
            employee.walletLink = walletLink || employee.walletLink;
            await employee.save();
            return { status: 200, message: 'Bank details updated successfully', employee };
        } catch (error) {
            return { status: 500, message: error.message };
        }
    }
}

export default EmployeeService;