import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx';
import { BrowserRouter} from "react-router-dom";
import { Toaster} from "react-hot-toast";
import { SocketProvider } from './lib/Socket.jsx';
import { Provider} from "react-redux";
import store from "./redux/store.jsx";
 
createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <SocketProvider>
        <Provider store={store}>
          <App />
          <Toaster position='top-center' toastOptions={{
            success: { duration: 5000},
            error: { duration: 5000},
          }}
          /> 
        </Provider>
      </SocketProvider>
    </BrowserRouter>
)
