// employee.controller.js

import EmployeeService from "../service/employee.service.js";
import { roundNumber } from "../utils/helper.js";
import FirestoreService from '../service/firestore.service.js';
import TipService from "../service/tip.service.js";
import ReviewService from "../service/review.service.js";
import PerformanceService from "../service/performance.service.js";
import PayoutService from "../service/payout.service.js";
import OTPService from "../service/otp.service.js";
import PushNotificationService from "../service/pushNotification.service.js"; // Corrected import

const employeeService = new EmployeeService();
const firestoreService = new FirestoreService();
const tipService = new TipService();
const reviewService = new ReviewService();
const performanceService = new PerformanceService();
const payoutService = new PayoutService();
const otpService = new OTPService();
const pushNotificationService = PushNotificationService; // Corrected instantiation

class EmployeeController {
    async register(req, res) {
        try {
            console.log("Received Request Body:", req.body);
            let result = await employeeService.register(req.body);
            return res.json(result);
        } catch (err) {
            return res.status(500).json({
                'success': false,
                'message': err.message
            });
        }
    }

    async login(req, res) {
        try {
            const result = await employeeService.login(req.body);
            return res.status(result.status).json(result);
        } catch (err) {
            return res.status(500).json({
                'success': false,
                'message': err.message
            });
        }
    }

    async verifyEmail(req, res) {
        try {
            let result = await employeeService.verifyEmail(req.body);
            return res.json(result);
        } catch (err) {
            return res.status(500).json({
                'success': false,
                'message': err.message
            });
        }
    }

    async mobileOtp(req, res) {
        try {
            const data = {
                phoneNumber: req.body.phoneNumber,
                phoneOtp: roundNumber(Math.random() * 100000),
            }
            let result = await employeeService.mobileOtp(data);
            return res.status(result.status).json(result);
        } catch (err) {
            return res.status(500).json({
                'success': false,
                'message': err.message
            });
        }
    }

    async verifyPhoneNumber(req, res) {
        try {
            let result = await employeeService.verifyPhoneNumber(req.body);
            return res.status(result.status).json(result);
        } catch (err) {
            return res.status(500).json({
                'success': false,
                'message': err.message
            });
        }
    }

    async setPinCode(req, res) {
        try {
            const { pinCode } = req.body;
            const data = {
                pinCode,
                user_id: req.user_id
            };
            console.log(data);
            let result = await employeeService.setPinCode(data);
            return res.status(result.status).json(result);
        } catch (err) {
            return res.status(500).json({
                'success': false,
                'message': err.message
            });
        }
    }

    async qrcodeLink(req, res) {
        try {
            const result = await employeeService.qrcodeLink(req);
            return res.status(result.status).json(result);
        } catch (err) {
            return res.status(500).json({
                'success': false,
                'message': err.message
            });
        }
    }

    async verifyBank(req, res) {
        try {
            const data = {
                bank_account: req.body.bank_account,
                ifsc: req.body.ifsc,
                name: req.body.name,
                phone: req.body.phone,
                user_id: req.user_id
            }
            let result = await employeeService.verifyBank(data);
            return res.status(result.status).json(result);
        } catch (err) {
            return res.status(500).json({
                'success': false,
                'message': err.message
            });
        }
    }

