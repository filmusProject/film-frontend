import axios from "../utils/axiosInstance";

export const searchMovies = async (params: {
    query: string;
    page?: number;
}) => {
    const response = await axios.get("/movie/search", {
        params: {
            query: params.query,
            page: params.page || 1,
        },
    });
    return response.data;
};