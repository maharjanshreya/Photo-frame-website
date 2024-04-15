import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {SearchProvider} from './context/search';
import { CartProvider } from './context/cart';
import { WishlistProvider } from './context/wishlist';
import { AddCartProvider} from './context/token';
import { AuthProvider} from './context/token';
import { Auth2Provider} from './context/role';
import { UserProvider } from './context/user';
import { BrowserRouter } from 'react-router-dom';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
    <Auth2Provider>
      <UserProvider>
        <SearchProvider>
          <CartProvider>
            <WishlistProvider>
            
              <App />
              
              </WishlistProvider>
          </CartProvider>
        </SearchProvider>
      </UserProvider>
     </Auth2Provider>
    </AuthProvider>
  </React.StrictMode>
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
