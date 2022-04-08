import React from 'react';
import { createRoot } from 'react-dom/client';
import { HomePage } from './pages/HomePage';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import reportWebVitals from './reportWebVitals';
import './index.css';

initializeIcons(/* optional base url */);
const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <HomePage />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
