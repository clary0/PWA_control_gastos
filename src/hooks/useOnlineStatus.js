
import { useState, useEffect } from 'react'

function useOnlineStatus() {
  const [enLinea, setEnLinea] = useState(() => navigator.onLine)

  useEffect(() => {
    function conexionRestaurada() {
      setEnLinea(true)
    }

    function conexionPerdida() {
      setEnLinea(false)
    }

    window.addEventListener('online', conexionRestaurada)
    window.addEventListener('offline', conexionPerdida)

    return () => {
      window.removeEventListener('online', conexionRestaurada)
      window.removeEventListener('offline', conexionPerdida)
    }
  }, [])

  return enLinea
}

export default useOnlineStatus
