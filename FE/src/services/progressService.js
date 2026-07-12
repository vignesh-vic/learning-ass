import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";

const getDashboardData = async (documentId) => {

    try {

        const response = await axiosInstance.get(API_PATHS.PROGRESS.GET_DASHBOARD_DATA);
        return response.data;

    } catch (error) {
        throw error.response?.data || { message: "failed to get dashboard data." };
    }


}

const progressService = {
    getDashboardData
};

export default progressService;