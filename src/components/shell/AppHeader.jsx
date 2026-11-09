
import { Link } from 'react-router'
import InstallButton from './InstallButton.jsx'
import NetworkBadge from './NetworkBadge.jsx'

export default function AppHeader({ enLinea }) {
  return (
    <header className="navbar navbar-dark bg-gastos sticky-top">
      <div className="container flex-nowrap">
        <Link to="/" className="navbar-brand fw-bold text-truncate">
          <i className="bi bi-wallet2 me-2" aria-hidden="true"></i>
          Gastos
        </Link>

        <div className="d-flex align-items-center gap-2">
          <InstallButton />
          <NetworkBadge enLinea={enLinea} />
        </div>
      </div>
    </header>
  )
}
