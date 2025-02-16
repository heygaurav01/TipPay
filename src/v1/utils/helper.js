import { validationResult } from 'express-validator';
import nodemailer from 'nodemailer';
import {config} from 'dotenv'
config();
import jwt from 'jsonwebtoken'
export const validationMiddleware = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        return res.status(400).json({ errors: errorMessages });
    }
    next();
};

// email verification transporter
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    starttls: {
        enable: true,
    },
    secureConnection: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    from: process.env.EMAIL_FROM,
});

const sendMailAsync = (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Email verification",
        text: `<h1>Your email verification otp ${otp}</h1>`,
    };
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                reject({
                    success: false,
                    message: err.message,
                });
            } else {
                resolve({
                    success: true,
                    message: "Check your email",
                });
            }
        });
    });
};

export const sendMailOtp = async (email, otp) => {
    try {
        const result = await sendMailAsync(email, otp);
        return result;
    } catch (error) {
        return error;
    }
};

export const roundNumber = (number) => {
    return Math.round(number);
}


export const jwtSign = (id) => {
    const token = jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
}

export const jwtVerify = (token) => {
    const verify_token = jwt.verify(
        token,
        process.env.JWT_SECRET,
    );
    return verify_token;
}