import React from 'react';
import { createRoot } from 'react-dom/client';
import { SimWidget } from './SimWidget';
import './index.css';
import reportWebVitals from './reportWebVitals';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <SimWidget
      x={0}
      y={0}
      glassHeight={40}
      glassWidth={30}
      glasFontSize={8}
      glassHorizontalMargin={0}
      glassVerticalMargin={0}
      pyramidMarginLeft={50}
    />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
