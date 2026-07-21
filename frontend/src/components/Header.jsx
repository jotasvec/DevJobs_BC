import '../App.css';
import Avatar from './Avatar';
import { Link, NavLink } from '../router/Link.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { useRouter } from '../hooks/useRouter.jsx';
import { ROUTES, UI } from '../constants.js';

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
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-code"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 8l-4 4l4 4" /><path d="M17 8l4 4l-4 4" /><path d="M14 4l-4 16" /></svg>
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
                                <Avatar username={user?.email?.split('@')[0] || 'user'} />
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
