import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import 'bootstrap/dist/css/bootstrap.min.css';
import { UserContextProvider } from './context/userContext';

// Init QueryClient and QueryClientProvider here ...
import { QueryClient, QueryClientProvider } from 'react-query';

// favicon
import Favicon from './assets/DumbMerch.png';
const favicon = document.getElementById('idFavicon');
favicon.setAttribute('href', Favicon);

// Init Client from QueryClient() here ...
const client = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <UserContextProvider>
      {/* Add opening QueryClientProvider component and client as props */}
      <QueryClientProvider client={client}>
        <Router>
          <App />
        </Router>
        {/* Add closing QueryClientProvider component */}
      </QueryClientProvider>
    </UserContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
