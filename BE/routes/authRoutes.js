
import express from 'express'
import { body } from 'express-validator'
import {login,register,getProfile, updateProfile, changePassword} from '../controllers/authController'
import protect from "../middleware/auth.js"

const router = express.Router()

