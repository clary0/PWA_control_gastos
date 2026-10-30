import { Link } from 'react-router'
import NetworkBadge from './NetworkBadge.jsx'

export default function AppHeader({ enLinea }) {
  return (
    <header className="navbar navbar-dark bg-gastos sticky-top">
      <div className="container">
        <Link to="/" className="navbar-brand fw-bold">
          <i
            className="bi bi-wallet2 me-2"
            aria-hidden="true"
          />
          Control de Gastos
        </Link>

        <NetworkBadge enLinea={enLinea} />
      </div>
    </header>
  )
}
