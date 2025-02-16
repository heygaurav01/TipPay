import { body, validationResult } from 'express-validator';
import { validationMiddleware } from '../utils/helper.js';

export const validateCreateEmployee = [
  body('fullName')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Full name must be between 3 and 100 characters'),

  body('profilePicture')
    .optional()
    .isURL()
    .withMessage('Profile picture must be a valid URL'),

  body('jobTitle')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Job title must be between 2 and 50 characters'),

  body('department')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Department must be between 2 and 50 characters'),

  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required'),

  body('phoneNumber')
    .trim()
    .matches(/^[0-9]{10,11}$/)
    .withMessage('Phone number must be between 10 and 11 digits'),
  validationMiddleware,
];
export const validateVerifyEmailEmployee = [

  body('email')
    .trim()
    .notEmpty()
    .withMessage('email is required').bail().isEmail().withMessage('email must be a valid email'),

  body('emailOtp')
    .trim()
    .notEmpty()
    .withMessage('email otp is required'),
  validationMiddleware,
];
export const validateMobileOtpEmployee = [

  body('phoneNumber')
    .trim()
    .notEmpty()
    .withMessage('phoneNumber is required')
    .bail()
    .matches(/^[0-9]{10,11}$/)
    .withMessage('Phone number must be between 10 and 11 digits'),
  validationMiddleware,
];


export const validateVerifyPhoneNumberEmployee = [

  body('phoneNumber')
    .trim()
    .notEmpty()
    .withMessage('phone number is required'),

  body('phoneOtp')
    .trim()
    .notEmpty()
    .withMessage('email otp is required'),
  validationMiddleware,
];


export const validateSetPinCodeEmployee = [

  body('pinCode')
    .trim()
    .notEmpty()
    .withMessage('pinCode is required'),
  validationMiddleware,
];