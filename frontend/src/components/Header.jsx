import Avatar from './Avatar';
import { Link, NavLink } from '../router/Link.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { useRouter } from '../hooks/useRouter.jsx';
import { ROLES, ROUTES, UI } from '../constants.js';
import { Code } from 'lucide-react';

const Header = () => {
    const { isLoggedIn, user, logout } = useAuth();
    const { navigateTo } = useRouter();

    const handleLogOut = async () => {
        await logout()
        navigateTo(ROUTES.HOME)
    }

    return (
        <header className="sticky top-0 z-[100] border-b border-border bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 px-6 py-2 flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-1.5 shrink-0 no-underline">
                <Code size={24} className="text-primary-light" />
                <h2 className="text-xl font-bold text-text">{UI.APP_NAME}</h2>
            </Link>
            <nav className="flex items-center gap-4 flex-1 justify-center">
                <NavLink href={ROUTES.HOME} className="text-text-secondary font-medium transition-colors hover:text-primary-hover">{UI.START}</NavLink>
                <NavLink href={ROUTES.JOBS} className="text-text-secondary font-medium transition-colors hover:text-primary-hover">{UI.JOBS}</NavLink>
                <NavLink href={ROUTES.COMPANIES} className="text-text-secondary font-medium transition-colors hover:text-primary-hover">{UI.COMPANIES}</NavLink>
            </nav>
            <div className="flex gap-2 items-center shrink-0">
                {isLoggedIn ? (
                    <>
                        <Avatar username={user?.email?.split('@')[0] || user.name} />
                        {user?.role === ROLES.SEEKER && (
                            <NavLink href={ROUTES.MY_APPLICATIONS} className="px-4 py-2 bg-primary-light/20 rounded-lg text-text text-sm font-bold transition-colors hover:bg-primary-light/30">Applications</NavLink>
                        )}
                        {user?.role === ROLES.RECRUITER && (
                            <NavLink href={ROUTES.MY_JOBS} className="px-4 py-2 bg-primary-light/20 rounded-lg text-text text-sm font-bold transition-colors hover:bg-primary-light/30">My Jobs</NavLink>
                        )}
                        <NavLink href={`${ROUTES.PROFILE}/${user.id}`} className="px-4 py-2 bg-primary-light/20 rounded-lg text-text text-sm font-bold transition-colors hover:bg-primary-light/30">{user?.name || user?.email}</NavLink>
                        <button className="px-4 py-2 bg-primary-light rounded-lg text-text text-sm font-bold transition-colors hover:bg-primary-hover" onClick={handleLogOut}>{UI.LOGOUT}</button>
                    </>
                ) : (
                    <>
                        <NavLink href={ROUTES.SIGNIN} className="px-4 py-2 bg-primary-light/20 rounded-lg text-text text-sm font-bold transition-colors hover:bg-primary-light/30">{UI.SIGN_IN}</NavLink>
                        <NavLink href={ROUTES.SIGNUP_RECRUITER} className="px-4 py-2 bg-primary-light/20 rounded-lg text-text text-sm font-bold transition-colors hover:bg-primary-light/30">{UI.POST_A_JOB}</NavLink>
                    </>
                )}
            </div>
        </header>
    )
}

export default Header
