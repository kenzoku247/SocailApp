import React from 'react';
import App from './App';
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DataProvider from './redux/store';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';


const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <DataProvider>
      <BrowserRouter>
        <Routes>
          <Route path = "*" element = {<App/>}/>
        </Routes>
      </BrowserRouter>
    </DataProvider>
  </React.StrictMode>,

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

