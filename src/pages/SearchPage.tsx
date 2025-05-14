/* -------------------------------------------
   src/pages/SearchPage.tsx
   ------------------------------------------- */
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as echarts from "echarts";
import Layout from "../components/layout/Layout";
import axios from "../utils/axiosInstance";
import { useTheme } from "../contexts/ThemeContext";
import MovieCard from "../components/MovieCard";
import SearchBar from "../components/SearchBar";

/* ---------- 타입 ---------- */
interface Movie {
    movieId: string;
    movieSeq: string;
    title: string;
    year: string;
    posterUrl: string;
    rating?: number;
    plot?: string;
    genres?: string[];
}

/* ---------- 고정 리스트 ---------- */
const GENRES = [
    "Action","Adventure","Animation","Comedy","Crime","Documentary","Drama","Family",
    "Fantasy","History","Horror","Music","Mystery","Romance","Sci‑Fi","Thriller","War","Western",
];
const COUNTRIES = [
    "United States","United Kingdom","France","Japan","South Korea","India","Germany",
    "Italy","Spain","Canada","Australia","Brazil","China","Russia",
];

/* ---------- 컴포넌트 ---------- */
const SearchPage: React.FC = () => {
    /* 테마 */
    const { theme } = useTheme();

    /* 라우터 */
    const navigate  = useNavigate();
    const location  = useLocation();

    /* 검색 상태 */
    const [query, setQuery]   = useState(() => new URLSearchParams(location.search).get("query") || "");
    const [movies,setMovies]  = useState<Movie[]>([]);
    const [page,  setPage]    = useState(1);
    const [total, setTotal]   = useState(0);
    const [loading,setLoading]= useState(false);

    /* 필터 상태 */
    const [isFilterOpen,setFilter] = useState(false);          // 데스크톱 & 모바일 공통
    const [genres,setGenres]       = useState<string[]>([]);
    const [yearRange,setYears]     = useState<[number,number]>([1990,2025]);
    const [minRating,setRating]    = useState(0);
    const [country,setCountry]     = useState("");

    /* 서버 전송용 추가 파라미터 (예시) */
    const [releaseDts,setDts] = useState("");
    const [releaseDte,setDte] = useState("");
    const [keyword,    setKw] = useState("");
    const [type,       setTp] = useState("");

    const PER_PAGE   = 20;
    const totalPages = Math.ceil(total / PER_PAGE);

    /* ---------- API ---------- */
    const fetchSearch = useCallback(async (reset=false)=>{
        if (!query.trim()) {
            setMovies([]);
            setTotal(0);
            return;
        }
        try{
            setLoading(true);
            const curPage = reset?1:page;

            const {data} = await axios.get("/movie/search",{
                params:{
                    query,
                    page: curPage,
                    genre:  genres.join(","),
                    nation: country,
                    releaseDts,releaseDte,keyword,type,
                    rating: minRating,
                }
            });

            setMovies(data.movies);
            setTotal(data.totalCount);
            if(reset) setPage(1);
        }catch(e){
            console.error("검색 오류:",e);
        }finally{
            setLoading(false);
        }
    },[query,page,genres,country,releaseDts,releaseDte,keyword,type,minRating]);

    useEffect(()=>{ fetchSearch(); },[fetchSearch]);

    /* ---------- 핸들러 ---------- */
    const handleSearch = (e:React.FormEvent) => {
        e.preventDefault();
        navigate(`/search?query=${encodeURIComponent(query)}`);
        fetchSearch(true);
    };
    const toggleGenre = (g:string)=>setGenres(prev=>prev.includes(g)?prev.filter(x=>x!==g):[...prev,g]);
    const resetFilters = ()=> {
        setGenres([]); setCountry(""); setYears([1990,2025]); setRating(0);
        setDts(""); setDte(""); setKw(""); setTp("");
    };

    /* ---------- ECharts ---------- */
    useEffect(()=>{
        const el=document.getElementById("rating-chart");
        if(!el) return;
        const chart=echarts.init(el);
        const option:any = {
            animation:false,
            grid:{left:"5%",right:"5%",top:"18%",bottom:"15%"},
            xAxis:{type:"value",min:0,max:10,interval:1},
            yAxis:{show:false},
            tooltip:{trigger:"axis",formatter:(p:any)=>`Rating: ${p[0].value}`},
            series:[{type:"scatter",data:[[minRating,1]],symbolSize:20,itemStyle:{color:"#FF574F"}}]
        };
        chart.setOption(option);
        chart.on("click",(p:any)=>{
            const v=Math.round(p.value[0]*10)/10;
            setRating(v);
            option.series[0].data=[[v,1]];
            chart.setOption(option);
        });
        return ()=>chart.dispose();
    },[minRating,theme]);

    /* ---------- JSX ---------- */
    return (
        <Layout>
            <div className={`min-h-screen ${theme==="dark"?"bg-gray-900 text-white":"bg-gray-50 text-gray-900"}`}>
                {/* ===== 메인 ===== */}
                <main className="container mx-auto px-4 py-10">
                    {/*/!* ───────── 탭 토글 ───────── *!/*/}
                    {/*<div className="flex justify-center gap-2 mb-4">*/}
                    {/*    <button*/}
                    {/*        type="button"*/}
                    {/*        disabled*/}
                    {/*        className="px-5 py-2 rounded-full text-sm font-medium bg-[#FF574F] text-white cursor-default"*/}
                    {/*    >*/}
                    {/*        기본 검색*/}
                    {/*    </button>*/}
                    {/*    <button*/}
                    {/*        type="button"*/}
                    {/*        onClick={() =>*/}
                    {/*            navigate(`/plot-search?query=${encodeURIComponent(query.trim())}`)*/}
                    {/*        }*/}
                    {/*        className="px-5 py-2 rounded-full text-sm font-medium bg-gray-200 dark:bg-gray-700 hover:bg-opacity-80"*/}
                    {/*    >*/}
                    {/*        줄거리 검색*/}
                    {/*    </button>*/}
                    {/*</div>*/}

                    {/*/!* ─── 검색 & 버튼 ─── *!/*/}
                    {/*<div className="max-w-3xl mx-auto mb-8">*/}
                    {/*    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-center">*/}
                    {/*        <div className="relative w-full md:w-[500px]">*/}
                    {/*            <input*/}
                    {/*                type="text"*/}
                    {/*                placeholder="Search for movies..."*/}
                    {/*                className="w-full py-3 px-5 pl-12 rounded-xl border-none focus:ring-2 focus:ring-[#FF574F] bg-white dark:bg-gray-800 shadow-md text-base"*/}
                    {/*                value={query}*/}
                    {/*                onChange={e=>setQuery(e.target.value)}*/}
                    {/*            />*/}
                    {/*            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>*/}
                    {/*        </div>*/}

                    {/*        /!* 필터 토글 버튼 *!/*/}
                    {/*        <button*/}
                    {/*            type="button"*/}
                    {/*            onClick={()=>setFilter(prev=>!prev)}*/}
                    {/*            className="flex items-center gap-2 py-3 px-6 rounded-xl bg-[#FF574F] text-white font-medium hover:bg-opacity-90 active:scale-95 transition-all shadow-md !rounded-button whitespace-nowrap"*/}
                    {/*        >*/}
                    {/*            <i className="fas fa-filter"></i><span>Filters</span>*/}
                    {/*        </button>*/}
                    {/*    </form>*/}
                    {/*</div>*/}

                    <SearchBar
                        value={query}
                        onChange={setQuery}
                        onSubmit={handleSearch}
                        showFilterBtn
                        onFilterClick={() => setFilter((p) => !p)}
                        currentTab="basic"
                        onTabClick={(tab) => {
                            if (tab === "plot") {
                                navigate(`/plot-search?query=${encodeURIComponent(query.trim())}`);
                            }
                        }}
                    />

                    {/* ─── 데스크톱 필터 패널 ─── */}
                    {isFilterOpen && (
                        <section className="max-w-3xl mx-auto w-full bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-10">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-semibold">Filters</h3>
                                <button onClick={()=>setFilter(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>

                            {/* 장르 */}
                            <div className="mb-6">
                                <h4 className="font-medium mb-3">Genres</h4>
                                <div className="flex flex-wrap gap-2">
                                    {GENRES.map(g=>(
                                        <button key={g} onClick={()=>toggleGenre(g)}
                                                className={`px-3 py-1 rounded-full text-sm ${genres.includes(g)?"bg-[#FF574F] text-white":"bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"}`}>
                                            {g}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 국가 + 연도 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <select value={country} onChange={e=>setCountry(e.target.value)} className="p-2 rounded bg-gray-100 dark:bg-gray-700">
                                    <option value="">All countries</option>
                                    {COUNTRIES.map(c=><option key={c}>{c}</option>)}
                                </select>
                                <div className="flex items-center justify-between">
                                    <input type="number" min={1900} max={2025} value={yearRange[0]} onChange={e=>setYears([+e.target.value,yearRange[1]])} className="w-24 p-2 rounded bg-gray-100 dark:bg-gray-700 text-center"/>
                                    <span className="mx-2">to</span>
                                    <input type="number" min={1900} max={2025} value={yearRange[1]} onChange={e=>setYears([yearRange[0],+e.target.value])} className="w-24 p-2 rounded bg-gray-100 dark:bg-gray-700 text-center"/>
                                </div>
                            </div>

                            {/* 평점 */}
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-medium">Minimum Rating</h4>
                                    <span className="text-[#FF574F] font-medium">{minRating.toFixed(1)}</span>
                                </div>
                                <div id="rating-chart" className="w-full h-16"></div>
                            </div>

                            {/* 버튼 */}
                            <div className="flex gap-3">
                                <button onClick={resetFilters} className="flex-1 py-2 px-4 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">Reset</button>
                                <button onClick={()=>{fetchSearch(true);setFilter(false);}} className="flex-1 py-2 px-4 rounded-full bg-[#FF574F] text-white">Apply</button>
                            </div>
                        </section>
                    )}

                    {/* ─── 모바일 Drawer(같은 상태 공유) ─── */}
                    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden transition-opacity ${isFilterOpen?"opacity-100 visible":"opacity-0 invisible"}`} onClick={()=>setFilter(false)}>
                        <div className={`absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-xl p-6 transition-transform ${isFilterOpen?"translate-y-0":"translate-y-full"}`} onClick={e=>e.stopPropagation()}>
                            {/* 모바일용 필터 내용(간략) */}
                            <h3 className="text-xl font-semibold mb-4">Filters</h3>
                            {/* 장르 */}
                            <div className="mb-6">
                                <h4 className="font-medium mb-3">Genres</h4>
                                <div className="flex flex-wrap gap-2">
                                    {GENRES.map(g=>(
                                        <button key={g} onClick={()=>toggleGenre(g)}
                                                className={`px-3 py-1 rounded-full text-sm ${genres.includes(g)?"bg-[#FF574F] text-white":"bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"}`}>
                                            {g}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {/* 국가 */}
                            <div className="mb-6">
                                <h4 className="font-medium mb-3">Country</h4>
                                <select value={country} onChange={e=>setCountry(e.target.value)} className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700">
                                    <option value="">All countries</option>
                                    {COUNTRIES.map(c=><option key={c}>{c}</option>)}
                                </select>
                            </div>
                            {/* 평점 */}
                            <div className="mb-6">
                                <h4 className="font-medium mb-2">Minimum Rating: <span className="text-[#FF574F]">{minRating.toFixed(1)}</span></h4>
                                <input type="range" min={0} max={10} step={0.1} value={minRating} onChange={e=>setRating(+e.target.value)} className="w-full"/>
                            </div>
                            {/* 버튼 */}
                            <div className="flex gap-3">
                                <button onClick={resetFilters} className="flex-1 py-3 rounded-full bg-gray-200 dark:bg-gray-700">Reset</button>
                                <button onClick={()=>{fetchSearch(true);setFilter(false);}} className="flex-1 py-3 rounded-full bg-[#FF574F] text-white">Apply</button>
                            </div>
                        </div>
                    </div>

                    {/* ─── 결과 헤더 ─── */}
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-semibold mb-2">Search Results</h2>
                        <p className="text-gray-500 dark:text-gray-400">{total} movies found</p>
                    </div>

                    {/* ─── 결과 리스트 ─── */}
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
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center py-20 text-gray-400">No movies found</p>
                    )}

                    {/* ─── 페이지네이션 ─── */}

                    {totalPages>1 && (
                        <div className="mt-10 flex justify-center items-center gap-4">
                            <button disabled={page<=1}  onClick={()=>setPage(p=>Math.max(1,p-1))} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded">Prev</button>
                            <span>{page} / {totalPages}</span>
                            <button disabled={page>=totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded">Next</button>
                        </div>
                    )}
                </main>
            </div>
        </Layout>
    );
};

export default SearchPage;