    async addEmployee(req, res) {
        try {
            const result = await firestoreService.addEmployee(req.body);
            return res.status(result.status).json(result);
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async getEmployees(req, res) {
        try {
            const result = await firestoreService.getEmployees();
            return res.status(result.status).json(result);
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async updateProfile(req, res) {
        try {
            const result = await employeeService.updateProfile(req.body);
            return res.status(result.status).json(result);
        } catch (err) {
            return res.status(500).json({
                'success': false,
                'message': err.message
            });
        }
    }

    async updateBankDetails(req, res) {
        try {
            const result = await employeeService.updateBankDetails(req.body);
            return res.status(result.status).json(result);
        } catch (err) {
            return res.status(500).json({
                'success': false,
                'message': err.message
            });
        }
    }

    async updateFcmToken(req, res) {
        try {
            const { user_id, fcmToken } = req.body;

            // Validate input
            if (!user_id || !fcmToken) {
                return res.status(400).json({ success: false, message: "user_id and fcmToken are required" });
            }

            // Update the FCM token in the database
            const employee = await Employee.findByIdAndUpdate(
                user_id,
                { fcmToken: fcmToken },
                { new: true }
            );

            if (!employee) {
                return res.status(404).json({ success: false, message: "Employee not found" });
            }

            return res.status(200).json({ success: true, message: "FCM token updated successfully", employee });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async addTip(req, res) {
        try {
            console.log("Request Body:", req.body); // Debugging line
            const { user_id, amount, customerName, paymentMethod } = req.body;

            if (!user_id || !amount || !customerName || !paymentMethod) {
                return res.status(400).json({ success: false, message: "All fields are required" });
            }

            const result = await employeeService.addTip(user_id, amount, customerName, paymentMethod);
            return res.status(200).json(result);

        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async getTips(req, res) {
        try {
            const { user_id, period } = req.query;
            const result = await tipService.getTips(user_id, period);
            return res.status(result.status).json(result);
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async getTipDetails(req, res) {
        try {
            const { user_id, tip_id } = req.query;
            const result = await tipService.getTipDetails(user_id, tip_id);
            return res.status(result.status).json(result);
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async addReview(req, res) {
        try {
            const result = await reviewService.addReview(req.body); // Use reviewService instead of employeeService
            if (result.status === 201) {
                const employee = await employeeService.getEmployeeById(req.body.user_id);
                if (employee && employee.fcmToken) {
                    await pushNotificationService.sendNotification(
                        employee.fcmToken, "New Customer Review",
                        "A customer has left a new review for you."
                    );
                }
            }
            return res.status(result.status).json(result);
        } catch (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
    }
    async getReviews(req, res) {
        try {
            const { user_id, tip_id } = req.query;
            const result = await reviewService.getReviews(user_id, tip_id);
            return res.status(result.status).json(result);
        } catch (err) {
            return res.status(500).json({
                'success': false,
                'message': err.message
            });
        }
    }

    async getReviewSummary(req, res) {
        try {
            const { user_id } = req.query;
            const result = await reviewService.getReviewSummary(user_id);
            return res.status(result.status).json(result);
        } catch (err) {
            return res.status(500).json({
                'success': false,
                'message': err.message
            });
        }
    }
    async flagReview(req, res) {
        try {
            const { reviewId } = req.body;
            const result = await reviewService.flagReview(reviewId);
            return res.status(result.status).json(result);
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async reportReview(req, res) {
        try {
            const { reviewId, employerId, reason } = req.body;
            const result = await reviewService.reportReview(reviewId, employerId, reason);
            return res.status(result.status).json(result);
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async getPerformance(req, res) {
        try {
            const { user_id, period } = req.query;
            const result = await performanceService.getPerformance(user_id, period);
            return res.status(result.status).json(result);
        } catch (err) {
            return res.status(500).json({
                'success': false,
                'message': err.message
            });
        }
    }

    async comparePerformance(req, res) {
        try {
            const { user_id, period } = req.query;
            const result = await performanceService.comparePerformance(user_id, period);
            return res.status(result.status).json(result);
        } catch (err) {
            return res.status(500).json({
                'success': false,
                'message': err.message
            });
        }
    }

    async requestPayout(req, res) {
        try {
            const result = await employeeService.requestPayout(req.body);
            console.log("Payout Service Response:", result); // 🔍 Debugging log

            if (!result) {
                return res.status(500).json({ success: false, message: "Internal server error" });
            }

            if (result.status === 201) {
                const employee = await employeeService.getEmployeeById(req.body.user_id);
                if (employee && employee.fcmToken) {
                    await pushNotificationService.sendNotification(
                        employee.fcmToken, "Payout Requested",
                        `Your payout request of ₹${req.body.amount} has been submitted.`
                    );
                }
            }
            return res.status(result.status).json(result);

        } catch (err) {
            console.error("Request Payout Controller Error:", err); // 🔍 Debugging log
            return res.status(500).json({ success: false, message: err.message });
        }
    }

    async getPayoutHistory(req, res) {
        try {
            const { user_id } = req.query;
            const result = await payoutService.getPayoutHistory(user_id);
            return res.status(result.status).json(result);
        } catch (err) {
            return res.status(500).json({
                'success': false,
                'message': err.message
            });
        }
    }

    async sendOTP(req, res) {
        try {
            const { phoneNumber } = req.body;
            const result = await otpService.sendOTP(phoneNumber);
            return res.status(result.status).json(result);
        } catch (err) {
            return res.status(500).json({
                'success': false,
                'message': err.message
            });
        }
    }

    async verifyOTP(req, res) {
        try {
            const { uid, otp } = req.body;
            const result = await otpService.verifyOTP(uid, otp);
            return res.status(result.status).json(result);
        } catch (err) {
            return res.status(500).json({
                'success': false,
                'message': err.message
            });
        }
    }
    async someFunction(req, res) {
        try {
            const result = await pushNotificationService.sendNotification(
                "userToken",
                "Hello",
                "This is a test notification"
            );
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async authorizePayout(req, res) {
        try {
            const { employeeId, amount, method } = req.body;
            const result = await employeeService.authorizePayout(employeeId, amount, method);

            if (result.success) {
                const employee = await employeeService.getEmployeeById(employeeId);
                if (employee && employee.fcmToken) {
                    await pushNotificationService.notifyPayoutApproval(employee.fcmToken, amount);
                }
            }

            return res.status(result.status).json(result);
        } catch (err) {
            return res.status(500).json({
                'success': false,
                'message': err.message
            });
        }
    }
}

export default EmployeeController;