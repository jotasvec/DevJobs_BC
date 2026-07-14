import AuthForm from '../../components/AuthForm.jsx';
import { useRouter } from '../../hooks/useRouter.jsx';
import { signIn } from '../../lib/auth-client.js';
import { useAuth } from '../../hooks/useAuth.jsx';
import { useState } from 'react';


const SignIn = () => {
  const { isLoggedIn } = useAuth()
  const { navigateTo } = useRouter();
  const [ error, setError ] = useState('');
  //const [isSignedIn, setIsSignedIn] = useState(false)
  const [loading, setLoading] = useState(false)

  if(isLoggedIn) navigateTo('/')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    try {
      const res = await signIn.email({email: email, password: password})
      
      if(res.error){
        setError(res.error)
        console.log('error', error)
      }
      navigateTo('/')
    } catch (error) {
        console.log('SignIn Failed', error)
    }

    console.log('Sign in submitted')
    setLoading(false)
  }

  const handleSignUpClick = (type) => {
    navigateTo(`/signup?type=${type}`)
  }



  return (
    <AuthForm
      isSignUp={isLoggedIn}
      onSubmit={handleSubmit}
      title="Welcome Back"
      subtitle="Sign in to access your dashboard and continue your job search."
      submitText={loading ? "Signing in" : "Sign In"}
      altText="Don't have an account?"
      altButtonText="Sign Up"
      altButtonAction={handleSignUpClick}
      error={error}
    />
  )
}

export default SignIn