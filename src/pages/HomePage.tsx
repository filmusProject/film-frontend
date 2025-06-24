/* -------------------------------------------
   src/pages/HomePage.tsx
   ------------------------------------------- */
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  KeyboardEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import axiosInstance from "../utils/axiosInstance";
import MovieCard from "../components/MovieCard";

/* ---------- 타입 ---------- */
interface RecMovie {
  movieId: string;
  movieSeq: string;
  title: string;
  year: string;
  genre: string;
  posterUrl: string;
}
interface RecResponse {
  category: string; // weather | award | fixed:action | ...
  recommendations: RecMovie[];
}

/* ---------- 가로 리스트 ---------- */
const HorizontalList: React.FC<{ movies: RecMovie[] }> = ({ movies }) => {
  const ref = useRef<HTMLDivElement>(null);

  const move = (dir: "left" | "right") => {
    if (ref.current) {
      const card = ref.current.querySelector<HTMLAnchorElement>("a");
      const step = card ? card.clientWidth + 16 : 180;
      ref.current.scrollBy({
        left: dir === "left" ? -step : step,
        behavior: "smooth",
      });
    }
  };

  return (
      <div className="relative">
        {/* 좌 / 우 한 장씩 이동 – 640px 이상에서 보임 */}
        <button
            onClick={() => move("left")}
            className="hidden sm:flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 z-10
                   w-9 h-9 rounded-full bg-white/80 dark:bg-gray-800/80 shadow
                   after:content-['\\f053'] after:font-awesome after:text-gray-800 dark:after:text-white"
        />
        <button
            onClick={() => move("right")}
            className="hidden sm:flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 z-10
                   w-9 h-9 rounded-full bg-white/80 dark:bg-gray-800/80 shadow
                   after:content-['\\f054'] after:font-awesome after:text-gray-800 dark:after:text-white"
        />

        <div ref={ref} className="overflow-x-auto hide-scrollbar pb-4">
          <div className="flex gap-4">
            {movies.map((m) => (
                <MovieCard
                    key={m.movieId + m.movieSeq}
                    compact
                    movie={{
                      movieId: m.movieId,
                      movieSeq: m.movieSeq,
                      posterUrl: m.posterUrl,
                      title: m.title,
                      year: m.year,
                    }}
                />
            ))}
          </div>
        </div>
      </div>
  );
};

