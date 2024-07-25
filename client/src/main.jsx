import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from "react-redux";
import "./index.css";
import { persistor, store } from "./app/store.js";
import { PersistGate } from 'redux-persist/integration/react';
import ThemeProvider from "./Components/ThemeProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
  <PersistGate persistor={persistor}>
  <Provider store={store}>
    <ToastContainer
      position="bottom-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
    />
    <ThemeProvider>
    <App />
    </ThemeProvider>
    </Provider>
    </PersistGate>
  </React.StrictMode>
);
