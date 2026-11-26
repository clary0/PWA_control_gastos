
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore'

// Configuración de Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyBF5Vs7kPbrD1FB0WfqvbVNtHiURA8HeZg',
  authDomain: 'pwacontroldegastos.firebaseapp.com',
  projectId: 'pwacontroldegastos',
  storageBucket: 'pwacontroldegastos.firebasestorage.app',
  messagingSenderId: '964704454444',
  appId: '1:964704454444:web:4a81c3c57edb81f8450e89',
}

export const app = initializeApp(firebaseConfig)

// La sesión se guarda en el navegador y sigue activa sin red
export const auth = getAuth(app)

// Caché persistente de Firestore
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
})
