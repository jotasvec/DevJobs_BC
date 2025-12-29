import React from 'react'

const SignIn = () => {
  return (
    <>
        <h2 style={{paddingTop:'3rem' }}>Welcome Back</h2>
        <p>keep up to date for the best jobs on the Industry</p>
        <div className='signin-form'>
          <form action="">
            <input type="email" name="email" id="email" placeholder='Email' />
            <input type="password" name="password" id="password" placeholder='Password' />
            <div style={{display: 'flex', justifyContent: 'space-between', margin: '1rem 0' }}>
              <div>
                <input type="checkbox" name="remember" id="remember" /> 
                <label htmlFor='remember'>Remember Me</label>
              </div>
              <a href="#">Forgot password</a>
            </div>
            <button type='submit' > Log In </button>
          </form>
          <div className='form-bellow'>
            <p>Don't have an account</p>
            <div className=''>
              <button type="button">Sign Up as Dev</button>
              <button type="button">Sign Up as a Company</button>
            </div>
          </div>

        </div>

    </>
  )
}

export default SignIn