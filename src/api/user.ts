// src/api/user.ts
import axiosInstance from '../utils/axiosInstance';

export const fetchBookmarks = async () => {
    const res = await axiosInstance.get('/api/user/bookmarks');
    return res.data; // [{ movieId, title, posterUrl }]
};