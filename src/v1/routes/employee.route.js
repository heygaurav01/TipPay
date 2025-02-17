import express from 'express';
import EmployeeController from '../controller/employee.controller.js';

const router = express.Router();
const employeeController = new EmployeeController();

router.post('/register', employeeController.register);
router.post('/login', employeeController.login);
router.post('/qrcode-link', employeeController.qrcodeLink);
router.post('/add', employeeController.addEmployee);
router.get('/list', employeeController.getEmployees);
router.put('/update-profile', employeeController.updateProfile);
router.put('/update-bank-details', employeeController.updateBankDetails);

export default (app) => {
    app.use('/api/v1/employees', router);
};