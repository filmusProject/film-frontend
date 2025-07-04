import React from "react";

export type TabType = "basic" | "plot";

interface Props {
    /* 검색 입력 */
    value: string;
    onChange: (v: string) => void;
    onSubmit: (e: React.FormEvent) => void;

    /* 필터 */
    showFilterBtn?: boolean;
    onFilterClick?: () => void;

    /* 탭 토글 */
    currentTab: TabType;
    onTabClick: (tab: TabType) => void;
}

const SearchBar: React.FC<Props> = ({
                                        value,
                                        onChange,
                                        onSubmit,
                                        showFilterBtn = false,
                                        onFilterClick,
                                        currentTab,
                                        onTabClick,
                                    }) => (
    <form onSubmit={onSubmit} className="flex flex-col items-center gap-4 mb-8">
        {/* ───────── 탭 토글 ───────── */}
        <div className="flex gap-2">
            {(["basic", "plot"] as const).map((tab) => {
                const isActive = currentTab === tab;
                return (
                    <button
                        key={tab}
                        type="button"
                        onClick={() => onTabClick(tab)}
                        disabled={isActive}
                        className={
                            isActive
                                ? "px-5 py-2 rounded-full text-sm font-medium bg-[#FF574F] text-white cursor-default"
                                : [
                                    "px-5 py-2 rounded-full text-sm font-medium",
                                    // ⬇︎ 미선택 상태 : 테마 무관 회색 배경 + 검정 글자
                                    "bg-gray-200 text-gray-900",
                                    "dark:bg-gray-200 dark:text-gray-900",
                                    "hover:bg-opacity-80",
                                ].join(" ")
                        }
                    >
                        {tab === "basic" ? "기본 검색" : "줄거리 검색"}
                    </button>
                );
            })}
        </div>

        {/* ───────── 검색창 & 필터 ───────── */}
        <div className="flex items-center gap-4 w-full justify-center">
            {/* 입력창 */}
            <div className="relative w-full max-w-xl">
                <input
                    type="text"
                    placeholder="Search for movies..."
                    className="
            w-full py-3 px-5 pl-12 rounded-xl border-none shadow-md
            bg-white dark:bg-white          /* 배경 고정 */
            text-gray-900 placeholder-gray-500
            dark:text-gray-900 dark:placeholder-gray-500  /* 다크모드도 동일 색 */
            focus:ring-2 focus:ring-[#FF574F]
          "
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
                <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            </div>

            {/* 필터 버튼(옵션) */}
            {showFilterBtn && (
                <button
                    type="button"
                    onClick={onFilterClick}
                    className="flex items-center gap-2 py-3 px-6 rounded-xl bg-[#FF574F] text-white font-medium hover:bg-opacity-90 active:scale-95 transition-all shadow-md"
                >
                    <i className="fas fa-filter" />
                    <span>Filters</span>
                </button>
            )}
        </div>
    </form>
);

export default SearchBar;