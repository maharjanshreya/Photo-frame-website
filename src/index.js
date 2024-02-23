import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {SearchProvider} from './context/search';
import { CartProvider } from './context/cart';
import { AddCartProvider} from './context/token';
import { AuthProvider} from './context/token';
import { UserProvider } from './context/user';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <UserProvider>
        <SearchProvider>
          <CartProvider>
            
              <App />
          
          </CartProvider>
        </SearchProvider>
      </UserProvider>
    </AuthProvider>
  </React.StrictMode>
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
