import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { useAuth } from "../contexts/AuthContext";
import axios from "../utils/axiosInstance";

interface Bookmark {
  movieId: string;
  title: string;
  posterUrl: string;
}

interface Review {
  reviewId: number;
  rating: number;
  content: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  movieId?: string;
  title?: string;
  posterUrl?: string;
}

const Mypage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"bookmarks" | "reviews">("bookmarks");
  const [nickname, setNickname] = useState(user?.nickname || "User");
  const [avatar, setAvatar] = useState<string>("/default-avatar.png");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState<string>("");

  useEffect(() => {
    if (!user) return;
    axios.get<Bookmark[]>("/bookmarks").then((res) => setBookmarks(res.data));
    axios.get<Review[]>("/reviews/me").then((res) => setReviews(res.data));
  }, [user]);

  const handleLogout = async () => {
    if (window.confirm("정말 로그아웃 하시겠습니까?")) {
      await logout();
      alert("로그아웃 되었습니다.");
    }
  };

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) setAvatar(ev.target.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleNicknameChange = (e: React.FormEvent<HTMLSpanElement>) => {
    setNickname(e.currentTarget.textContent || "User");
  };

  const handleOpenDetail = (movieId: string) => navigate(`/movie/${movieId}`);

  const handleDeleteBookmark = async (movieId: string) => {
    if (!window.confirm("이 영화를 찜 목록에서 제거할까요?")) return;
    try {
      await axios.delete(`/bookmarks?movieId=${movieId}`);
      setBookmarks((prev) => prev.filter((b) => b.movieId !== movieId));
    } catch {
      alert("삭제 실패");
    }
  };

  const startEditReview = (review: Review) => {
    setEditingId(review.reviewId);
    setEditContent(review.content);
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };
  const submitEdit = async () => {
    if (editingId == null) return;
    try {
      await axios.put(`/reviews/${editingId}`, { content: editContent });
      setReviews((prev) =>
          prev.map((r) =>
              r.reviewId === editingId ? { ...r, content: editContent } : r
          )
      );
      cancelEdit();
    } catch {
      alert("수정 실패");
    }
  };
  const handleDeleteReview = async (reviewId: number) => {
    if (!window.confirm("리뷰를 삭제할까요?")) return;
    try {
      await axios.delete(`/reviews/${reviewId}`);
      setReviews((prev) => prev.filter((r) => r.reviewId !== reviewId));
    } catch {
      alert("삭제 실패");
    }
  };

  const renderBookmarks = () => (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {bookmarks.map((m) => (
            <div key={m.movieId} className="relative group rounded-xl glass overflow-hidden shadow">
              <img
                  src={m.posterUrl || "https://via.placeholder.com/300x450?text=No+Image"}
                  alt={m.title}
                  className="w-full h-72 object-cover cursor-pointer"
                  onClick={() => handleOpenDetail(m.movieId)}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 flex items-center justify-center transition-all">
                <button
                    onClick={() => handleDeleteBookmark(m.movieId)}
                    className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-3 rounded-full hover:scale-110"
                >
                  <i className="fas fa-trash" />
                </button>
              </div>
              <div className="p-2 text-center text-sm font-medium bg-white dark:bg-gray-800 truncate">
                {m.title}
              </div>
            </div>
        ))}
      </div>
  );

  const renderReviews = () => (
      <div className="space-y-6">
        {reviews.map((r) => (
            <div key={r.reviewId} className="glass p-6 rounded-xl shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">리뷰 #{r.reviewId}</h3>
                {editingId === r.reviewId ? (
                    <div className="space-x-2">
                      <button onClick={submitEdit} className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm">저장</button>
                      <button onClick={cancelEdit} className="text-gray-500 hover:text-red-500 px-3 py-1 text-sm">취소</button>
                    </div>
                ) : (
                    <div className="space-x-2 text-gray-500">
                      <button onClick={() => startEditReview(r)} className="hover:text-indigo-600"><i className="fas fa-edit" /></button>
                      <button onClick={() => handleDeleteReview(r.reviewId)} className="hover:text-red-600"><i className="fas fa-trash" /></button>
                    </div>
                )}
              </div>
              <p className="text-yellow-400">{"★".repeat(Math.round(r.rating))}</p>
              {editingId === r.reviewId ? (
                  <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full mt-2 p-2 border rounded-lg text-sm"
                      rows={4}
                  />
              ) : (
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 whitespace-pre-line">{r.content}</p>
              )}
              <p className="text-xs text-gray-400 mt-2">작성일: {new Date(r.createdAt).toLocaleDateString()}</p>
            </div>
        ))}
      </div>
  );

  return (
      <Layout>
        <div className="min-h-screen px-4 py-10">
          <div className="max-w-5xl mx-auto">
            <section className="glass rounded-xl mb-8 overflow-hidden p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="text-center">
                  <div className="relative group mb-4 w-24 h-24 mx-auto">
                    <img
                        src={avatar}
                        alt="profile"
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow cursor-pointer"
                        onClick={handleAvatarClick}
                    />
                    <div
                        className="absolute inset-0 bg-black/0 group-hover:bg-black/50 flex items-center justify-center rounded-full transition"
                        onClick={handleAvatarClick}
                    >
                      <i className="fas fa-camera text-white opacity-0 group-hover:opacity-100" />
                    </div>
                    <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleFileChange} />
                  </div>
                  <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={handleNicknameChange}
                      className="text-xl font-semibold block outline-none border-b border-transparent focus:border-indigo-500"
                  >
                  {nickname}
                </span>
                  <p className="text-gray-500">{user?.email}</p>
                </div>
                <div className="flex-1 w-full space-y-4">
                  <div className="glass p-6 rounded-xl">
                    <h3 className="text-lg font-semibold mb-3">내 활동 통계</h3>
                    <ul className="text-sm space-y-2 text-gray-600 dark:text-gray-300">
                      <li className="flex justify-between"><span>찜한 영화</span><span>{bookmarks.length} 개</span></li>
                      <li className="flex justify-between"><span>작성한 리뷰</span><span>{reviews.length} 개</span></li>
                    </ul>
                  </div>
                  <div className="flex justify-end gap-4">
                    <Link to="/password/change" className="text-sm text-gray-500 hover:text-indigo-600">비밀번호 변경</Link>
                    <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-full text-sm font-medium">
                      로그아웃
                    </button>
                  </div>
                </div>
              </div>
            </section>
            <div className="flex justify-center mb-6">
              <div className="glass p-1 rounded-full flex">
                <button onClick={() => setActiveTab("bookmarks")} className={`py-2 px-6 rounded-full transition ${activeTab === "bookmarks" ? "bg-indigo-600 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}>
                  <i className="fas fa-bookmark mr-2" /> 찜한 영화
                </button>
                <button onClick={() => setActiveTab("reviews")} className={`py-2 px-6 rounded-full transition ${activeTab === "reviews" ? "bg-indigo-600 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}>
                  <i className="fas fa-star mr-2" /> 내가 쓴 리뷰
                </button>
              </div>
            </div>
            <section>{activeTab === "bookmarks" ? renderBookmarks() : renderReviews()}</section>
          </div>
        </div>
      </Layout>
  );
};

export default Mypage;