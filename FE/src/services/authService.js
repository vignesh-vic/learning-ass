import { API_PATHS } from "../utils/apiPath";
import axiosInstance from "../utils/axiosInstance";


const login = async (email, password) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {email,password});   
        return response.data;
    } catch (error) {
        throw error.response?.data || {message: "An error occurred during login."};
    }
};

const register = async (username, email, password) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {username, email, password});
        return response.data;
    } catch (error) {
        throw error.response?.data || {message: "An error occurred during registration."};
    }
};

const getProfile = async () => {
    try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
        return response.data;
    } catch (error) {
        throw error.response?.data || {message: "An error occurred while fetching the profile."};
    }   
};

const updateProfile = async (userData) => {
    try {
        const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || {message: "An error occurred while updating the profile."};
    }
};

const changePassword = async (passwords) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AUTH.CHANGE_PASSWORD, passwords);
        return response.data;
    } catch (error) {
        throw error.response?.data || {message: "An error occurred"};
    }
};

const authService = {
    login,
    register,
    getProfile,
    updateProfile,
    changePassword
};


export default authService;