import { useContext } from 'react'
import { SesionContext } from './SesionContext.js'

export function useSesion() {
  return useContext(SesionContext)
}