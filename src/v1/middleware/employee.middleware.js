import { config } from 'dotenv'
import { jwtVerify } from '../utils/helper.js';
config();
export const employeeMiddleware = (req, res, next) => {
    try {
        const token = req.headers.user_access_token;
        if (!token) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
        }

        try {
            const { id } = jwtVerify(token); // Assuming jwtVerify returns the decoded token
            req.user_id = id;
        } catch (err) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
        }
    } catch (err) {
        return res.status(403).json({
            success: false,
            message: "Unauthorized",
        });
    }
    next();
};