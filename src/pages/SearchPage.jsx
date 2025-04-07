// src/pages/SearchPage.jsx

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import axios from '../utils/axiosInstance'; // baseURL 설정된 axios

const SearchPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // 검색어 (URL 쿼리에서 가져옴)
    const [query, setQuery] = useState(() => {
        return new URLSearchParams(location.search).get('query') || '';
    });

    // 검색 결과
    const [movies, setMovies] = useState([]);
    const [totalCount, setTotalCount] = useState(0);

    // 페이지네이션
    const [page, setPage] = useState(1); // 현재 페이지 (1부터 시작)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 검색 API 호출
    const fetchSearch = async (keyword, pageNumber) => {
        if (!keyword.trim()) return;
        setLoading(true);
        setError(null);

        try {
            // 서버에서 page, query를 받아 SearchResponseDTO 형태로 응답한다고 가정
            const res = await axios.get('/movie/search', {
                params: {
                    query: keyword,
                    page: pageNumber,
                },
            });
            setMovies(res.data.movies); // MovieSimpleDTO 리스트
            setTotalCount(res.data.totalCount);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    // 컴포넌트 첫 렌더링 시 / query or page가 바뀔 때마다 재검색
    useEffect(() => {
        fetchSearch(query, page);
    }, [query, page]);

    // 검색창에서 엔터/버튼 클릭 시 호출
    const handleSearch = () => {
        // 검색어가 없는 경우 return
        if (!query.trim()) return;
        // 페이지 초기화
        setPage(1);
        // pushState로 주소에 query 반영 (옵션)
        navigate(`/search?query=${encodeURIComponent(query)}`);
        // API 호출
        fetchSearch(query, 1);
    };

    // 페이지 개수
    const PER_PAGE = 50; // 한 페이지에 50개씩이라고 가정
    const totalPages = Math.ceil(totalCount / PER_PAGE);

    // 페이지 변경
    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <Layout>
            <div className="min-h-screen bg-[#121212] text-white font-sans">
                {/* 검색창 섹션 (상단 중앙) */}
                <div className="max-w-2xl mx-auto py-8 px-4">
                    <h1 className="text-2xl font-bold mb-4 text-center">영화 검색</h1>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSearch();
                            }}
                            placeholder="영화 제목, 키워드, 감독을 입력하세요"
                            className="flex-1 bg-[#2A2A2A] border-0 rounded-button pl-3 pr-3 py-2 text-white placeholder-gray-400 focus:outline-none"
                        />
                        <button
                            onClick={handleSearch}
                            className="bg-custom text-white px-4 py-2 rounded-button"
                        >
                            검색
                        </button>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-6">
                    {loading && <div className="text-gray-400">검색 중입니다...</div>}
                    {error && (
                        <div className="text-red-400">
                            에러가 발생했습니다: {error.message || '알 수 없는 에러'}
                        </div>
                    )}
                    {!loading && !error && movies.length === 0 && query && (
                        <div className="text-gray-400">검색 결과가 없습니다.</div>
                    )}

                    {/* 검색 결과 */}
                    {movies.length > 0 && (
                        <div>
                            <p className="mb-2 text-sm text-gray-400">
                                총 <span className="font-medium">{totalCount}</span> 개 결과
                                (페이지 {page}/{totalPages})
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                {movies.map(({ movieId, movieSeq, posterUrl, title, year }) => (
                                    <Link
                                        key={`${movieId}-${movieSeq}`}
                                        to={`/movie-detail/${movieId}/${movieSeq}`}
                                        className="bg-[#2A2A2A] rounded-lg overflow-hidden hover:shadow-lg"
                                    >
                                        <img
                                            src={
                                                posterUrl ||
                                                'https://via.placeholder.com/192x288?text=No+Image'
                                            }
                                            alt={title.trim()}
                                            className="w-full h-72 object-cover"
                                        />
                                        <div className="p-2 flex justify-between items-center text-sm">
                                            <span>{title.trim()}</span>
                                            <span className="opacity-70">{year}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 페이지네이션 버튼 */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center mt-6 gap-2">
                            <button
                                onClick={() => handlePageChange(page - 1)}
                                className="px-3 py-1 text-sm bg-[#2A2A2A] rounded text-gray-300 hover:bg-custom"
                                disabled={page <= 1}
                            >
                                이전
                            </button>
                            {/* 간단 버튼; 필요하면 start~end 계산해서 맵핑 가능 */}
                            <span className="text-gray-300">
                {page} / {totalPages}
              </span>
                            <button
                                onClick={() => handlePageChange(page + 1)}
                                className="px-3 py-1 text-sm bg-[#2A2A2A] rounded text-gray-300 hover:bg-custom"
                                disabled={page >= totalPages}
                            >
                                다음
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default SearchPage;