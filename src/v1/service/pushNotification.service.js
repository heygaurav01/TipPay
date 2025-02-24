import admin from 'firebase-admin';

class PushNotificationService {
    async sendNotification(token, title, body, data = {}) {
        try {
            const message = {
                token: token,
                notification: { title, body },
                data: data,
                android: { priority: "high", notification: { sound: "default" } },
                apns: { payload: { aps: { sound: "default" } } }
            };

            const response = await admin.messaging().send(message);
            console.log("Notification sent:", response);
            return { success: true, response };
        } catch (error) {
            console.error("Notification failed:", error);
            return { success: false, message: error.message };
        }
    }

    async notifyPayoutApproval(token, amount) {
        const title = "Payout Approved";
        const body = `Your payout request of ₹${amount} has been approved.`;
        return this.sendNotification(token, title, body);
    }

    async notifyLowPerformance(token, employeeName) {
        const title = "Performance Alert";
        const body = `Employee ${employeeName} is flagged for low performance.`;
        return this.sendNotification(token, title, body);
    }

    async notifyPaymentIssue(token, employeeName, issue) {
        const title = "Payment Issue";
        const body = `Payment issue for ${employeeName}: ${issue}`;
        return this.sendNotification(token, title, body);
    }

    async notifySystemUpdate(token, updateMessage) {
        const title = "System Update";
        const body = updateMessage;
        return this.sendNotification(token, title, body);
    }

    async notifyComplianceRequirement(token, complianceMessage) {
        const title = "Compliance Requirement";
        const body = complianceMessage;
        return this.sendNotification(token, title, body);
    }
}

export default new PushNotificationService();