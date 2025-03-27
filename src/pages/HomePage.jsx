import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';  // 공통 레이아웃 컴포넌트

const HomePage = () => {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (keyword.trim()) {
      navigate(`/search?query=${encodeURIComponent(keyword.trim())}`);
    }
  };

  return (
    <Layout>  {/* Layout 적용 시작 */}
    <div className="min-h-screen flex flex-col bg-[#121212] text-white font-sans">


      <main className="flex-grow pt-16">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="quote-transition mb-8">
              <h2 className="text-3xl font-bold mb-2" id="quote">당신만을 위한 특별한 영화를 찾아보세요</h2>
              <p className="text-gray-400" id="sub-quote">취향에 맞는 영화를 AI가 추천해드립니다</p>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                    type="text"
                    placeholder="영화 제목, 키워드, 감독을 입력하세요"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full bg-[#2A2A2A] border-0 rounded-button pl-12 pr-4 py-4 text-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-custom"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-search text-gray-400" />
                </div>
                <button
                    onClick={handleSearch}
                    className="absolute inset-y-0 right-2 px-3 py-1 text-sm text-gray-300 hover:text-white"
                >
                  검색
                </button>
              </div>
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {['로맨스', '액션', '판타지', '스릴러', '코미디'].map((tag) => (
                  <span key={tag} className="bg-[#2A2A2A] px-3 py-1 rounded-button text-sm text-gray-300 hover:bg-custom hover:text-white cursor-pointer">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <section className="mb-16">
            <h3 className="text-xl font-bold mb-6">최근 추천 영화</h3>
            <div className="flex space-x-4 overflow-x-auto pb-4">
              {[1, 2, 3].map((i) => (
                <Link key={i} to="/movie-detail" className="movie-card flex-none w-48 relative">
                  <img
                    src="http://file.koreafilm.or.kr/thm/02/00/05/25/tn_DPF018752.jpg"
                    className="w-full h-72 object-cover rounded-lg"
                    alt="영화 포스터"
                  />
                  <div className="movie-overlay absolute inset-0 bg-black bg-opacity-75 rounded-lg p-4 flex flex-col justify-end">
                    <h4 className="font-bold">영화 제목 {i}</h4>
                    <p className="text-sm text-gray-300">2024</p>
                    <button className="mt-2 bg-custom text-white px-3 py-1 rounded-button text-sm">상세보기</button>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>


    </div>
    </Layout>
  );
};

export default HomePage;