import admin from "firebase-admin";
import Employer from "../model/Employer.model.js";

class EmployerNotificationService {
    async sendNotification(fcmToken, title, body) {
        try {
            const message = {
                notification: { title, body },
                token: fcmToken,
            };

            const response = await admin.messaging().send(message);
            return { success: true, message: "Notification sent successfully", response };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    async notifyLowPerformance(employerId, employeeName) {
        try {
            const employer = await Employer.findById(employerId);
            if (!employer || !employer.fcmToken) {
                return { success: false, message: "Employer not found or FCM token missing" };
            }

            return await this.sendNotification(
                employer.fcmToken,
                "Employee Performance Alert ",
                `Your employee ${employeeName} has low performance. Consider taking action.`
            );
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    async notifyPayoutApproval(employerId, employeeName, amount) {
        try {
            const employer = await Employer.findById(employerId);
            if (!employer || !employer.fcmToken) {
                return { success: false, message: "Employer not found or FCM token missing" };
            }

            return await this.sendNotification(
                employer.fcmToken,
                "Payout Approved ",
                `A payout of ₹${amount} for employee ${employeeName} has been approved.`
            );
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    async notifyPaymentIssue(employerId, employeeName, issue) {
        try {
            const employer = await Employer.findById(employerId);
            if (!employer || !employer.fcmToken) {
                return { success: false, message: "Employer not found or FCM token missing" };
            }

            return await this.sendNotification(
                employer.fcmToken,
                "Payment Issue ",
                `There is a payment issue for employee ${employeeName}: ${issue}. Please review.`
            );
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    async notifySystemUpdate(employerId, updateMessage) {
        try {
            const employer = await Employer.findById(employerId);
            if (!employer || !employer.fcmToken) {
                return { success: false, message: "Employer not found or FCM token missing" };
            }

            return await this.sendNotification(
                employer.fcmToken,
                "System Update ",
                updateMessage
            );
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    async notifyComplianceRequirement(employerId, complianceMessage) {
        try {
            const employer = await Employer.findById(employerId);
            if (!employer || !employer.fcmToken) {
                return { success: false, message: "Employer not found or FCM token missing" };
            }

            return await this.sendNotification(
                employer.fcmToken,
                "Compliance Requirement ",
                complianceMessage
            );
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
}

export default new EmployerNotificationService();
