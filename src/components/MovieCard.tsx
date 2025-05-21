import React from "react";
import { Link } from "react-router-dom";

export interface MovieCardProps {
    movie: {
        movieId: string;
        movieSeq: string;
        posterUrl: string;
        title: string;
        year: string;
        matchedKeywords?: string[];
    };
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
    const {
        movieId,
        movieSeq,
        posterUrl,
        title,
        year,
        matchedKeywords = [],
    } = movie;

    return (
        <Link
            to={`/movie-detail?movieId=${movieId}&movieSeq=${movieSeq}`}
            className="flex flex-col h-full rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition"
        >
            {/* ── 포스터 ─────────────────────────────── */}
            <img
                src={posterUrl || "/no-poster.png"}
                alt={title}
                className="w-full aspect-[2/3] object-cover"
            />

            {/* ── 기본 정보 ─────────────────────────── */}
            <div className="flex-1 flex flex-col p-3">
                <h3 className="font-semibold text-sm mb-1 line-clamp-2">{title}</h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">{year}</span>

                {/* ── 매칭 키워드(있을 때만) ───────────── */}
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