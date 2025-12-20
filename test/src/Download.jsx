import React, { useEffect, useRef } from 'react';
import { count } from './utils.jsx';

const App = () => {
  const canvasRef = useRef(null);

  const onPreview1 = async () => {
    const time = await count((resolve) => {
      const url = canvasRef.current.toDataURL('image/png', 1.0);
      console.log(url);
      resolve();
    });
    console.log(time);
  };

  const onPreview2 = async () => {
    const time = await count((resolve) => {
      canvasRef.current.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        console.log(url);
        resolve();
      });
    });
    console.log(time);
  };

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    const image = document.createElement('img');
    image.src = 'https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_16x9.jpg?w=300';
    image.crossOrigin = "anonymous";
    image.onload = () => ctx.drawImage(image, 0, 0);
  }, []);

  return (
    <>
      <button onClick={onPreview2}>Preview</button>
      <div>
        <h5>Canvas:</h5>
        <canvas width="2000" height="2000" style={{ width: '100%', height: '100%' }} ref={canvasRef} />
      </div>
    </>
  );
};

export default App;
