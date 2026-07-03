const AuthForm = ({
    isSignUp = false,
    onSubmit,
    title,
    subtitle,
    submitText,
    altText,
    altButtonText,
    altButtonAction
}) => {
    return (
        <section className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <span className="auth-header-label">{isSignUp ? 'Create account' : 'Welcome back'}</span>
                    <h1>{title}</h1>
                    <p>{subtitle}</p>
                </div>

                <form className="auth-form" onSubmit={onSubmit}>
                    {isSignUp && (
                        <div className="auth-field">
                            <label htmlFor="name">Full Name</label>
                            <input type="text" name="name" id="name" placeholder="Ada Lovelace" required />
                        </div>
                    )}
                    <div className="auth-field">
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" placeholder="you@company.com" required />
                    </div>
                    <div className="auth-field">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" id="password" placeholder="Enter your password" required />
                    </div>
                    {isSignUp && (
                        <div className="auth-field">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirm your password" required />
                        </div>
                    )}

                    {!isSignUp ? (
                        <div className="auth-extras">
                            <label className="auth-checkbox">
                                <input type="checkbox" name="remember" id="remember" />
                                <span>Remember me</span>
                            </label>
                            <a href="#" className="auth-link">Forgot password?</a>
                        </div>
                    ) : (
                        <div className="auth-extras">
                            <label className="auth-checkbox">
                                <input type="checkbox" name="terms" id="terms" required />
                                <span>I agree to the Terms & Conditions</span>
                            </label>
                        </div>
                    )}

                    <button type="submit" className="auth-submit">{submitText}</button>
                </form>

                <div className="auth-footer">
                    <p>{altText}</p>
                    {!isSignUp ? (
                        <div className="auth-alt-buttons">
                            <button type="button" onClick={() => altButtonAction('dev')}>Sign up as Dev</button>
                            <button type="button" onClick={() => altButtonAction('company')}>Sign up as Company</button>
                        </div>
                    ) : (
                        <button type="button" className="auth-alt-single" onClick={altButtonAction}>{altButtonText}</button>
                    )}
                </div>
            </div>
        </section>
    )
}

export default AuthForm
