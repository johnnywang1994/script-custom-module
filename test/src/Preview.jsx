import React, { useState } from 'react';
import styled from 'styled-components';
import { count } from 'src/utils.jsx';

const StyledImage = styled.img`
  width: 300px;
`;

const App = () => {
  const [preview, setPreview] = useState('');

  const onFileChange1 = async (e) => {
    const time = await count((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        console.log(reader.result);
        setPreview(reader.result);
        resolve();
      };
      reader.readAsDataURL(e.target.files[0]);
    });
    console.log(time);
  };

  const onFileChange2 = async (e) => {
    const time = await count((resolve) => {
      const url = URL.createObjectURL(e.target.files[0]);
      setPreview(url);
      resolve();
    });
    console.log(time);
  };

  return (
    <>
      <input type="file" onChange={onFileChange2} />
      <div>
        <h5>Preview Image:</h5>
        <StyledImage src={preview} />
      </div>
    </>
  );
};

export default App;
