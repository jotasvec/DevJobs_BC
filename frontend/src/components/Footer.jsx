import { Link } from '../router/Link.jsx'
import { UI, ROUTES } from '../constants.js'

const Footer = () => {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <nav className="flex items-center gap-6 text-sm text-text-muted">
          <Link href={ROUTES.HOME} className="hover:text-text transition-colors">Home</Link>
          <Link href={ROUTES.JOBS} className="hover:text-text transition-colors">Jobs</Link>
          <Link href={ROUTES.COMPANIES} className="hover:text-text transition-colors">Companies</Link>
        </nav>
        <small className="text-text-muted text-xs">&copy; {UI.FOOTER_TEXT}</small>
      </div>
    </footer>
  )
}

export default Footer
