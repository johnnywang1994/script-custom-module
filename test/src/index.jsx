// import React from 'react';

// import { createRoot } from 'react-dom/client';
// import App from './Download.jsx';
// import './index.css';

// createRoot(document.getElementById('app')).render(<App />);

import { createApp } from 'vue';
import App from './App.vue';
import './index.css';
import './no.js';
import dataJson from './data.json';
import dataYaml from './data.yml';
import htmlSnippet from './snippet.html';
console.log(dataJson, dataYaml, htmlSnippet);

createApp(App).mount('#app');
