import employerService from "../service/employer.service.js";
import employerPerformanceService from "../service/employerPerformance.service.js"; // ✅ New Import
import payoutControlService from "../service/payoutControl.service.js";
import pushNotificationService from "../service/pushNotification.service.js"; // ✅ New Import

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

    async authorizePayout(req, res) {
        try {
            const { employeeId, amount, method } = req.body;
            const result = await payoutControlService.authorizePayout(employeeId, amount, method);
            
            if (result.status === 200) {
                await pushNotificationService.notifyPayoutApproval(req.user.id, result.employeeName, amount);
            }

            return res.status(result.status).json(result);
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async notifyLowPerformance(req, res) {
        try {
            const { employeeName } = req.body;
            const result = await pushNotificationService.notifyLowPerformance(req.user.id, employeeName);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async notifyPaymentIssue(req, res) {
        try {
            const { employeeName, issue } = req.body;
            const result = await pushNotificationService.notifyPaymentIssue(req.user.id, employeeName, issue);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async notifySystemUpdate(req, res) {
        try {
            const { updateMessage } = req.body;
            const result = await pushNotificationService.notifySystemUpdate(req.user.id, updateMessage);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async notifyComplianceRequirement(req, res) {
        try {
            const { complianceMessage } = req.body;
            const result = await pushNotificationService.notifyComplianceRequirement(req.user.id, complianceMessage);
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
