"use client";
import styled, { createGlobalStyle } from "styled-components";

export const LayoutStyleProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <LayoutStyle>
      <GlobalStyle />
      {children}
    </LayoutStyle>
  );
};

const LayoutStyle = styled.body`
  //background: linear-gradient(to top right, #311D3F, #522546, #88304E, #E23E57);

  background-color: #c48353;
`;
const GlobalStyle = createGlobalStyle`
  //@font-face {
  //  font-family: "prodfont";
  //  src: url("/SDK_SC_Web.ttf") format("truetype");
  //}

  @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;700&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Barlow', sans-serif;
    background-color: #f9f9f9;
  }
  
  //div{
  //  font-family: "prodfont", sans-serif;
  //}
`;
