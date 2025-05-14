// src/api/review.ts
import axiosInstance from '../utils/axiosInstance';

export const fetchUserReviews = async () => {
    const res = await axiosInstance.get('/reviews/user');
    return res.data; // [{ reviewId, title, rating, content, posterUrl, createdAt }]
};