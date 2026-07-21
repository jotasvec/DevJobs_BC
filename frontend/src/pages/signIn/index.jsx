import AuthForm from '../../components/AuthForm.jsx';
import { useRouter } from '../../hooks/useRouter.jsx';
import { signIn } from '../../lib/auth-client.js';
import { useAuth } from '../../hooks/useAuth.jsx';
import { useLocation } from "react-router";
import { useState } from 'react';
import { ROLES, ROUTES, UI, ERRORS } from '../../constants.js';


const SignIn = () => {
  const { isLoggedIn } = useAuth()
  const { navigateTo } = useRouter();
  const location = useLocation()
  const [ error, setError ] = useState('');
  const [loading, setLoading] = useState(false)


  if(isLoggedIn) navigateTo(ROUTES.HOME)

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
      }else{
        const redirect = location.state?.from || ROUTES.HOME
        navigateTo(redirect)
      }
    } catch (error) {
        console.log('SignIn Failed', error)
    }
    setLoading(false)
  }

  const handleSignUpClick = (type) => {
    if (type === ROLES.RECRUITER){
      navigateTo(ROUTES.SIGNUP_RECRUITER);
    }else{
      navigateTo(ROUTES.SIGNUP_SEEKER)
    }
  }



  return (
    <AuthForm
      isSignUp={false}
      onSubmit={handleSubmit}
      title={UI.WELCOME_BACK}
      subtitle="Sign in to access your dashboard and continue your job search."
      submitText={loading ? UI.SIGNING_IN : UI.SIGN_IN}
      altText={UI.DONT_HAVE_ACCOUNT}
      altButtonText={UI.SIGN_UP}
      altButtonAction={handleSignUpClick}
      error={error}
    />
  )
}

export default SignIn