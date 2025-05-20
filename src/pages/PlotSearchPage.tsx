/**
 * src/pages/PlotSearchPage.tsx
 * -------------------------------------------------
 * 1)  USE_MOCK 플래그로 백엔드 없이도 화면 테스트 가능
 * 2)  query 값이 비어있어도 목 데이터가 바로 보이도록 수정
 * 3)  기존 구조는 그대로 유지(실제 API → 실패 시 목 데이터 폴백)
 */

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import axios from "../utils/axiosInstance";
import MovieCard from "../components/MovieCard";
import { useTheme } from "../contexts/ThemeContext";
import SearchBar from "../components/SearchBar";

/* ───────── 타입 ───────── */
interface ExtractedKeyword {
    category: string;
    subcategory: string;
    keyword: string;
    score: number;
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

/* ───────── MOCK 데이터 & 플래그 ───────── */
const USE_MOCK = true; // true → 항상 목 사용, false → 실제 API 우선
const mockPlotData: PlotSearchResponse = {
    extractedKeywords: [
        { category: "theme", subcategory: "magic", keyword: "마법", score: 0.93 },
        { category: "place", subcategory: "school", keyword: "학교", score: 0.86 },
        { category: "theme", subcategory: "growth", keyword: "성장", score: 0.72 },
    ],
    summary: "마법 학교에서 성장하는 주인공의 모험을 그린 판타지.",
    matchedMovies: [
        {
            movieId: "tt0241527",
            movieSeq: "0001",
            title: "해리 포터와 마법사의 돌",
            year: "2001",
            posterUrl:
                "https://image.tmdb.org/t/p/w342/uc9Yl9PeY6ZfsCA7n1dqfBzL5qo.jpg",
            matchedKeywords: ["마법", "학교"],
        },
        {
            movieId: "tt0417741",
            movieSeq: "0002",
            title: "해리 포터와 불사조 기사단",
            year: "2007",
            posterUrl:
                "https://image.tmdb.org/t/p/w342/aWxwnYoe8p2d2fcxOqtvAtJ72Rw.jpg",
            matchedKeywords: ["마법", "학교", "성장"],
        },
        {
            movieId: "tt0993846",
            movieSeq: "0003",
            title: "해리 포터와 혼혈 왕자",
            year: "2009",
            posterUrl:
                "https://image.tmdb.org/t/p/w342/z7uo9zmQdQwU5ZJHFpv2Upl30i1.jpg",
            matchedKeywords: ["마법", "성장"],
        },
    ],
};

/* ───────── 컴포넌트 ───────── */
const PlotSearchPage: React.FC = () => {
    const { theme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();

    /* 검색어 상태 */
    const [query, setQuery] = useState(
        () => new URLSearchParams(location.search).get("query") || ""
    );

    /* 결과 상태 */
    const [movies, setMovies] = useState<Movie[]>([]);
    const [keywords, setKeywords] = useState<ExtractedKeyword[]>([]);
    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(false);

    /* 공통 주입 로직 */
    const injectData = (data: PlotSearchResponse) => {
        setMovies(data.matchedMovies);
        setKeywords(data.extractedKeywords);
        setSummary(data.summary);
    };

    /* 가짜 지연 */
    const simulateLatency = (ms: number) =>
        new Promise((res) => setTimeout(res, ms));

    /* API 호출 (또는 MOCK) */
    useEffect(() => {
        const fetchPlotSearch = async () => {
            // ① query가 비어 있을 때
            if (!query.trim()) {
                if (USE_MOCK) {
                    injectData(mockPlotData);
                } else {
                    setMovies([]);
                    setKeywords([]);
                    setSummary("");
                }
                return;
            }

            // ② query가 있는 경우
            try {
                setLoading(true);

                if (USE_MOCK) {
                    await simulateLatency(400);
                    injectData(mockPlotData);
                } else {
                    const { data } = await axios.post<PlotSearchResponse>(
                        "/movie/nlp/search",
                        { description: query.trim() }
                    );
                    injectData(data);
                }
            } catch (err) {
                console.error("줄거리 검색 오류:", err);
                // 실패 시에도 목 데이터로 폴백
                injectData(mockPlotData);
            } finally {
                setLoading(false);
            }
        };

        fetchPlotSearch();
    }, [query]);

    /* 검색 제출 */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        navigate(`/plot-search?query=${encodeURIComponent(query.trim())}`);
        // query state는 이미 업데이트되어 있으므로 useEffect 재실행
    };

    /* ───────── JSX ───────── */
    return (
        <Layout>
            <div
                className={`min-h-screen ${
                    theme === "dark"
                        ? "bg-gray-900 text-white"
                        : "bg-gray-50 text-gray-900"
                }`}
            >
                <main className="container mx-auto px-4 py-10 max-w-5xl">
                    {/* 검색창 & 탭 토글 */}
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

                    {/* 추출 키워드·요약 */}
                    {keywords.length > 0 && (
                        <section className="mb-10">
                            {summary && (
                                <p className="mb-4 text-sm italic text-gray-600 dark:text-gray-300 leading-relaxed">
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

                    {/* 결과 리스트 */}
                    {loading ? (
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
                        <p className="text-center py-20 text-gray-400">
                            {query.trim() ? "No movies found" : "검색어를 입력해 주세요"}
                        </p>
                    )}
                </main>
            </div>
        </Layout>
    );
};

export default PlotSearchPage;