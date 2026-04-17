import React from 'react'

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
    <>
        <h2 style={{paddingTop:'3rem' }}>{title}</h2>
        <p>{subtitle}</p>
        <div className='signin-form'>
          <form onSubmit={onSubmit}>
            {isSignUp && (
              <input type="text" name="name" id="name" placeholder='Full Name' required />
            )}
            <input type="email" name="email" id="email" placeholder='Email' required />
            <input type="password" name="password" id="password" placeholder='Password' required />
            {isSignUp && (
              <input type="password" name="confirmPassword" id="confirmPassword" placeholder='Confirm Password' required />
            )}
            {!isSignUp ? (
              <div style={{display: 'flex', justifyContent: 'space-between', margin: '1rem 0' }}>
                <div>
                  <input type="checkbox" name="remember" id="remember" /> 
                  <label htmlFor='remember'>Remember Me</label>
                </div>
                <a href="#">Forgot password</a>
              </div>
            ) : (
              <div style={{display: 'flex', justifyContent: 'space-between', margin: '1rem 0' }}>
                <div>
                  <input type="checkbox" name="terms" id="terms" required /> 
                  <label htmlFor='terms'>I agree to the Terms & Conditions</label>
                </div>
              </div>
            )}
            <button type='submit'>{submitText}</button>
          </form>
          <div className='form-bellow'>
            <p>{altText}</p>
            <div className=''>
              {!isSignUp ? (
                <>
                  <button type="button" onClick={() => altButtonAction('dev')}>Sign Up as Dev</button>
                  <button type="button" onClick={() => altButtonAction('company')}>Sign Up as a Company</button>
                </>
              ) : (
                <button type="button" onClick={altButtonAction}>{altButtonText}</button>
              )}
            </div>
          </div>
        </div>
    </>
  )
}

export default AuthForm