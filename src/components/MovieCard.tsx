import React from "react";
import { Link } from "react-router-dom";

/* ---------- 타입 ---------- */
export interface MovieCardProps {
    movie: {
        movieId: string;
        movieSeq: string;
        posterUrl: string;
        title: string;
        year: string;
        matchedKeywords?: string[];
    };
    /** 가로 리스트용 작은 카드 여부 */
    compact?: boolean;
}

/* ---------- 컴포넌트 ---------- */
const MovieCard: React.FC<MovieCardProps> = ({ movie, compact = false }) => {
    const { movieId, movieSeq, posterUrl, title, year, matchedKeywords = [] } =
        movie;

    /* 카드 폭: 모바일(≤639) 40 → sm 44 → md 48 → lg 52 → xl 56 */
    const widthClasses = compact
        ? "w-40 sm:w-44 md:w-48 lg:w-52 xl:w-56 flex-shrink-0"
        : "";

    return (
        <Link
            to={`/movie-detail?movieId=${movieId}&movieSeq=${movieSeq}`}
            className={`flex flex-col h-full rounded-lg overflow-hidden shadow-md hover:shadow-lg transition bg-white dark:bg-gray-800 ${widthClasses}`}
        >
            {/* ── 포스터 ───────────────────────────── */}
            <img
                src={posterUrl || "/no-poster.png"}
                alt={title}
                className="w-full aspect-[2/3] object-cover object-top bg-gray-200 dark:bg-gray-700"
            />

            {/* ── 정보 ─────────────────────────────── */}
            <div className="flex-1 flex flex-col p-3">
                <h3 className="font-semibold text-sm mb-1 truncate text-gray-900 dark:text-white">
                    {title}
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">{year}</span>

                {matchedKeywords.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                        {matchedKeywords.slice(0, 5).map((kw) => (
                            <span
                                key={kw}
                                className="text-[10px] px-2 py-[2px] rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                            >
                {kw}
              </span>
                        ))}
                    </div>
                )}
            </div>
        </Link>
    );
};

export default MovieCard;