import React from 'react';
import * as echarts from 'echarts';
import Counter from 'src/components/Counter.jsx';

console.log(echarts);

const homeStyle = {
  maxWidth: 600,
  margin: '10px auto',
  textAlign: 'center'
};

const App = () => {
  return (
    <div style={homeStyle}>
      <h2>Welcome to React - Script Custom Module</h2>
      <p>If you like this project, click "Like" below!!</p>
      <Counter />
    </div>
  );
};

export default App;
