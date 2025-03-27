import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout'; // 경로는 src/pages에서 시작한다고 가정

const MovieDetailPage = () => {
  const movie = {
    title: "괴물",
    year: 2006,
    director: "봉준호",
    actors: "송강호, 변희봉",
    genre: "스릴러",
    runtime: 119,
    rating: "15세 관람가",
    company: "쇼박스",
    type: "극영화 / 극장용",
    plot: "한강에 괴물이 출몰한다. 평화롭던 일상은 산산조각 나고, 가족은 위협받는다. 봉준호 감독 특유의 사회 풍자와 인간 본성에 대한 메시지가 돋보이는 작품.",
    awards: "XX영화제 감독상, 시체스 영화제 공식 초청 등"
  };

  const similarMovies = ["기생충", "살인의 추억", "옥자"];

  return (
    <Layout>  {/* Layout 적용 시작 */}
    <div className="min-h-screen bg-[#121212] text-white font-sans px-6 py-20">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3">
            <div className="bg-[#2A2A2A] rounded-lg w-full h-[360px] flex items-center justify-center text-gray-400">
              Poster
            </div>
          </div>
          <div className="w-full md:w-2/3 space-y-3">
            <h1 className="text-3xl font-bold">{movie.title} ({movie.year})</h1>
            <p><strong>감독:</strong> {movie.director}</p>
            <p><strong>배우:</strong> {movie.actors}</p>
            <p><strong>장르:</strong> {movie.genre}</p>
            <p><strong>상영시간:</strong> {movie.runtime}분</p>
            <p><strong>관람등급:</strong> {movie.rating}</p>
            <p><strong>제작사:</strong> {movie.company}</p>
            <p><strong>유형:</strong> {movie.type}</p>
            <button className="mt-4 bg-custom text-white px-4 py-2 rounded-button">⭐ 찜하기</button>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">📘 줄거리</h2>
          <p className="text-gray-200 leading-relaxed">{movie.plot}</p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">🏆 수상 이력</h2>
          <p className="text-gray-200">{movie.awards}</p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">🎬 비슷한 장르의 추천 영화</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {similarMovies.map((title, index) => (
              <Link to="/movie-detail" key={index} className="flex-none w-48 bg-[#2A2A2A] rounded-lg overflow-hidden">
                <div className="h-72 flex items-center justify-center text-gray-400">Poster</div>
                <div className="p-2 text-sm">{title}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default MovieDetailPage;