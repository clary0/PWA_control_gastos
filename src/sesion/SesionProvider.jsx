import { useEffect, useState } from 'react'
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInAnonymously,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import { auth } from '../config/firebase.js'
import { SesionContext } from './SesionContext.js'

// Invitado en silencio. Necesita red: sin red se reintenta al volver.
function entrarComoInvitado() {
  if (navigator.onLine && !auth.currentUser) {
    signInAnonymously(auth).catch((error) => console.error('Invitado:', error.code))
  }
}

function entrarConGoogle() {
  signInWithPopup(auth, new GoogleAuthProvider()).catch((error) =>
    console.error('Google:', error.code),
  )
}

function salir() {
  signOut(auth) // al salir, vuelve a entrar como invitado
}

export function SesionProvider({ children }) {
  const [usuario, setUsuario] = useState(null)

    useEffect(() => {
    // Firebase recuerda la sesión en el navegador, también sin red
    const dejarDeEscuchar = onAuthStateChanged(auth, (usuarioActual) => {
      setUsuario(usuarioActual)
      if (!usuarioActual) entrarComoInvitado()
    })

    window.addEventListener('online', entrarComoInvitado)

    return () => {
      dejarDeEscuchar()
      window.removeEventListener('online', entrarComoInvitado)
    }
  }, [])

  return (
    <SesionContext.Provider value={{ usuario, entrarConGoogle, salir }}>
      {children}
    </SesionContext.Provider>
  )
}