import Employee from "../model/Employee.model.js";
import EmployeeRepository from "../repository/empolyee.repository.js";
import bcrypt from "bcryptjs";
import twilio from "twilio";
import { config } from "dotenv";
import jwt from "jsonwebtoken";
import QRCode from "qrcode";
import mongoose from "mongoose";
import { roundNumber, sendMailOtp } from "../utils/helper.js";

config();
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const employeeRepository = new EmployeeRepository();
class EmployeeService {
    async register(data) {
        try {
            const { fullName, email, password, phoneNumber, ...rest } = data;
            const existingEmployee = await Employee.findOne({ email });
            if (existingEmployee) {
                return { status: 200, message: "Email already exists" };
            }
            
            const hashedPassword = await bcrypt.hash(password, 10);
            const employee = new Employee({ fullName, email, password: hashedPassword, phoneNumber, ...rest });
            await employee.save();
            return { status: 201, message: "Employee registered successfully" };
        } catch (error) {
            return { status: 500, message: error.message };
        }
    }

    async  login(data) {
        try {
            const { email, password } = data;
            
            console.log("Received Login Data:", data);
    
            // Check if employee exists
            const employee = await Employee.findOne({ email });
            if (!employee) {
                return { status: 404, message: "Employee not found" };
            }
    
            // Verify password
            const isMatch = await bcrypt.compare(password, employee.password);
            if (!isMatch) {
                return { status: 400, message: "Invalid credentials" };
            }
    
            console.log("Employee Found:", employee._id);
    
            // Generate JWT Token
            const token = jwt.sign(
                { id: employee._id.toString() }, // Ensure it's a string
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );
    
            console.log("Generated Token:", token);
    
            return { status: 200, message: "Login successful", token };
        } catch (error) {
            console.error("Login Error:", error);
            return { status: 500, message: error.message };
        }
    }

    async verifyEmail(data) {
        try {
            const { email, emailOtp } = data;
            const employee = await Employee.findOne({ email });
            if (!employee) {
                return { success: false, message: "Email not found" };
            }
            if (emailOtp != employee.emailOtp) {
                return { success: false, message: "Incorrect OTP" };
            }
            await employeeRepository.verifyEmail(data);
            return { success: true, message: "Email verified successfully" };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    async mobileOtp(data) {
        try {
            const result = await employeeRepository.mobileOtp(data);
            if (result.success) {
                await client.messages.create({
                    body: `Your OTP code is: ${data.phoneOtp}`,
                    from: process.env.TWILIO_PHONE_NUMBER,
                    to: data.phoneNumber
                });
                return { success: true, status: 200, message: "OTP sent successfully" };
            }
            return result;
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    async qrcodeLink(req) {
        try {
            const { user_id } = req.body;
            if (!mongoose.Types.ObjectId.isValid(user_id)) {
                return { status: 400, message: "Invalid user ID" };
            }
            
            const employee = await Employee.findById(user_id);
            if (!employee) {
                return { status: 404, message: "Employee not found" };
            }

            const qrCodeData = `Employee ID: ${employee._id}`;
            const qrCodeUrl = await QRCode.toDataURL(qrCodeData);
            employee.qrCodeUrl = qrCodeUrl;
            await employee.save();

            return { status: 200, message: "QR code link generated successfully", qrCodeUrl };
        } catch (err) {
            return { status: 500, message: err.message };
        }
    }

    async addEmployee(data) {
        try {
            const employee = new Employee(data);
            await employee.save();
            return { status: 201, message: "Employee added successfully" };
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
    async addTip(user_id, amount, customerName, paymentMethod) {
        try {
            const employee = await Employee.findById(user_id);
            if (!employee) {
                return { status: 404, message: "Employee not found" };
            }
    
            const newTip = {
                amount,
                customerName,
                paymentMethod,
                reviews: [] // Initialize an empty reviews array
            };
    
            employee.tips.push(newTip);
            await employee.save();
    
            // Get the _id of the newly created tip
            const tipId = employee.tips[employee.tips.length - 1]._id;
    
            return { 
                status: 201, 
                message: "Tip added successfully", 
                tip: {
                    _id: tipId, // Include the tip_id in the response
                    amount: newTip.amount,
                    customerName: newTip.customerName,
                    paymentMethod: newTip.paymentMethod,
                    reviews: newTip.reviews
                }
            };
        } catch (error) {
            return { status: 500, message: error.message };
        }
    }
    async getEmployeeById(user_id) {
        try {
            const employee = await Employee.findById(user_id);
            if (!employee) {
                return null; // Return null if employee is not found
            }
            return employee; // Return the employee object
        } catch (error) {
            throw new Error(error.message); // Throw error for handling in the controller
        }
    }
    async requestPayout(data) {
        try {
            const { user_id, amount, method } = data;
    
            // Find the employee by user_id
            const employee = await Employee.findById(user_id);
            if (!employee) {
                return { status: 404, message: "Employee not found" };
            }
    
            // Create a new payout object
            const payout = {
                amount,
                method: method || "bank", // Use the provided method or default to "bank"
                status: "pending",
                fees: 0, // You can calculate fees based on the amount or method if needed
                date: new Date()
            };
    
            // Add the payout to the employee's payouts array
            employee.payouts.push(payout);
            await employee.save();
    
            return { status: 201, message: "Payout requested successfully", payout };
        } catch (error) {
            return { status: 500, message: error.message };
        }
    }
}
      
export default EmployeeService;
