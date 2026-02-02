import React from 'react'
import AuthForm from '../../components/AuthForm.jsx'
import { useRouter } from '../../hooks/useRouter.jsx'

const SignIn = () => {
  const { navigateTo } = useRouter()

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle sign in logic here
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
      subtitle="Keep up to date for the best jobs on the Industry"
      submitText="Log In"
      altText="Don't have an account?"
      altButtonText="Sign In"
      altButtonAction={handleSignUpClick}
    />
  )
}

export default SignIn