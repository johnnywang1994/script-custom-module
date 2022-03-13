import React from 'react'
import styled from 'styled-components'

const ContainerDiv = styled.div`
  width: 600px;
  margin: auto;
  color: blue;
`;

function HelloWorld() {
  return (
    <ContainerDiv>
      Hello World
    </ContainerDiv>
  )
}

export default HelloWorld;
