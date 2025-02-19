import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load service account key JSON
const serviceAccountPath = path.join(__dirname, 'src/v1/config/serviceAccountKey.json');
 // Ensure this file contains the JSON you provided
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// Function to generate a Firebase Token for a test user
async function generateCustomToken(uid) {
    try {
        const customToken = await admin.auth().createCustomToken(uid);
        console.log("✅ Firebase Custom Token:", customToken);
        return customToken;
    } catch (error) {
        console.error("❌ Error generating Firebase Token:", error.message);
    }
}

// Call the function with a test user ID
generateCustomToken("test-employee-uid");
