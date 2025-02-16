import Employee from "../model/Employee.model.js";
import Bank from "../model/Bank.model.js";
import { jwtSign, roundNumber, sendMailOtp } from "../utils/helper.js";
import EmployeeRepositoryInterface from "./interface/employee.interface.js";

class EmployeeRepository extends EmployeeRepositoryInterface {
    register = async (data) => {
        const { fullName, profilePicture, jobTitle, department, location, phoneNumber, email, emailOtp } = data;



        const newEmployee = new Employee({
            fullName,
            profilePicture,
            jobTitle,
            department,
            location,
            phoneNumber,
            email,
            emailOtp,
        });
        const employee = newEmployee.save();

        if (employee) {
            return true;
        }
    }


    verifyEmail = async (data) => {
        const { email, emailOtp } = data;
        const employee = await Employee.findOneAndUpdate({
            email,
            emailOtp
        }, {
            emailOtp: null,
            emailVerified: 1,
        });

        if (employee) {
            return true;
        }

        return false;
    }

    mobileOtp = async (data) => {
        const { phoneNumber, phoneOtp } = data;
        const checkPhoneNumber = await Employee.findOne({ phoneNumber });
        if (checkPhoneNumber) {
            checkPhoneNumber.mobileOtp = phoneOtp;
            checkPhoneNumber.save();
            return {
                message: "Otp sent successfully",
                status: 200,
                success: true,
            }
        }
        return {
            message: "Phone number not found",
            status: 404,
            success: false,
        }
    }

    verifyPhoneNumber = async (data) => {
        const { phoneNumber, phoneOtp } = data;
        const employee = await Employee.findOne({
            phoneNumber
        })

        if (!employee) {
            return {
                message: "Phone number not found",
                status: 404,
                success: false
            }
        }
        if (employee.mobileOtp == phoneOtp) {
            employee.mobileVerified = 1;
            employee.mobileOtp = 0;
            await employee.save();
            const token = await jwtSign(employee._id)
            return {
                message: "Phone number verified successfully",
                status: 200,
                success: true,
                token
            }
        }
        return {
            message: "Incorrect OTP",
            status: 401,
            success: false
        }
    }

    setPinCode = async (data) => {
        const { pinCode, user_id } = data;
        const employee = await Employee.findOneAndUpdate({ _id: user_id }, { pinCode });
        if (employee) {
            return {
                message: "Pin code set successfully",
                status: 200,
                success: true
            }
        }
        return {
            message: "User not found",
            status: 404,
            success: false
        }
    }

    loginWithPin = async (data) => {
        const { pinCode } = data;
        const employee = await Employee.findOne({ pinCode });
        if (employee) {
            const token = await jwtSign(employee._id);
            return {
                message: "Login successful",
                status: 200,
                success: true,
                token
            }
        }
        return {
            message: "Incorrect Pin code",
            status: 401,
            success: false
        }
    }

    qrcodeLink = async (req) => {
        const employee = await Employee.findById(req.user_id);
        return {
            message: "QR Code Link generated successfully",
            status: 200,
            success: true,
            qrcodeLink: `https://tippay.com/add-review/${employee._id}`
        }
    }

    verifyBank = async (data) => {
        const { bank_account, ifsc, name, phone, user_id } = data;

        const checkBank = await Bank.findOne({ user: user_id,bank_account });
        if (checkBank) {
            return {
                message: "Bank account already exists",
                status: 400,
                success: false
            }
        }
        const bank = new Bank({
            bank_account,
            ifsc,
            name,
            phone,
            user: user_id
        });

        await bank.save();
        return {
            message: "Bank details added successfully",
            status: 200,
            success: true
        }
    }

    addReview = async (data) => {

    }

    // login=async(data)=>{
    //     const { phoneNumber } = data;
    //     const employee = await Employee.findOne({ email });
    //     if (!employee) {
    //         return {
    //             message: "Email not found",
    //             status: 404,
    //             success: false
    //         }
    //     }

    // }
}

export default EmployeeRepository;