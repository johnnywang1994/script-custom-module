// import React from 'react';
// import { render } from 'react-dom';
// import App from 'src/Download.jsx';
// import 'src/index.css';

// render(<App />, document.getElementById('app'));

import { createApp } from 'vue';
import App from 'src/App.vue';
import 'src/index.css';
import 'src/no.js';

createApp(App).mount('#app');
