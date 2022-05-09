import React from 'react'
import styled from 'styled-components'

const ContainerDiv = styled.div`
  width: 600px;
  margin: auto;
  color: blue;
`;

const a: number = 2;

console.log(a);

function HelloWorld() {
  return (
    <ContainerDiv>
      Hello World
    </ContainerDiv>
  )
}

export default HelloWorld;

function mixin(extend) {
  return function(target) {
    Object.assign(target, extend);
  }
}

class A {
  constructor() {
    this.x = '1'
  }
}

@mixin(A)
class B {
  constructor() {
    this.y = '2'
  }
}

const my_b = new B();
console.log(my_b);