const HomePage: React.FC = () => {
  /* ---------- 검색 상태 ---------- */
  const [searchTab, setSearchTab] = useState<"basic" | "plot">("basic");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /* ---------- 홈 추천 ---------- */
  const [homeRecs, setHomeRecs] = useState<RecMovie[]>([]);
  const [titleSub, setTitleSub] = useState("");

  /* ---------- 추천 API 호출 ---------- */
  const fetchHomeRec = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get<RecResponse>(
          "/recommend/home-random",
      );
      setHomeRecs(data.recommendations);

      let sub = "";
      switch (data.category) {
        case "weather":
          sub = "오늘 날씨에 따른 추천";
          break;
        case "award":
          sub = "주요 영화제 수상작";
          break;
        default:
          if (data.category.startsWith("fixed:")) {
            const g = data.category.split(":")[1];
            sub = `${g.charAt(0).toUpperCase() + g.slice(1)} 추천`;
          }
      }
      setTitleSub(sub);
    } catch (e) {
      console.error("홈 추천 로딩 실패:", e);
    }
  }, []);

  useEffect(() => {
    fetchHomeRec();
  }, [fetchHomeRec]);

  /* ---------- 검색 실행 ---------- */
  const runSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      if (searchTab === "basic") {
        await axiosInstance.get("/movie/search", {
          params: { query: query.trim() },
        });
        navigate(`/search?engine=es&query=${encodeURIComponent(query.trim())}`);
      } else {
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

  /* ---------- Ctrl/⌘+Enter (plot) ---------- */
  const handlePlotKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      runSearch();
    }
  };

  /* ---------- 더미 인기 데이터 (예시) ---------- */
  const dummyTrending = [
    {
      id: 1,
      title: "Inception",
      year: 2010,
      imageUrl:
          "https://readdy.ai/api/search-image?query=Movie%20poster%20for%20Inception&width=300&height=450&seq=1&orientation=portrait",
    },
    {
      id: 2,
      title: "The Shawshank Redemption",
      year: 1994,
      imageUrl:
          "https://readdy.ai/api/search-image?query=Movie%20poster%20for%20The%20Shawshank%20Redemption&width=300&height=450&seq=2&orientation=portrait",
    },
    // … (나머지 4편)
  ];

  /* ---------- JSX ---------- */
  return (
      <Layout>
        {/* ===== HERO ===== */}
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

            {/* ─── 탭 스위치 ─── */}
            <div className="inline-flex bg-gray-800/50 backdrop-blur-xl p-1 rounded-full mb-6 shadow-lg">
              <button
                  onClick={() => {
                    setSearchTab("basic");
                    setQuery("");
                  }}
                  className={`px-6 py-2 rounded-full transition ${
                      searchTab === "basic" ? "bg-[#FF574F]" : "hover:bg-white/10"
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
                      searchTab === "plot" ? "bg-[#FF574F]" : "hover:bg-white/10"
                  } text-white`}
              >
                줄거리 검색
              </button>
            </div>

            {/* ─── 검색 입력 ─── */}
            <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
              {searchTab === "basic" ? (
                  <div className="relative">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="제목, 배우, 감독으로 영화 검색..."
                        className="w-full bg-white/20 backdrop-blur-xl text-white placeholder-gray-300
                             px-6 py-4 pr-14 rounded-md border border-white/30 focus:outline-none
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
                  <div className="relative">
                <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handlePlotKey}
                    placeholder="찾고 싶은 영화의 줄거리를 설명해주세요… (Ctrl/⌘+Enter)"
                    className="w-full bg-white/20 backdrop-blur-xl text-white placeholder-gray-300
                             px-6 py-4 pr-14 rounded-md border border-white/30 focus:outline-none
                             focus:ring-2 focus:ring-[#FF574F] shadow-lg text-lg h-[140px] resize-none"
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

        {/* ===== 추천 영화 슬라이드 ===== */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl md:text-3xl font-bold">추천 영화</h2>
              <button
                  onClick={() => navigate("/recommend")}
                  className="text-[#FF574F] flex items-center hover:underline"
              >
                더보기 <i className="fas fa-arrow-right ml-2" />
              </button>
            </div>
            {titleSub && (
                <p className="text-gray-500 dark:text-gray-400 mb-6">{titleSub}</p>
            )}

            {homeRecs.length ? (
                <HorizontalList movies={homeRecs} />
            ) : (
                <p className="text-gray-400">로딩 중…</p>
            )}
          </div>
        </section>

        {/* ===== 실시간 인기 (더미 예시) ===== */}
        <section className="py-16 px-4 bg-gray-100 bg-opacity-50">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold">실시간 인기</h2>
              <a
                  href="#"
                  className="text-[#FF574F] flex items-center hover:underline"
              >
                전체보기 <i className="fas fa-arrow-right ml-2" />
              </a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {dummyTrending.map((m) => (
                  <div
                      key={m.id}
                      className="rounded-lg overflow-hidden transition-all duration-300 transform hover:-translate-y-2
                           cursor-pointer bg-white bg-opacity-15 backdrop-blur-xl border border-gray-200
                           border-opacity-20 shadow-lg"
                  >
                    <div className="h-80 overflow-hidden">
                      <img
                          src={m.imageUrl}
                          alt={m.title}
                          className="w-full h-full object-cover aspect-[2/3] object-top"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-1 truncate">{m.title}</h3>
                      <p className="text-gray-600">{m.year}</p>
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