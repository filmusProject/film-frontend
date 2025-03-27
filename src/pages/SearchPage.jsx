import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Layout from '../components/Layout'; // 경로는 src/pages에서 시작한다고 가정

const SearchPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const keyword = queryParams.get('query') || '';

  const dummyResults = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    title: `검색 결과 영화 ${i + 1}`,
    year: 2024 - i,
    image: "https://via.placeholder.com/192x288?text=Movie"
  }));

  return (
    <Layout>  {/* Layout 적용 시작 */}
    <div className="min-h-screen bg-[#121212] text-white font-sans px-6 py-20">
      <h1 className="text-2xl font-bold mb-4">🔍 '{keyword}' 검색 결과</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {dummyResults.map(movie => (
          <Link to="/movie-detail" key={movie.id} className="bg-[#2A2A2A] rounded-lg overflow-hidden hover:shadow-lg">
            <img src={movie.image} alt={movie.title} className="w-full h-72 object-cover" />
            <div className="p-2 flex justify-between items-center text-sm">
              <span>{movie.title}</span>
              <span className="opacity-70">{movie.year}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
    </Layout>
  );
};

export default SearchPage;