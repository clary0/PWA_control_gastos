
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.min.css'
import App from './App.jsx'
import './styles/app.css'
import { SesionProvider } from './sesion/SesionProvider.jsx'

// Sincronización de fotografías con Cloudinary.
import { imagenesActivas } from './config/cloudinary.js'
import { iniciarSincronizacionImagenes } from './modules/imagenes/imagenesRepository.js'

// Inicia la sincronización solamente si Cloudinary está configurado.
if (imagenesActivas) {
  iniciarSincronizacionImagenes()
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <SesionProvider>
        <App />
      </SesionProvider>
    </BrowserRouter>
  </StrictMode>,
)
