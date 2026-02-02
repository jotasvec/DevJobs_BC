import React from 'react'
import AuthForm from '../../components/AuthForm.jsx'
import { useRouter } from '../../hooks/useRouter.jsx'

const SignUp = () => {
  const { navigateTo } = useRouter()

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle sign up logic here
    console.log('Sign up submitted')
  }

  const handleSignInClick = () => {
    navigateTo('/signin')
  }

  return (
    <AuthForm
      isSignUp={true}
      onSubmit={handleSubmit}
      title="Create Account"
      subtitle="Join our community and find your dream job"
      submitText="Sign Up"
      altText="Already have an account?"
      altButtonText="Sign In"
      altButtonAction={handleSignInClick}
    />
  )
}

export default SignUp