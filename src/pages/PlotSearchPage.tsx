import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import axios from "../utils/axiosInstance";
import MovieCard from "../components/MovieCard";
import { useTheme } from "../contexts/ThemeContext";
import SearchBar from "../components/SearchBar";

/* ---------- 타입 ---------- */
interface ExtractedKeyword {
    category: string;
    keyword: string;
    score: number;
    subcategory: string;
}
interface Movie {
    movieId: string;
    movieSeq: string;
    title: string;
    year: string;
    posterUrl: string;
    matchedKeywords: string[];
}
interface PlotSearchResponse {
    extractedKeywords: ExtractedKeyword[];
    summary: string;
    matchedMovies: Movie[];
}

const PlotSearchPage: React.FC = () => {
    const { theme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();

    /* ----- 검색어(줄거리 전문) ----- */
    const [query, setQuery] = useState(
        () => new URLSearchParams(location.search).get("query") || ""
    );

    /* ----- 결과 ----- */
    const [movies, setMovies] = useState<Movie[]>([]);
    const [keywords, setKeywords] = useState<ExtractedKeyword[]>([]);
    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(false);

    /* ----- API 호출 ----- */
    useEffect(() => {
        const fetchPlotSearch = async () => {
            if (!query.trim()) {
                setMovies([]);
                setKeywords([]);
                setSummary("");
                return;
            }

            try {
                setLoading(true);
                const { data } = await axios.post<PlotSearchResponse>(
                    "/movie/nlp/search",
                    { description: query.trim() }
                );
                setMovies(data.matchedMovies);
                setKeywords(data.extractedKeywords);
                setSummary(data.summary);
            } catch (e) {
                console.error("줄거리 검색 오류:", e);
            } finally {
                setLoading(false);
            }
        };

        fetchPlotSearch();
    }, [query]);

    /* ----- 핸들러 ----- */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        navigate(`/plot-search?query=${encodeURIComponent(query.trim())}`);
        // query state already updated, useEffect가 다시 호출
    };

    /* ---------- JSX ---------- */
    return (
        <Layout>
            <div
                className={`min-h-screen ${
                    theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
                }`}
            >
                <main className="container mx-auto px-4 py-10 max-w-5xl">
                    {/* ───────── 검색창 & 탭 토글 ───────── */}
                    {/*<form*/}
                    {/*    onSubmit={handleSubmit}*/}
                    {/*    className="flex flex-col md:flex-row gap-4 items-center mb-8"*/}
                    {/*>*/}
                    {/*    /!* 탭 토글 *!/*/}
                    {/*    <div className="flex gap-2">*/}
                    {/*        <button*/}
                    {/*            type="button"*/}
                    {/*            onClick={() =>*/}
                    {/*                navigate(`/search`)*/}
                    {/*            }*/}
                    {/*            className="px-5 py-2 rounded-full text-sm font-medium bg-gray-200 dark:bg-gray-700 hover:bg-opacity-80"*/}
                    {/*        >*/}
                    {/*            기본 검색*/}
                    {/*        </button>*/}
                    {/*        <button*/}
                    {/*            type="button"*/}
                    {/*            disabled*/}
                    {/*            className="px-5 py-2 rounded-full text-sm font-medium bg-[#FF574F] text-white cursor-default"*/}
                    {/*        >*/}
                    {/*            줄거리 검색*/}
                    {/*        </button>*/}
                    {/*    </div>*/}

                    {/*    /!* 검색 입력 *!/*/}
                    {/*    <div className="relative flex-1 md:max-w-md">*/}
                    {/*        <input*/}
                    {/*            type="text"*/}
                    {/*            value={query}*/}
                    {/*            onChange={(e) => setQuery(e.target.value)}*/}
                    {/*            placeholder="줄거리를 붙여넣거나 입력하세요..."*/}
                    {/*            className="w-full py-3 px-5 pl-12 rounded-xl border-none focus:ring-2 focus:ring-[#FF574F] bg-white dark:bg-gray-800 shadow-md text-base"*/}
                    {/*        />*/}
                    {/*        <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />*/}
                    {/*    </div>*/}
                    {/*</form>*/}

                    <SearchBar
                        value={query}
                        onChange={setQuery}
                        onSubmit={handleSubmit}
                        currentTab="plot"
                        onTabClick={(tab) => {
                            if (tab === "basic") {
                                navigate(`/search?query=${encodeURIComponent(query.trim())}`);
                            }
                        }}
                    />

                    {/* ───────── 추출 키워드 요약 ───────── */}
                    {query.trim() && keywords.length > 0 && (
                        <section className="mb-10">
                            {summary && (
                                <p className="mb-4 text-sm leading-relaxed italic text-gray-600 dark:text-gray-300">
                                    {summary}
                                </p>
                            )}
                            <div className="flex flex-wrap gap-2">
                                {keywords.map((k) => (
                                    <span
                                        key={k.keyword + k.subcategory}
                                        className="text-xs px-3 py-[3px] rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                    >
                                    {k.keyword}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* ───────── 결과 리스트 ───────── */}
                    {!query.trim() ? (
                        <p className="text-center py-20 text-gray-400">
                            검색어를 입력해 주세요
                        </p>
                    ) : loading ? (
                        <p className="text-center py-20">Loading...</p>
                    ) : movies.length ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {movies.map((m) => (
                                <MovieCard
                                    key={m.movieId + m.movieSeq}
                                    movie={{
                                        movieId: m.movieId,
                                        movieSeq: m.movieSeq,
                                        posterUrl: m.posterUrl,
                                        title: m.title,
                                        year: m.year,
                                        matchedKeywords: m.matchedKeywords,
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center py-20 text-gray-400">No movies found</p>
                    )}
                </main>
            </div>
        </Layout>
    );
};

export default PlotSearchPage;