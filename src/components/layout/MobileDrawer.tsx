// src/components/layout/MobileDrawer.tsx
import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
    open: boolean;
    onClose: () => void;
    isAuthenticated: boolean;
    onLogin: () => void;
}

const MobileDrawer: React.FC<Props> = ({
                                           open,
                                           onClose,
                                           isAuthenticated,
                                           onLogin,
                                       }) => (
    <AnimatePresence>
        {open && (
            <>
                {/* 오버레이 */}
                <motion.div
                    key="overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 bg-black z-40"
                    onClick={onClose}
                />

                {/* 드로어 패널 */}
                <motion.aside
                    key="drawer"
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="fixed right-0 top-0 h-full w-72 max-w-[80%] bg-white dark:bg-gray-800 z-50 shadow-xl pb-10 flex flex-col"
                >
                    {/* 닫기 버튼 */}
                    <button
                        onClick={onClose}
                        className="self-end p-4 text-2xl text-gray-600 dark:text-gray-300"
                    >
                        <i className="fas fa-times" />
                    </button>

                    <nav className="flex flex-col gap-4 px-8">
                        <Link
                            to="/"
                            onClick={onClose}
                            className="text-lg font-semibold text-gray-800 dark:text-gray-100 hover:text-[#FF574F] dark:hover:text-[#FF574F]"
                        >
                            홈
                        </Link>
                        <Link
                            to="/search"
                            onClick={onClose}
                            className="text-lg font-semibold text-gray-800 dark:text-gray-100 hover:text-[#FF574F] dark:hover:text-[#FF574F]"
                        >
                            검색
                        </Link>
                        <Link
                            to="/recommend"
                            onClick={onClose}
                            className="text-lg font-semibold text-gray-800 dark:text-gray-100 hover:text-[#FF574F] dark:hover:text-[#FF574F]"
                        >
                            추천
                        </Link>

                        {/* 로그인 버튼(비로그인 시) */}
                        {!isAuthenticated && (
                            <button
                                onClick={() => {
                                    onClose();
                                    onLogin();
                                }}
                                className="mt-6 py-2 rounded-lg font-semibold bg-[#FF574F] text-white hover:bg-opacity-90 transition"
                            >
                                로그인
                            </button>
                        )}
                    </nav>
                </motion.aside>
            </>
        )}
    </AnimatePresence>
);

export default MobileDrawer;