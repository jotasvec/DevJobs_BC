import AuthForm from '../../components/AuthForm.jsx'
import { useRouter } from '../../hooks/useRouter.jsx'

const SignIn = () => {
  const { navigateTo } = useRouter()

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Sign in submitted')
  }

  const handleSignUpClick = (type) => {
    navigateTo(`/signup?type=${type}`)
  }

  return (
    <AuthForm
      isSignUp={false}
      onSubmit={handleSubmit}
      title="Welcome Back"
      subtitle="Sign in to access your dashboard and continue your job search."
      submitText="Sign In"
      altText="Don't have an account?"
      altButtonText="Sign Up"
      altButtonAction={handleSignUpClick}
    />
  )
}

export default SignIn