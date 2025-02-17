import EmployeeService from "../service/employee.service.js";
import { roundNumber } from "../utils/helper.js";
import FirestoreService from '../service/firestore.service.js';

const employeeService = new EmployeeService();
const firestoreService = new FirestoreService();

class EmployeeController {
    register = async (req, res) => {
        try {
            let result = await employeeService.register(req.body);
            return res.json(result);
        } catch (err) {
            return res.status(500).json({
                'success': false,
                'message': err.message
            });
        }
    }
    
    login = async (req, res) => {
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

    verifyEmail = async (req, res) => {
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

    mobileOtp = async (req, res) => {
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

    verifyPhoneNumber = async (req, res) => {
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

    setPinCode = async (req, res) => {
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

    qrcodeLink = async (req, res) => {
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

    verifyBank = async (req, res) => {
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

    updateProfile = async (req, res) => {
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

    updateBankDetails = async (req, res) => {
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
}

export default EmployeeController;