/* -----------------------------------------------
   src/pages/MovieDetailPage.tsx
------------------------------------------------ */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utils/axiosInstance';
import Layout from '../components/layout/Layout';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import {
  checkBookmark,
  addBookmark,
  removeBookmark,
} from '../services/bookmarkService';

/* ===== 타입 ===== */
interface Movie {
  id: number;
  movieId: string;
  movieSeq: string;
  title: string;
  prodYear: string;
  posterUrl: string;
  stillUrl?: string;
  backdropUrl?: string;
  directorNm?: string;
  genre?: string;
  rating?: string;
  runtime?: string;
  company?: string;
  nation?: string;
  repRlsDate?: string;
  actorNm?: string;
  keywords?: string;
  kmdbUrl?: string;
  plot?: string;
  awards1?: string;
}

interface Review {
  reviewId: number;
  userNickname: string;
  avatarUrl?: string;
  rating: number;
  content: string;
}

/* ===== 컴포넌트 ===== */
const MovieDetailPage: React.FC = () => {
  /* --- 라우터 파라미터 & 컨텍스트 --- */
  const { movieId, movieSeq } = useParams();
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();

  /* --- 상태 --- */
  const [movie, setMovie] = useState<Movie | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(0);
  const [showAllReviews, setShowAll] = useState(false);
  const [booked, setBooked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(true);

  // 1. 영화 정보 로드
  useEffect(() => {
    if (!movieId || !movieSeq) return;

    const fetchMovie = async () => {
      try {
        const { data } = await axios.get<Movie>('/movie/detail', {
          params: { movieId, movieSeq },
        });
        setMovie({
          ...data,
          backdropUrl: data.stillUrl || data.posterUrl,
        });
      } catch (e) {
        console.error('영화 상세 조회 실패', e);
      }
    };

    fetchMovie();
  }, [movieId, movieSeq]);

// 2. 리뷰 정보 로드 (movie가 로딩된 이후에)
  useEffect(() => {
    if (!movie?.id) return;

    const fetchReviews = async () => {
      try {
        const { data } = await axios.get<Review[]>(
            `/reviews/movie/${movie.id}`
        );
        setReviews(data);
      } catch (e) {
        console.error('리뷰 조회 실패', e);
      }
    };

    fetchReviews();
  }, [movie]);
  /* --- 북마크 여부 확인 ------------------------------ */
  useEffect(() => {
    if (!movieId || !isAuthenticated) {
      setBookmarkLoading(false);
      return;
    }
    const fetchBookmark = async () => {
      try {
        const isBookmarked = await checkBookmark(Number(movie?.id));
        setBooked(isBookmarked);
      } catch (e) {
        console.error('북마크 상태 확인 실패', e);
      } finally {
        setBookmarkLoading(false);
      }
    };
    fetchBookmark();
  }, [movie?.id, isAuthenticated]);

  /* --- 북마크 토글 ------------------------------- */
  const handleBookmarkClick = async () => {
    if (!isAuthenticated) {
      return alert('로그인이 필요합니다.');
    }
    try {
      if (booked) {
        await removeBookmark(Number(movie?.id));
      } else {
        await addBookmark(Number(movie?.id));
      }
      setBooked((prev) => !prev);
    } catch (e) {
      console.error('북마크 처리 실패', e);
      alert('북마크 처리 중 오류가 발생했습니다.');
    }
  };

  /* --- 한줄평 등록 ------------------------------- */
  const handleSubmitReview = async () => {
    if (!isAuthenticated) return alert('로그인이 필요합니다.');
    if (rating === 0 || !newReview.trim()) {
      return alert('별점과 내용을 모두 입력하세요.');
    }
    try {
      await axios.post('/reviews', {
        movieId : movie?.id,
        rating,
        content: newReview.trim(),
      });
      setNewReview('');
      setRating(0);
      const { data } = await axios.get<Review[]>(
          `/reviews/movie/${movie?.id}`,
      );
      setReviews(data);
    } catch (e) {
      console.error('리뷰 등록 실패', e);
      alert('리뷰 등록 중 오류가 발생했습니다.');
    }
  };

  /* --- 로딩 상태 (영화) ---------------------------- */
  if (!movie) {
    return (
        <Layout>
          <div className="text-center py-32">로딩 중…</div>
        </Layout>
    );
  }

  const visibleReviews = showAllReviews ? reviews : reviews.slice(0, 6);

  /* ===== 렌더 ===== */
  return (
      <Layout>
        {/* ---------- Hero 섹션 (블러 + 오버레이) ---------- */}
        <div className="relative overflow-hidden">
          {/* 1) 블러‧확대된 뒷배경 */}
          {movie.backdropUrl && (
              <div
                  className="absolute inset-0 bg-cover bg-center scale-110 will-change-transform"
                  style={{
                    backgroundImage: `url(${movie.backdropUrl})`,
                    filter: 'blur(12px)',
                  }}
              />
          )}

          {/* 2) 투명 오버레이 : 테마별 색감 */}
          <div
              className={`absolute inset-0 ${
                  theme === 'dark'
                      ? 'bg-black/60 backdrop-blur-sm'
                      : 'bg-white/60 backdrop-blur-sm'
              }`}
          />

          {/* 실제 콘텐츠 */}
          <div className="relative z-10 container mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row gap-8">
              {/* 포스터 + 북마크 버튼 */}
              <div className="flex-shrink-0">
                <div className="relative w-64 md:w-56 sm:w-40 mx-auto md:mx-0">
                  <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-full aspect-[2/3] object-cover rounded-lg shadow-lg"
                  />
                  {!bookmarkLoading && (
                      <button
                          onClick={handleBookmarkClick}
                          className={`absolute -top-3 -right-3 p-3 rounded-full backdrop-blur-md
                      ${
                              theme === 'dark'
                                  ? 'bg-gray-800/70'
                                  : 'bg-white/70'
                          } shadow-lg`}
                          aria-label={booked ? '북마크 제거' : '북마크 추가'}
                      >
                        <i
                            className={`${booked ? 'fas' : 'far'} fa-heart ${
                                booked ? 'text-[#FF574F]' : 'text-gray-400'
                            } text-xl`}
                        />
                      </button>
                  )}
                </div>
              </div>

              {/* 영화 메타데이터 */}
              <div className="flex-grow">
                <div className="flex flex-wrap items-start justify-between">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    {movie.title}
                  </h1>
                  <div
                      className={`px-4 py-1 rounded-full text-sm font-medium backdrop-blur-sm
                    ${
                          theme === 'dark'
                              ? 'bg-gray-800/80'
                              : 'bg-gray-200/80'
                      }`}
                  >
                    {movie.prodYear}
                  </div>
                </div>

                {/* 메타 정보 표 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm">
                  {movie.directorNm && (
                      <p>
                        <span className="text-gray-400 mr-1">감독:</span>
                        {movie.directorNm}
                      </p>
                  )}
                  {movie.runtime && (
                      <p>
                        <span className="text-gray-400 mr-1">상영시간:</span>
                        {Math.floor(Number(movie.runtime) / 60)}시간{' '}
                        {Number(movie.runtime) % 60}분
                      </p>
                  )}
                  {movie.nation && (
                      <p>
                        <span className="text-gray-400 mr-1">국가:</span>
                        {movie.nation}
                      </p>
                  )}
                  {movie.rating && (
                      <p>
                        <span className="text-gray-400 mr-1">연령 등급:</span>
                        {movie.rating}
                      </p>
                  )}
                  {movie.repRlsDate && (
                      <p>
                        <span className="text-gray-400 mr-1">개봉:</span>
                        {movie.repRlsDate}
                      </p>
                  )}
                  {movie.company && (
                      <p>
                        <span className="text-gray-400 mr-1">제작사:</span>
                        {movie.company}
                      </p>
                  )}
                </div>

                {/* 장르 뱃지 */}
                {movie.genre && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {movie.genre.split(',').map((g) => (
                          <span
                              key={g}
                              className="bg-gray-700/60 text-white px-3 py-1 text-xs rounded-full"
                          >
                      {g.trim()}
                    </span>
                      ))}
                    </div>
                )}

                {/* 줄거리 */}
                {movie.plot && (
                    <p className="leading-relaxed mb-4">{movie.plot}</p>
                )}

                {/* KMDb 링크 */}
                {movie.kmdbUrl && (
                    <a
                        href={movie.kmdbUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#FF574F] hover:underline text-sm"
                    >
                      KMDb에서 자세히 보기 →
                    </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ---------- 리뷰 입력 ---------- */}
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-6">한줄평 작성</h2>

          <div
              className={`p-6 rounded-lg shadow-md mb-12 ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}
          >
            {/* 별점 선택 */}
            <label className="block mb-3 font-medium text-sm">
              나의 별점
              <span className="ml-2 text-yellow-400">{rating}/5</span>
            </label>
            <div className="mb-6 flex">
              {[1, 2, 3, 4, 5].map((s) => (
                  <button
                      key={s}
                      onClick={() => setRating(s)}
                      className="text-2xl focus:outline-none"
                  >
                    <i
                        className={`fa-star ${
                            rating >= s
                                ? 'fas text-yellow-400'
                                : 'far text-gray-400'
                        }`}
                    />
                  </button>
              ))}
            </div>

            {/* 내용 입력 */}
            <textarea
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                placeholder="이 영화에 대한 나만의 한줄평을 입력하세요…"
                maxLength={200}
                rows={4}
                className={`w-full p-4 rounded-lg border focus:ring-2 focus:ring-[#FF574F] min-h-[120px]
              ${
                    theme === 'dark'
                        ? 'bg-gray-700 border-gray-600'
                        : 'bg-gray-50 border-gray-200'
                }`}
            />

            <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
              <span>{newReview.length}/200</span>
              <button
                  onClick={handleSubmitReview}
                  className="bg-[#FF574F] text-white px-6 py-2 rounded-full hover:bg-[#e14c44] active:scale-95 transition"
              >
                등록
              </button>
            </div>
          </div>

          {/* ---------- 리뷰 리스트 ---------- */}
          <h2 className="text-2xl font-bold mb-6">한줄평</h2>

          {reviews.length === 0 ? (
              <p className="text-gray-400">
                아직 작성된 한줄평이 없습니다.
              </p>
          ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {visibleReviews.map((r) => (
                      <div
                          key={r.reviewId}
                          className={`p-6 rounded-lg shadow-md hover:shadow-lg transition ${
                              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                          }`}
                      >
                        <div className="flex items-center mb-3">
                          <img
                              src={
                                  r.avatarUrl ||
                                  'https://via.placeholder.com/50x50?text=User'
                              }
                              alt={r.userNickname}
                              className="w-10 h-10 rounded-full mr-3"
                          />
                          <div>
                            <p className="font-medium">{r.userNickname}</p>
                            <div className="flex items-center text-sm">
                              <i className="fas fa-star text-yellow-400 mr-1" />
                              {r.rating}/5
                            </div>
                          </div>
                        </div>
                        <p className="text-sm leading-relaxed">{r.content}</p>
                      </div>
                  ))}
                </div>

                {reviews.length > 6 && (
                    <div className="text-center mb-12">
                      <button
                          onClick={() => setShowAll((prev) => !prev)}
                          className={`px-6 py-3 rounded-full font-medium transition
                    ${
                              theme === 'dark'
                                  ? 'bg-gray-700 hover:bg-gray-600'
                                  : 'bg-gray-200 hover:bg-gray-300'
                          }`}
                      >
                        {showAllReviews ? '접기' : '더 보기'}
                      </button>
                    </div>
                )}
              </>
          )}
        </div>
      </Layout>
  );
};

export default MovieDetailPage;