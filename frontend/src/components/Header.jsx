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
        <header>
            <Link href="/" style={{ textDecoration: 'none' }}>
                <h2>
                    <Code size={24} className="text-accent" />
                    {UI.APP_NAME}
                </h2>
            </Link>
            <nav>
                <NavLink href={ROUTES.HOME} rel="noopener noreferrer">{UI.START}</NavLink>
                <NavLink href={ROUTES.JOBS} rel="noopener noreferrer">{UI.JOBS}</NavLink>
                <NavLink href={ROUTES.COMPANIES} rel="noopener noreferrer">{UI.COMPANIES}</NavLink>
            </nav>
            <div>
                {
                    isLoggedIn
                        ? (
                            <div>
                                <Avatar username={user?.email?.split('@')[0] || user.name} />
                                {user?.role === ROLES.SEEKER && (
                                    <NavLink href={ROUTES.MY_APPLICATIONS}>Applications</NavLink>
                                )}
                                {user?.role === ROLES.RECRUITER && (
                                    <NavLink href={ROUTES.MY_JOBS}>My Jobs</NavLink>
                                )}
                                <NavLink href={`${ROUTES.PROFILE}/${user.id}`}>{user?.name || user?.email}</NavLink>
                                <button onClick={handleLogOut}>{UI.LOGOUT}</button>
                            </div>
                        ) : <div>
                            <NavLink href={ROUTES.SIGNIN} rel="noopener noreferrer">{UI.SIGN_IN}</NavLink>
                            <NavLink href={ROUTES.SIGNUP_RECRUITER} rel="noopener noreferrer">{UI.POST_A_JOB}</NavLink>
                        </div>
                }
            </div>
        </header>
    )
}

export default Header
