import React, { useEffect, useState, useCallback, useRef } from "react";
import Layout from "../components/layout/Layout";
import axiosInstance from "../utils/axiosInstance";
import { useTheme } from "../contexts/ThemeContext";
import MovieCard from "../components/MovieCard";

/* ---------- 타입 ---------- */
interface Movie {
    movieId: string;
    movieSeq: string;
    title: string;
    year: string;
    genre: string;
    posterUrl: string;
}
interface ApiResponse {
    awardRecommendations: Movie[];
    fixedRecommendations: Record<string, Movie[]>;
    weatherRecommendations: Movie[];
}

/* ---------- 가로 리스트 ---------- */
const HorizontalList: React.FC<{ movies: Movie[] }> = ({ movies }) => {
    const ref = useRef<HTMLDivElement>(null);

    /** 버튼으로 카드 1장씩 이동 */
    const scrollOne = (dir: "left" | "right") => {
        if (ref.current) {
            /* 첫 카드의 폭만큼 스크롤 */
            const card = ref.current.querySelector<HTMLDivElement>("a");
            const step = card ? card.clientWidth + 16 /* gap */ : 180;
            ref.current.scrollBy({
                left: dir === "left" ? -step : step,
                behavior: "smooth",
            });
        }
    };

    return (
        <div className="relative">
            {/* 좌우 버튼 – 640px 이상에서 보이도록 sm:flex */}
            <button
                onClick={() => scrollOne("left")}
                className="hidden sm:flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 z-10
                   w-9 h-9 rounded-full bg-white/80 dark:bg-gray-800/80 shadow
                   after:content-['\\f053'] after:font-awesome after:text-gray-800 dark:after:text-white"
            />
            <button
                onClick={() => scrollOne("right")}
                className="hidden sm:flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 z-10
                   w-9 h-9 rounded-full bg-white/80 dark:bg-gray-800/80 shadow
                   after:content-['\\f054'] after:font-awesome after:text-gray-800 dark:after:text-white"
            />

            {/* 가로 리스트 (스크롤바 숨김) */}
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

/* ---------- 메인 ---------- */
const RecommendPage: React.FC = () => {
    const { theme } = useTheme();
    const [data, setData] = useState<ApiResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchAll = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await axiosInstance.get<ApiResponse>("/recommend/all");
            setData(data);
        } catch {
            setError("추천 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    return (
        <Layout>
            <div
                className={`min-h-screen ${
                    theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
                }`}
            >
                <main className="container mx-auto px-4 py-10">
                    <h1 className="text-3xl md:text-4xl font-bold mb-10 text-center">
                        맞춤 영화 추천
                    </h1>

                    {loading && <p className="text-center py-20">Loading...</p>}
                    {error && <p className="text-center py-20 text-red-500">{error}</p>}

                    {data && (
                        <>
                            {/* 수상작 */}
                            {data.awardRecommendations.length > 0 && (
                                <section className="mb-16">
                                    <h2 className="text-2xl font-semibold mb-6">수상작 추천</h2>
                                    <HorizontalList movies={data.awardRecommendations} />
                                </section>
                            )}

                            {/* 장르별 */}
                            {Object.entries(data.fixedRecommendations).map(
                                ([genreKey, movies]) => (
                                    <section className="mb-16" key={genreKey}>
                                        <h2 className="text-2xl font-semibold mb-6">
                                            {genreKey.charAt(0).toUpperCase() + genreKey.slice(1)} Movies
                                        </h2>
                                        <HorizontalList movies={movies} />
                                    </section>
                                )
                            )}

                            {/* 날씨 */}
                            {data.weatherRecommendations.length > 0 && (
                                <section className="mb-16">
                                    <h2 className="text-2xl font-semibold mb-6">
                                        오늘 날씨와 어울리는 영화
                                    </h2>
                                    <HorizontalList movies={data.weatherRecommendations} />
                                </section>
                            )}
                        </>
                    )}
                </main>
            </div>
        </Layout>
    );
};

export default RecommendPage;