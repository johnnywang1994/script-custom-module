import React, { useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);
  return (
    <div>
      <span>Count: {count}</span>
      <br></br>
      <button onClick={() => setCount(count + 1)}>
        LIKE!
      </button>
    </div>
  );
};

export default Counter;
