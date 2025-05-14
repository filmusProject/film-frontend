import axiosInstance from '../utils/axiosInstance';

/**
 * 북마크 여부 확인
 * @param movieId 영화 ID
 * @returns boolean (찜 여부)
 */
export const checkBookmark = async (movieId: number): Promise<boolean> => {
    if (!movieId) throw new Error('movieId는 필수입니다.');
    const res = await axiosInstance.get(`/bookmarks/check?movieId=${movieId}`);
    return res.data.bookmarked;
};

/**
 * 북마크 등록
 * @param movieId 영화 ID
 */
export const addBookmark = async (movieId: number): Promise<void> => {
    if (!movieId) throw new Error('movieId는 필수입니다.');
    await axiosInstance.post(`/bookmarks?movieId=${movieId}`);
};

/**
 * 북마크 해제
 * @param movieId 영화 ID
 */
export const removeBookmark = async (movieId: number): Promise<void> => {
    if (!movieId) throw new Error('movieId는 필수입니다.');
    await axiosInstance.delete(`/bookmarks?movieId=${movieId}`);
};