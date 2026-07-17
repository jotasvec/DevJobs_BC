import AuthForm from '../../components/AuthForm.jsx'
import { useRouter } from '../../hooks/useRouter.jsx'
import { signIn, signUp } from '../../lib/auth-client.js'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from 'react';
import { signUpSchema } from '../../schemas/SignUp.js';

const SeekerSignUp = () => {
  const { navigateTo } = useRouter()
  const [error, setError] = useState(null)

  const { register, handleSubmit, formState:{ errors, isSubmitting } } = useForm({
    resolver: zodResolver(signUpSchema)
  })
  
  const onSubmit = async (data) => {
    try {
      const res = await signUp.email({
        name: data.name,
        email: data.email, 
        password: data.password,
        role: "seeker"
      })
      if(res.error) throw new Error(res.error.message);
      await signIn.email({
        email: data.email, 
        password: data.password,
      })
      navigateTo('/')
      
    } catch (err) {
      setError(err.message)
    }
  }

  const handleSignInClick = () => {
    navigateTo('/signin')
  }

  return (
    <AuthForm
      isSignUp={true}
      onSubmit={handleSubmit(onSubmit)}
      title="Create Account"
      subtitle="Join our community and start finding your dream developer job."
      submitText={isSubmitting? "Creating Account..." : "Create Account"}
      altText="Already have an account?"
      altButtonText="Sign In"
      altButtonAction={handleSignInClick}
      register={register}
      errors={errors}
      error={error}
    />
  )
}

export default SeekerSignUp