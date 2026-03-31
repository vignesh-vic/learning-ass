
import express from 'express'
import { body } from 'express-validator'
import {login,register,getProfile, updateProfile, changePassword} from '../controllers/authController.js'
import protect from "../middleware/auth.js"

const router = express.Router()

const registerValidation = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars'),
];
 

const loginValidation = [
    body("email")
        .isEmail()
        .normalizeEmail()
        .withMessage("Please enter a valid email address"),
    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 4 })
        .withMessage("Password must be at least 4 characters long") 
];


router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);

// router.get("/profile", protect, getProfile);
// router.put("/profile", protect, updateProfile);
// router.put("/change-password", protect, changePassword);



export default router