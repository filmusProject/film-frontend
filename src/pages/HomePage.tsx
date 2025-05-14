import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import axiosInstance from '../utils/axiosInstance';

const HomePage: React.FC = () => {
  /* ---------- 상태 ---------- */
  const [searchTab, setSearchTab] = useState<"basic" | "plot">("basic");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /* ---------- 검색 실행 ---------- */
  const runSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      if (searchTab === "basic") {
        await axiosInstance.get("/movie/search", {
          params: { query: query.trim() },
        });
        navigate(`/search?query=${encodeURIComponent(query.trim())}`);
      } else {
        /* ↙︎ 줄거리 검색 API 연동 전 임시 이동 */
        navigate(`/plot-search?query=${encodeURIComponent(query.trim())}`);
      }
    } catch (err) {
      console.error("검색 중 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- submit ---------- */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch();
  };

  /* ---------- Ctrl/⌘+Enter (plot 모드) ---------- */
  const handlePlotKey = (
      e: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      runSearch();
    }
  };

  const movies = [
    {
      id: 1,
      title: "Inception",
      year: 2010,
      imageUrl:
          "https://readdy.ai/api/search-image?query=Movie%20poster%20for%20Inception%2C%20professional%20movie%20poster%20design%20with%20dark%20blue%20tones%2C%20showing%20a%20city%20folding%20on%20itself%2C%20minimalist%20design%20with%20high%20contrast%2C%20clean%20background%2C%20cinematic%20quality%2C%20high%20resolution%20movie%20poster&width=300&height=450&seq=1&orientation=portrait",
    },
    {
      id: 2,
      title: "The Shawshank Redemption",
      year: 1994,
      imageUrl:
          "https://readdy.ai/api/search-image?query=Movie%20poster%20for%20The%20Shawshank%20Redemption%2C%20professional%20movie%20poster%20design%20showing%20a%20man%20standing%20in%20the%20rain%20with%20arms%20outstretched%2C%20dramatic%20lighting%2C%20dark%20background%20with%20rain%20effect%2C%20high%20quality%20cinematic%20poster%20design%2C%20clean%20composition&width=300&height=450&seq=2&orientation=portrait",
    },
    {
      id: 3,
      title: "Pulp Fiction",
      year: 1994,
      imageUrl:
          "https://readdy.ai/api/search-image?query=Movie%20poster%20for%20Pulp%20Fiction%2C%20professional%20movie%20poster%20design%20with%20black%20and%20yellow%20color%20scheme%2C%20showing%20a%20woman%20lying%20down%20smoking%20a%20cigarette%2C%20minimalist%20design%20with%20high%20contrast%2C%20clean%20background%2C%20cinematic%20quality%20poster&width=300&height=450&seq=3&orientation=portrait",
    },
    {
      id: 4,
      title: "The Dark Knight",
      year: 2008,
      imageUrl:
          "https://readdy.ai/api/search-image?query=Movie%20poster%20for%20The%20Dark%20Knight%2C%20professional%20movie%20poster%20design%20showing%20Batman%20silhouette%20against%20Gotham%20skyline%2C%20dark%20blue%20and%20black%20tones%2C%20dramatic%20lighting%20with%20bat%20symbol%2C%20high%20quality%20cinematic%20poster%20design%2C%20clean%20composition&width=300&height=450&seq=4&orientation=portrait",
    },
    {
      id: 5,
      title: "Fight Club",
      year: 1999,
      imageUrl:
          "https://readdy.ai/api/search-image?query=Movie%20poster%20for%20Fight%20Club%2C%20professional%20movie%20poster%20design%20with%20gritty%20texture%2C%20showing%20a%20bar%20of%20soap%20with%20text%20imprinted%20on%20it%2C%20red%20and%20black%20color%20scheme%2C%20minimalist%20design%20with%20high%20contrast%2C%20clean%20background%2C%20cinematic%20quality&width=300&height=450&seq=5&orientation=portrait",
    },
    {
      id: 6,
      title: "Interstellar",
      year: 2014,
      imageUrl:
          "https://readdy.ai/api/search-image?query=Movie%20poster%20for%20Interstellar%2C%20professional%20movie%20poster%20design%20showing%20astronauts%20walking%20on%20alien%20planet%20with%20massive%20waves%2C%20dark%20blue%20space%20background%20with%20stars%2C%20dramatic%20lighting%2C%20high%20quality%20cinematic%20poster%20design%2C%20clean%20composition&width=300&height=450&seq=6&orientation=portrait",
    },
  ];

  return (
      <Layout>
        <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-16">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60"></div>
            <img
                src="https://readdy.ai/api/search-image?query=Cinematic%20movie%20theater%20background%20with%20dramatic%20lighting%2C%20rows%20of%20empty%20seats%20facing%20a%20large%20screen%20with%20subtle%20red%20accent%20lighting%2C%20dark%20atmosphere%20with%20cinematic%20quality%2C%20perfect%20for%20movie%20streaming%20service%20hero%20background&width=1440&height=900&seq=7&orientation=landscape"
                alt="Cinema background"
                className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="container mx-auto z-10 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              당신의 다음 인생 영화를 발견하세요
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-gray-200 max-w-3xl mx-auto">
              수천 편의 영화 중에서 당신이 찾고 있는 바로 그 영화를 찾아보세요
            </p>
            {/* 탭 스위치 */}
            <div className="inline-flex bg-gray-800/50 backdrop-blur-xl p-1 rounded-full mb-6 shadow-lg">
              <button
                  onClick={() => {
                    setSearchTab("basic");
                    setQuery("");
                  }}
                  className={`px-6 py-2 rounded-full transition ${
                      searchTab === "basic"
                          ? "bg-[#FF574F]"
                          : "hover:bg-white/10"
                  } text-white`}
              >
                기본 검색
              </button>
              <button
                  onClick={() => {
                    setSearchTab("plot");
                    setQuery("");
                  }}
                  className={`px-6 py-2 rounded-full transition ${
                      searchTab === "plot"
                          ? "bg-[#FF574F]"
                          : "hover:bg-white/10"
                  } text-white`}
              >
                줄거리 검색
              </button>
            </div>
            {/* 검색 입력 */}
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-3xl mx-auto"
            >
              {searchTab === "basic" ? (
                  /* ---- 기본 검색 ---- */
                  <div className="relative">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="제목, 배우, 감독으로 영화 검색..."
                        className="w-full bg-white/20 backdrop-blur-xl text-white
                             placeholder-gray-300 px-6 py-4 pr-14 rounded-md
                             border border-white/30 focus:outline-none
                             focus:ring-2 focus:ring-[#FF574F] shadow-lg text-lg"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white"
                    >
                      {loading ? (
                          <i className="fas fa-film fa-spin text-xl" />
                      ) : (
                          <i className="fas fa-search text-xl" />
                      )}
                    </button>
                  </div>
              ) : (
                  /* ---- 줄거리 검색 ---- */
                  <div className="relative">
                <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handlePlotKey}
                    placeholder="찾고 싶은 영화의 줄거리를 설명해주세요… (Ctrl/⌘+Enter)"
                    className="w-full bg-white/20 backdrop-blur-xl text-white
                             placeholder-gray-300 px-6 py-4 pr-14 rounded-md
                             border border-white/30 focus:outline-none
                             focus:ring-2 focus:ring-[#FF574F] shadow-lg
                             text-lg h-[140px] resize-none"
                />
                    <button
                        type="submit"
                        disabled={loading}
                        className="absolute right-4 bottom-4 text-white"
                    >
                      {loading ? (
                          <i className="fas fa-film fa-spin text-xl" />
                      ) : (
                          <i className="fas fa-search text-xl" />
                      )}
                    </button>
                  </div>
              )}
            </form>
          </div>
        </section>
        {/* Quick Picks Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold">추천 영화</h2>
              <a
                  href="#"
                  className="text-[#FF574F] flex items-center hover:underline cursor-pointer"
              >
                더보기 <i className="fas fa-arrow-right ml-2"></i>
              </a>
            </div>
            <div className="overflow-x-auto pb-4">
              <div className="flex space-x-6 min-w-max">
                {movies.map((movie) => (
                    <div
                        key={movie.id}
                        className="w-60 flex-shrink-0 rounded-lg overflow-hidden transition-all duration-300 transform hover:-translate-y-2 cursor-pointer bg-white bg-opacity-15 backdrop-blur-xl border border-gray-200 border-opacity-20 shadow-lg"
                    >
                      <div className="h-80 overflow-hidden">
                        <img
                            src={movie.imageUrl}
                            alt={movie.title}
                            className="w-full h-full object-cover aspect-[2/3] object-top"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-1 truncate">{movie.title}</h3>
                        <p className="text-gray-600">{movie.year}</p>
                      </div>
                    </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Trending Now Section */}
        <section className="py-16 px-4 bg-gray-100 bg-opacity-50">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold">실시간 인기</h2>
              <a
                  href="#"
                  className="text-[#FF574F] flex items-center hover:underline cursor-pointer"
              >
                전체보기 <i className="fas fa-arrow-right ml-2"></i>
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {movies.map((movie) => (
                  <div
                      key={movie.id}
                      className="rounded-lg overflow-hidden transition-all duration-300 transform hover:-translate-y-2 cursor-pointer bg-white bg-opacity-15 backdrop-blur-xl border border-gray-200 border-opacity-20 shadow-lg"
                  >
                    <div className="h-80 overflow-hidden">
                      <img
                          src={movie.imageUrl}
                          alt={movie.title}
                          className="w-full h-full object-cover aspect-[2/3] object-top"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-1 truncate">{movie.title}</h3>
                      <p className="text-gray-600">{movie.year}</p>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </section>
      </Layout>
  );
};

export default HomePage;
