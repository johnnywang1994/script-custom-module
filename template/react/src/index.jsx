import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './global.scss';

createRoot(document.getElementById('root')).render(<App />);