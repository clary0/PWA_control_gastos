
export default function NetworkBadge({ enLinea }) {
  const color = enLinea ? 'online' : 'offline'
  const texto = enLinea ? 'En línea' : 'Sin conexión'

  return (
    <span
      className={`estado ${color}`}
      role="status"
      aria-live="polite"
    >
      <span className="punto" aria-hidden="true" />
      {texto}
    </span>
  )
}
