import InputField from './InputField.jsx'

const AuthForm = ({
    isSignUp = false,
    onSubmit,
    title,
    subtitle,
    submitText,
    altText,
    altButtonText,
    altButtonAction,
    register,
    errors,
    error
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
                        <InputField
                            name="name"
                            label="Full Name"
                            placeholder="Ada Lovelace"
                            type="text"
                            register={register}
                            error={errors?.name}
                        />
                    )}
                    <InputField
                        name="email"
                        label="Email"
                        placeholder="you@company.com"
                        type="email"
                        register={register}
                        error={errors?.email}
                    />
                    <InputField
                        name="password"
                        label="Password"
                        placeholder="Enter your password"
                        type="password"
                        register={register}
                        error={errors?.password}
                    />
                    {isSignUp && (
                        <InputField
                            name="confirmPassword"
                            label="Confirm Password"
                            placeholder="Confirm your password"
                            type="password"
                            register={register}
                            error={errors?.confirmPassword}
                        />
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

                    {error && (
                        <div className="auth-error">
                            {typeof error === 'string' ? error : error.message || 'An error occurred'}
                        </div>
                    )}

                    <button type="submit" className="auth-submit">
                        { submitText }
                    </button>
                </form>

                <div className="auth-footer">
                    <p>{altText}</p>
                    {!isSignUp ? (
                        <div className="auth-alt-buttons">
                            <button type="button" onClick={() => altButtonAction('seeker')}>Sign up as Dev</button>
                            <button type="button" onClick={() => altButtonAction('recruiter')}>Sign up as Company</button>
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