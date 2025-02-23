import express from 'express';
import EmployeeController from '../controller/employee.controller.js';
//import ReviewController from '../controllers/ReviewController.js';

const router = express.Router();
const employeeController = new EmployeeController();
//const reviewController = new ReviewController(); // Initialize ReviewController


router.post('/register', employeeController.register);
router.post('/login', employeeController.login);
router.post('/qrcode-link', employeeController.qrcodeLink);
router.post('/add', employeeController.addEmployee);
router.get('/list', employeeController.getEmployees);
router.put('/update-profile', employeeController.updateProfile);
router.put('/update-bank-details', employeeController.updateBankDetails);

// Tip Management Routes
router.post('/add-tip', employeeController.addTip);
router.get('/get-tips', employeeController.getTips);
router.get('/get-tip-details', employeeController.getTipDetails);

// Review Management Routes
router.post('/add-review', employeeController.addReview);
router.get('/get-reviews', employeeController.getReviews);
router.get('/get-review-summary', employeeController.getReviewSummary);

// Performance Dashboard Routes
router.get('/get-performance', employeeController.getPerformance);
router.get('/compare-performance', employeeController.comparePerformance);

// Payout Management Routes
router.post('/request-payout', employeeController.requestPayout);
router.get('/get-payout-history', employeeController.getPayoutHistory);

// OTP Management Routes
router.post('/send-otp', employeeController.sendOTP);
router.post('/verify-otp', employeeController.verifyOTP);

// Review Moderation Routes
//router.put('/flag-review', reviewController.flagReview.bind(reviewController));
router.put('/flag-review', employeeController.flagReview);
router.post('/report-review', employeeController.reportReview);

// Update FCM token
router.put('/update-fcm-token', employeeController.updateFcmToken.bind(employeeController));


export default (app) => {
    app.use('/api/v1/employees', router);
};