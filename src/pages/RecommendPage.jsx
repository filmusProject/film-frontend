import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout'; // 경로는 src/pages에서 시작한다고 가정

const RecommendPage = () => {
  const topics = ['감성적인 밤', '비 오는 날', '스트레스 해소', '따뜻한 가족 이야기'];
  const moviesPerTopic = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    title: `추천영화 ${i + 1}`,
    year: 2024 - i,
    image: "https://via.placeholder.com/192x288?text=Movie"
  }));

  return (
    <Layout>  {/* Layout 적용 시작 */}
    <div className="min-h-screen bg-[#121212] text-white font-sans px-6 py-20 space-y-16">
      <h1 className="text-2xl font-bold mb-4">🎯 오늘의 추천 테마</h1>
      {topics.map((topic, idx) => (
        <section key={idx}>
          <h2 className="text-xl font-semibold mb-2">#{topic}</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {moviesPerTopic.map((movie) => (
              <Link to="/movie-detail" key={movie.id + topic} className="flex-none w-48 bg-[#2A2A2A] rounded-lg overflow-hidden">
                <img src={movie.image} alt={movie.title} className="h-72 w-full object-cover" />
                <div className="p-2 flex justify-between items-center text-sm">
                  <span>{movie.title}</span>
                  <span className="opacity-60">{movie.year}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
    </Layout>
  );
};

export default RecommendPage;