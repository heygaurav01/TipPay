import employerService from "../service/employer.service.js";
import employerPerformanceService from "../service/employerPerformance.service.js";
import payoutControlService from "../service/payoutControl.service.js";
import pushNotificationService from "../service/pushNotification.service.js";
import jwt from 'jsonwebtoken';
import Employee from "../model/Employee.model.js";

class EmployerController {
    async getEmployees(req, res) {
        try {
            const employerId = req.user.id;
            const result = await employerService.getEmployeesByEmployer(employerId);
            return res.status(result.status).json(result);
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async getEmployeePerformance(req, res) {
        try {
            const { employeeId } = req.params;
            const result = await employerPerformanceService.getEmployeePerformance(employeeId);
            return res.status(result.status).json(result);
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async getTopPerformers(req, res) {
        try {
            const employerId = req.user.id;
            const result = await employerPerformanceService.getTopPerformers(employerId);
            return res.status(result.status).json(result);
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async flagLowPerformers(req, res) {
        try {
            const employerId = req.user.id;
            const result = await employerPerformanceService.flagLowPerformers(employerId);
            return res.status(result.status).json(result);
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
async getEmployees(req, res) {
        try {
            const employerId = req.user.id;
            const result = await employerService.getEmployeesByEmployer(employerId);
            return res.status(result.status).json(result);
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
async getEmployees(req, res) {
        try {
            const employerId = req.user.id;
            const result = await employerService.getEmployeesByEmployer(employerId);
            return res.status(result.status).json(result);
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
async getEmployees(req, res) {
        try {
            const employerId = req.user.id;
            const result = await employerService.getEmployeesByEmployer(employerId);
            return res.status(result.status).json(result);
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async authorizePayout(req, res) {
        try {
            const { employeeId, amount, method } = req.body;
            const result = await payoutControlService.authorizePayout(employeeId, amount, method);

            if (result.status === 200) {
                const employee = await Employee.findById(employeeId);
                if (employee && employee.fcmToken) {
                    await pushNotificationService.notifyPayoutApproval(employee.fcmToken, amount);
                }
                return res.status(200).json({ success: true, message: "Payout authorized successfully", payout: result.payout });
            }

            return res.status(result.status).json(result);
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async notifyLowPerformance(req, res) {
        try {
            const { employeeName } = req.body;
    
            // Retrieve the employee from the database based on employeeName
            const employee = await Employee.findOne({ fullName: employeeName });
    
            if (!employee) {
                return res.status(404).json({ success: false, message: 'Employee not found' });
            }
    
            // Log the FCM token
            console.log("FCM Token for " + employeeName + ":", employee.fcmToken);
    
            // Check if the FCM token exists and is a string
            if (!employee.fcmToken) {
                console.error("FCM token is null or undefined.");
                return res.status(500).json({ success: false, message: "FCM token is null or undefined" });
            }
    
            if (typeof employee.fcmToken !== 'string') {
                console.error("FCM token is not a string. Type:", typeof employee.fcmToken);
                return res.status(500).json({ success: false, message: "FCM token is not a string" });
            }
    
            if (employee.fcmToken.trim() === '') {
                console.error("FCM token is an empty string.");
                return res.status(500).json({ success: false, message: "FCM token is an empty string" });
            }
    
            // Log arguments before calling the push notification service
            console.log("Calling pushNotificationService.notifyLowPerformance with:", employee.fcmToken, employeeName);
    
            // Now you have the employee's fcmToken, so you can send the notification
            const result = await pushNotificationService.notifyLowPerformance(employee.fcmToken, employeeName);
    
            // Log the result after calling the push notification service
            console.log("pushNotificationService.notifyLowPerformance result:", result);
    
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }


    async notifyPaymentIssue(req, res) {
        try {
            const { employeeName, issue } = req.body;
            const token = req.headers.authorization.split(' ')[1]; // Extract token from header
            const decoded = jwt.decode(token); // Decode token to get employer ID
            const employerId = decoded.id;
            // Retrieve the employee from the database based on employeeName
            const employee = await Employee.findOne({ fullName: employeeName });

            if (!employee) {
                return res.status(404).json({ success: false, message: 'Employee not found' });
            }
            const result = await pushNotificationService.notifyPaymentIssue(employee.fcmToken, employeeName, issue);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async notifySystemUpdate(req, res) {
        try {
            const { updateMessage } = req.body;
            const token = req.headers.authorization.split(' ')[1]; // Extract token from header
            const decoded = jwt.decode(token); // Decode token to get employer ID
            const employerId = decoded.id;
            // Retrieve the employee from the database based on employeeName
            const employee = await Employee.findOne({ _id: employerId });

            if (!employee) {
                return res.status(404).json({ success: false, message: 'Employee not found' });
            }
            const result = await pushNotificationService.notifySystemUpdate(employee.fcmToken, updateMessage);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async notifyComplianceRequirement(req, res) {
        try {
            const { complianceMessage } = req.body;
            const token = req.headers.authorization.split(' ')[1]; // Extract token from header
            const decoded = jwt.decode(token); // Decode token to get employer ID
            const employerId = decoded.id;
            // Retrieve the employee from the database based on employeeName
            const employee = await Employee.findOne({ _id: employerId });

            if (!employee) {
                return res.status(404).json({ success: false, message: 'Employee not found' });
            }
            const result = await pushNotificationService.notifyComplianceRequirement(employee.fcmToken, complianceMessage);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async setPayoutSchedule(req, res) {
        try {
            const { employeeId, schedule } = req.body;
            const result = await payoutControlService.setPayoutSchedule(employeeId, schedule);
            return res.status(result.status).json(result);
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
}

export default new EmployerController();