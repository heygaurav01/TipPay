import { auth } from '../config/firebaseAdmin.config.js'; // ✅ Import admin

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

            const response = await admin.messaging().send(message); // ✅ Use admin.messaging()
            console.log("✅ Notification sent:", response);
            return { success: true, response };
        } catch (error) {
            console.error("❌ Notification failed:", error);
            return { success: false, message: error.message };
        }
    }
}

export default PushNotificationService;