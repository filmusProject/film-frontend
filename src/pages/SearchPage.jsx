import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import axios from "axios";

const API = process.env.REACT_APP_API_BASE_URL;

axios.get(`${API}/api/movies`)
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.error(error);
    });

const SearchPage = () => {
  const keyword = new URLSearchParams(useLocation().search).get('query') || '';
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!keyword) return;

    setLoading(true);
    axios.get(`/api/movie/search?query=${encodeURIComponent(keyword)}`)
      .then(res => setMovies(res.data.movies))
      .catch(setError)
      .finally(() => setLoading(false));
  }, [keyword]);

  return (
    <Layout>
      <div className="min-h-screen bg-[#121212] text-white font-sans px-6 py-20">
        <h1 className="text-2xl font-bold mb-4">🔍 '{keyword}' 검색 결과 ({movies.length}건)</h1>

        {loading && <div className="text-gray-400">검색 중입니다...</div>}
        {error && <div className="text-gray-400">에러가 발생했습니다. 다시 시도해주세요.</div>}

        {!loading && !error && movies.length === 0 && (
          <div className="text-gray-400">검색 결과가 없습니다.</div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {movies.map(({ movieId, movieSeq, posterUrl, title, year }) => (
            <Link
              to={`/movie-detail/${movieId}/${movieSeq}`}
              key={`${movieId}-${movieSeq}`}
              className="bg-[#2A2A2A] rounded-lg overflow-hidden hover:shadow-lg"
            >
              <img
                src={posterUrl || "https://via.placeholder.com/192x288?text=No+Image"}
                alt={title.trim()}
                className="w-full h-72 object-cover"
              />
              <div className="p-2 flex justify-between items-center text-sm">
                <span>{title.trim()}</span>
                <span className="opacity-70">{year}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default SearchPage;