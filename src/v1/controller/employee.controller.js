import EmployeeService from "../service/employee.service.js";
import { roundNumber } from "../utils/helper.js";
import FirestoreService from '../service/firestore.service.js';
import TipService from "../service/tip.service.js";
import reviewService from "../service/review.service.js"; 
import PerformanceService from "../service/performance.service.js";
import PayoutService from "../service/payout.service.js";
import OTPService from "../service/otp.service.js";
import PushNotificationService from "../service/pushNotification.service.js";

const employeeService = new EmployeeService();
const firestoreService = new FirestoreService();
const tipService = new TipService();
//const reviewService = new ReviewService();
const performanceService = new PerformanceService();
const payoutService = new PayoutService();
const otpService = new OTPService();
const pushNotificationService = new PushNotificationService();

class EmployeeController {

    async test(req,res){
console.log('hitting');
res.json({success:true})
    }

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
            const employee = await employeeService.updateFcmToken(user_id, fcmToken);
            return res.json(employee);
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async addTip(req, res) {
        try {
            const result = await employeeService.addTip(req.body);
            if (result.status === 201) {
                const employee = await employeeService.getEmployeeById(req.body.user_id);
                if (employee && employee.fcmToken) {
                    await pushNotificationService.sendNotification(
                        employee.fcmToken, "New Tip Received", 
                        `You got a tip of ₹${req.body.amount}.`
                    );
                }
            }
            return res.status(result.status).json(result);
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
            const result = await employeeService.addReview(req.body);
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
}

export default EmployeeController;
