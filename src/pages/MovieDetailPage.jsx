// src/pages/MovieDetailPage.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utils/axiosInstance';
import Layout from '../components/Layout'; // 상단/푸터 등 페이지 레이아웃 래퍼

const MovieDetailPage = () => {
  const { movieId, movieSeq } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(0);

  // 1) 상세 정보 요청
  useEffect(() => {
    if (!movieId || !movieSeq) return;

    const fetchMovieDetail = async () => {
      try {
        const res = await axios.get('/movie/detail', {
          params: { movieId, movieSeq },
        });
        setMovie(res.data);
      } catch (err) {
        console.error('영화 정보 가져오기 실패:', err);
      }
    };

    // 2) 리뷰 목록 요청
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`/api/review/${movieId}/${movieSeq}`);
        setReviews(res.data);
      } catch (err) {
        console.error('리뷰 불러오기 실패:', err);
      }
    };

    fetchMovieDetail();
    fetchReviews();
  }, [movieId, movieSeq]);

  // 한줄평 등록
  const handleReviewSubmit = async () => {
    if (!newReview.trim()) return;

    try {
      await axios.post('/api/review', {
        movieId,
        movieSeq,
        content: newReview,
        rating,
      });

      setNewReview('');
      setRating(0);

      // 등록 후 리뷰 목록 새로고침
      const res = await axios.get(`/api/review/${movieId}/${movieSeq}`);
      setReviews(res.data);
    } catch (err) {
      console.error('리뷰 등록 실패:', err);
    }
  };

  // 로딩 중일 경우
  if (!movie) {
    return (
        <Layout>
          <div className="text-white p-8">
            로딩 중...
          </div>
        </Layout>
    );
  }

  return (
      <Layout>
        {/* 전체 컨테이너 */}
        <div className="min-h-screen bg-[#121212] text-white font-sans py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-16">

            {/* 영화 기본 정보 카드 */}
            <div className="bg-[#2A2A2A] rounded-lg overflow-hidden flex flex-col md:flex-row shadow-md">
              {/* 포스터 영역 */}
              <img
                  src={movie.posterUrl || 'https://via.placeholder.com/213x305?text=No+Image'}
                  alt={movie.title}
                  className="md:w-[213px] md:h-[305px] w-full object-cover rounded-md md:rounded-none md:rounded-l-lg"
              />

              {/* 영화 상세 정보 */}
              <div className="p-6 flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  {/* 제목, 연도 */}
                  <div>
                    <h1 className="text-3xl font-bold mb-1">
                      {movie.title}{' '}
                      <span className="text-xl text-gray-400">
                      ({movie.prodYear})
                    </span>
                    </h1>
                    {/* 영화 메타정보 (감독, 장르 등) */}
                    <div className="text-sm text-gray-300 space-y-2 mt-2">
                      {/* flex-wrap으로 가로 정렬 */}
                      <div className="flex flex-wrap gap-x-6 gap-y-1">
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-gray-400">감독:</span>
                          <span>{movie.directorNm}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-gray-400">장르:</span>
                          <span>{movie.genre}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-gray-400">등급:</span>
                          <span>{movie.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-gray-400">시간:</span>
                          <span>{movie.runtime}분</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-gray-400">제작사:</span>
                          <span>{movie.company}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-gray-400">국가:</span>
                          <span>{movie.nation}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-gray-400">개봉:</span>
                          <span>{movie.repRlsDate}</span>
                        </div>
                      </div>

                      {/* 출연 (actorNm) */}
                      {movie.actorNm && (
                          <div>
                            <span className="font-medium text-gray-400">출연:</span>{' '}
                            <span>{movie.actorNm}</span>
                          </div>
                      )}

                      {/* 키워드 */}
                      {movie.keywords && (
                          <div>
                            <span className="font-medium text-gray-400">키워드:</span>{' '}
                            <span>{movie.keywords}</span>
                          </div>
                      )}

                      {/* KMDb 링크 */}
                      {movie.kmdbUrl && (
                          <div>
                            <a
                                href={movie.kmdbUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-custom hover:underline"
                            >
                              KMDb에서 더 보기 →
                            </a>
                          </div>
                      )}
                    </div>
                  </div>

                  {/* 찜하기 버튼 */}
                  <button className="bg-custom hover:bg-custom/80 text-white px-4 py-2 rounded-button flex items-center gap-2 h-10">
                    <i className="fas fa-star"></i>찜하기
                  </button>
                </div>

                {/* 줄거리 */}
                {movie.plot && (
                    <div>
                      <h2 className="text-xl font-bold mb-2">📘 줄거리</h2>
                      <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                        {movie.plot}
                      </p>
                    </div>
                )}

                {/* 수상 이력 */}
                {movie.awards1 && (
                    <div>
                      <h2 className="text-xl font-bold mb-2">🏆 수상 이력</h2>
                      <p className="text-gray-300 text-sm">
                        {movie.awards1}
                      </p>
                    </div>
                )}
              </div>
            </div>

            {/* 한줄평 작성 */}
            <div className="bg-[#2A2A2A] rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-bold mb-4">✍️ 한줄평 작성</h2>
              <div className="flex flex-col gap-4 sm:flex-row">
              <textarea
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  placeholder="이 영화에 대한 나만의 한줄평을 남겨보세요!"
                  className="flex-1 bg-[#1E1E1E] border-0 rounded-button px-4 py-2 text-white placeholder-gray-400"
                  rows={3}
              />
                <div className="flex items-center gap-2">
                  <label className="text-sm">⭐</label>
                  <input
                      type="number"
                      min="0"
                      max="5"
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      className="w-16 bg-[#1E1E1E] text-white rounded px-2 py-1"
                  />
                  <button
                      onClick={handleReviewSubmit}
                      className="bg-custom text-white px-6 py-2 rounded-button"
                  >
                    등록
                  </button>
                </div>
              </div>
            </div>

            {/* 한줄평 목록 */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-2">💬 한줄평</h2>
              {reviews.length === 0 ? (
                  <p className="text-gray-400">아직 작성된 한줄평이 없습니다.</p>
              ) : (
                  <div className="space-y-4">
                    {reviews.map((r, i) => (
                        <div
                            key={i}
                            className="bg-[#2A2A2A] rounded-lg p-4 shadow-sm"
                        >
                          {/* 별점 표시 */}
                          <div className="flex items-center gap-2 mb-1 text-yellow-400 text-sm">
                            {Array.from({ length: Math.floor(r.rating) }).map((_, j) => (
                                <i key={j} className="fas fa-star" />
                            ))}
                            {r.rating % 1 !== 0 && <i className="fas fa-star-half-alt" />}
                            <span className="text-gray-400 ml-2">{r.rating.toFixed(1)}</span>
                          </div>
                          {/* 리뷰 내용 */}
                          <p className="text-gray-300 text-sm">{r.content}</p>
                        </div>
                    ))}
                  </div>
              )}
            </div>

            {/* 추천 영화 */}
            <div>
              <h2 className="text-xl font-bold mb-4">🎬 추천 영화</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                    <div
                        key={num}
                        className="bg-[#2A2A2A] rounded-lg overflow-hidden hover:shadow-lg"
                    >
                      <img
                          src="https://via.placeholder.com/192x288?text=Poster"
                          alt={`추천영화${num}`}
                          className="w-full h-72 object-cover"
                      />
                      <div className="p-2 flex justify-between items-center text-sm">
                        <span>추천 영화 {num}</span>
                        <span className="opacity-70">2024</span>
                      </div>
                    </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </Layout>
  );
};

export default MovieDetailPage;