import AuthForm from '../../components/AuthForm.jsx'
import { useRouter } from '../../hooks/useRouter.jsx'
import { signIn, signUp } from '../../lib/auth-client.js'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from 'react';
import { signUpSchema } from '../../schemas/signUp.js';
import { ROLES, ROUTES, UI } from '../../constants.js';


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
        role: ROLES.SEEKER
      })
      if(res.error) throw new Error(res.error.message);
      await signIn.email({
        email: data.email, 
        password: data.password,
      })
      navigateTo(ROUTES.HOME)

    } catch (err) {
      setError(err.message)
    }
  }

  const handleSignInClick = () => {
    navigateTo(ROUTES.SIGNIN)
  }

  return (
    <AuthForm
      isSignUp={true}
      onSubmit={handleSubmit(onSubmit)}
      title={UI.CREATE_ACCOUNT}
      subtitle="Join our community and start finding your dream developer job."
      submitText={isSubmitting? UI.CREATING_ACCOUNT : UI.CREATE_ACCOUNT}
      altText={UI.ALREADY_HAVE_ACCOUNT}
      altButtonText={UI.SIGN_IN}
      altButtonAction={handleSignInClick}
      register={register}
      errors={errors}
      error={error}
    />
  )
}

export default SeekerSignUp