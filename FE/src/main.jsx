import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {Toaster} from 'react-hot-toast';
import './index.css'
import App from './App.jsx'
import { store } from './store/store.jsx'
import { Provider } from 'react-redux';
import { AuthProvider } from './context/AuthContext.jsx';


createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <AuthProvider>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }}  />
      <App />
    </AuthProvider>
  </Provider>

)
