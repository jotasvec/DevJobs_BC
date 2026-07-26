import InputField from './InputField.jsx'
import { ERRORS, ROLES, UI } from '../constants.js'

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
        <section className="flex justify-center items-center min-h-[70vh] px-6 py-8">
            <div className="w-full max-w-[28rem]">
                <div className="text-center mb-8">
                    <span className="font-mono text-xs font-medium tracking-widest uppercase text-accent mb-3 block">
                        {isSignUp ? UI.CREATE_ACCOUNT : UI.WELCOME_BACK}
                    </span>
                    <h1 className="font-heading text-[1.75rem] font-bold tracking-tight mb-2">{title}</h1>
                    <p className="text-[0.95rem] text-text-secondary">{subtitle}</p>
                </div>

                <form className="flex flex-col gap-5 p-8 bg-card border border-white/6 rounded-xl" onSubmit={onSubmit}>
                    {isSignUp && (
                        <InputField
                            name="name"
                            label="Full Name"
                            placeholder="Ada"
                            type="text"
                            register={register}
                            error={errors?.name}
                        />
                    )}
                    {isSignUp && (
                        <InputField
                            name="lastName"
                            label="last Name"
                            placeholder="Lovelace"
                            type="text"
                            register={register}
                            error={errors?.lastName}
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
                        <div className="flex justify-between items-center text-[0.85rem]">
                            <label className="flex items-center gap-2 text-text-secondary cursor-pointer">
                                <input type="checkbox" name="remember" id="remember" className="w-4 h-4 accent-accent" />
                                <span>{UI.REMEMBER_ME}</span>
                            </label>
                            <a href="#" className="text-accent no-underline text-[0.85rem] hover:opacity-80 transition-opacity">{UI.FORGOT_PASSWORD}</a>
                        </div>
                    ) : (
                        <div className="flex justify-between items-center text-[0.85rem]">
                            <label className="flex items-center gap-2 text-text-secondary cursor-pointer">
                                <input type="checkbox" name="terms" id="terms" required className="w-4 h-4 accent-accent" />
                                <span>{UI.TERMS_AND_CONDITIONS}</span>
                            </label>
                        </div>
                    )}

                    {error && (
                        <div className="bg-error/10 border border-error/20 text-error text-sm p-3 rounded-lg">
                            {typeof error === 'string' ? error : error.message || ERRORS.GENERIC}
                        </div>
                    )}

                    <button type="submit" className="w-full py-2.5 px-6 bg-accent text-[#080c14] font-semibold text-[0.95rem] rounded-lg border-none cursor-pointer hover:opacity-90 transition-opacity">
                        { submitText }
                    </button>
                </form>

                <div className="text-center mt-6 pt-6 border-t border-white/6">
                    <p className="text-[0.875rem] text-text-muted mb-3">{altText}</p>
                    {!isSignUp ? (
                        <div className="flex gap-2">
                            <button type="button" className="flex-1 py-2 px-4 bg-white/4 border border-white/8 text-text-secondary text-[0.8rem] rounded-lg cursor-pointer hover:bg-white/8 transition-all" onClick={() => altButtonAction(ROLES.SEEKER)}>Sign up as Dev</button>
                            <button type="button" className="flex-1 py-2 px-4 bg-white/4 border border-white/8 text-text-secondary text-[0.8rem] rounded-lg cursor-pointer hover:bg-white/8 transition-all" onClick={() => altButtonAction(ROLES.RECRUITER)}>Sign up as Company</button>
                        </div>
                    ) : (
                        <button type="button" className="py-2 px-6 bg-white/4 border border-white/8 text-text-secondary text-[0.85rem] rounded-lg cursor-pointer hover:bg-white/8 transition-all" onClick={altButtonAction}>{altButtonText}</button>
                    )}
                </div>
            </div>
        </section>
    )
}

export default AuthForm
