import React, { useEffect, useRef } from 'react';
import { count } from 'src/utils.jsx';

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
    image.src = 'https://pixiv.cat/102233001.jpg';
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
