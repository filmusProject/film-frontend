// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';
import './styles/variables.css';
import './index.css'; // Tailwind 스타일 포함
import { BrowserRouter } from 'react-router-dom'; // ✅ BrowserRouter로 변경

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter basename="/film-frontend"> {/* ✅ 여기서 BrowserRouter로 감싸기 */}
            <App />
        </BrowserRouter>
    </React.StrictMode>
);