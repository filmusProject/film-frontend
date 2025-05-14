import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';

const RecommendPage = () => {
  const topics = ['감성적인 밤', '비 오는 날', '스트레스 해소', '따뜻한 가족 이야기'];
  const posterUrls = [
    "http://file.koreafilm.or.kr/thm/02/00/05/49/tn_DPF020204.jpg",
    "http://file.koreafilm.or.kr/thm/02/00/05/14/tn_DPF017995.jpg",
    "http://file.koreafilm.or.kr/thm/02/00/01/43/tn_DPF001960.JPG",
    "http://file.koreafilm.or.kr/thm/02/00/05/25/tn_DPF018752.jpg",
    "http://file.koreafilm.or.kr/thm/02/00/01/89/tn_DPF003179.JPG",
    "http://file.koreafilm.or.kr/thm/02/99/18/04/tn_DPF027183.jpg",
    "http://file.koreafilm.or.kr/thm/02/00/05/37/tn_DPF019398.jpg",
    "http://file.koreafilm.or.kr/thm/02/99/18/28/tn_DPF028491.jpg"
  ];

  const moviesPerTopic = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    title: `추천영화 ${i + 1}`,
    year: 2024 - i,
    image: posterUrls[i] || "https://via.placeholder.com/192x288?text=Movie"
  }));

  return (
      <Layout>
        <div className="min-h-screen bg-[#121212] text-white font-sans px-6 py-20 space-y-16">
          <h1 className="text-2xl font-bold mb-4">🎯 오늘의 추천 테마</h1>
          {topics.map((topic, idx) => (
              <MovieRow key={idx} topic={topic} movies={moviesPerTopic} />
          ))}
        </div>
      </Layout>
  );
};

const MovieRow = ({ topic, movies }) => {
  const scrollRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  const scroll = (offset) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
      <section
          className="relative max-w-[1280px] mx-auto"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
      >
        <h2 className="text-xl font-semibold mb-4 pl-1">#{topic}</h2>

        {/* 스크롤 영역 */}
        <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-2 no-scrollbar scroll-smooth"
        >
          {movies.map((movie) => (
              <Link
                  to="/movie-detail"
                  key={movie.id + topic}
                  className="
          flex-none
          w-[45%] sm:w-[30%] md:w-[22%] lg:w-[17%] xl:w-[15.5%]
          max-w-[200px]
          aspect-[2/3]
          transition-transform duration-300 transform hover:scale-105
        "
              >
                <div className="bg-[#2A2A2A] rounded-lg overflow-hidden h-full">
                  <img src={movie.image} alt={movie.title} className="w-full h-[85%] object-cover" />
                  <div className="h-[15%] px-2 py-1 flex justify-between items-end text-xs">
                    <span className="truncate max-w-[70%]">{movie.title}</span>
                    <span className="opacity-60 whitespace-nowrap">{movie.year}</span>
                  </div>
                </div>
              </Link>

          ))}
        </div>

        {/* 좌측 그라데이션 */}
        {hovered && (
            <div className="absolute left-0 top-0 h-full w-16 z-10 pointer-events-none bg-gradient-to-r from-[#121212] to-transparent" />
        )}

        {/* 우측 그라데이션 */}
        {hovered && (
            <div className="absolute right-0 top-0 h-full w-16 z-10 pointer-events-none bg-gradient-to-l from-[#121212] to-transparent" />
        )}

        {/* 좌측 버튼 */}
        {hovered && (
            <button
                onClick={() => scroll(-300)}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 text-white text-3xl px-2 py-8 transition transform scale-100 hover:scale-125 transition rounded-r"
            >
              &#10094;
            </button>
        )}

        {/* 우측 버튼 */}
        {hovered && (
            <button
                onClick={() => scroll(300)}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 text-white text-3xl px-2 py-8 transition transform scale-100 hover:scale-125 transition rounded-l"
            >
              &#10095;
            </button>
        )}
      </section>
  );
};

export default RecommendPage;