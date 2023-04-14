import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`

@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

*,::after,::before{ 
  box-sizing:border-box;
  margin:0;
  padding:0;      
  font-family:Montserrat;
}

*::-webkit-scrollbar{
  width:0.4em;
}

*::-webkit-scrollbar-track{
  background-color: #ccc;
  box-shadow: inset 0 0 0.1em#bbb;
}
*::-webkit-scrollbar-thumb{
  background-color: #aaa;
  box-shadow: inset 0 0 0.2em #999;
  border-radius: 0.2em;
}
`

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GlobalStyle></GlobalStyle>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
