import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'      
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    {/* Bọc App bằng BrowserRouter để app toàn bộ sử dụng routing dựa trên URL */}
    <App />
  </BrowserRouter>
)