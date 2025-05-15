// import React from 'react';
// import { createRoot } from 'react-dom/client';
// import App from 'src/Download.jsx';
// import 'src/index.css';

// createRoot(document.getElementById('app')).render(<App />);

import { createApp } from 'vue';
import App from 'src/App.vue';
import 'src/index.css';
import 'src/no.js';
import dataJson from 'src/data.json';
import dataYaml from 'src/data.yml';
import htmlSnippet from 'src/snippet.html';
console.log(dataJson, dataYaml, htmlSnippet);

createApp(App).mount('#app');
