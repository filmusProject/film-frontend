import React, { useState } from 'react';
import Layout from '../components/Layout'; // 경로는 src/pages에서 시작한다고 가정

const TogetherPage = () => {
  const [roomCode, setRoomCode] = useState('');
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  const handleJoin = () => {
    if (roomCode.trim()) {
      alert(`방 코드 ${roomCode}로 입장합니다.`);
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      setChat([...chat, { text: message, user: '나' }]);
      setMessage('');
    }
  };

  return (
    <Layout>  {/* Layout 적용 시작 */}
    <div className="min-h-screen bg-[#121212] text-white font-sans px-6 py-20">
      <div className="max-w-4xl mx-auto space-y-12">
        <h1 className="text-2xl font-bold">🎬 같이보기 방 입장</h1>

        <div className="bg-[#1E1E1E] p-6 rounded-lg space-y-4">
          <label className="block">방 코드 입력</label>
          <input
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            placeholder="ROOM123"
            className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-lg"
          />
          <button onClick={handleJoin} className="bg-custom text-white px-4 py-2 rounded-button">입장하기</button>
        </div>

        <div className="bg-[#1E1E1E] p-6 rounded-lg space-y-4">
          <h2 className="text-xl font-semibold">💬 채팅창</h2>
          <div className="h-60 bg-[#2A2A2A] p-4 rounded-lg overflow-y-auto space-y-2">
            {chat.map((c, idx) => (
              <div key={idx} className="text-sm"><strong>{c.user}:</strong> {c.text}</div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="메시지를 입력하세요"
              className="flex-grow bg-[#2A2A2A] px-4 py-2 rounded-lg"
            />
            <button onClick={sendMessage} className="bg-custom text-white px-4 py-2 rounded-button">보내기</button>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default TogetherPage;