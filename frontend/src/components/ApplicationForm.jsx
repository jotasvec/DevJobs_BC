import React from 'react'
import InputField from './InputField'
import { API, profileFields, ROLES, UI } from '../constants'
import ApplyButton from './ApplyButton'
import { useAuth } from '../hooks/useAuth'
import useUserProfile from '../hooks/useUserProfile'
import { useCombinedSchema } from '../hooks/useCombinedSchema'

const ApplicationForm = ({ jobId, isLoggedIn }) => {
    const { user: userSession } = useAuth()
    const { user, profile, loading } = useUserProfile(userSession?.id)
    
    const { 
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
     } = useCombinedSchema(user, profile)

    const onSubmit = (data) => {
        console.log('hey! you have applied', data, jobId )
    }

    
    if (loading) {
        return <div className="page-loading"><span>{UI.LOADING_PROFILE}</span></div>
    }

  return (
    <section className='profile-section flex flex-col my-3'>
        <h2 className='text-2xl my-2'>Hey! apply here!</h2>
        <form onSubmit={handleSubmit(onSubmit)} action="">
            <div className='flex-2'>
                <InputField
                    name="name"
                    label="Name"
                    placeholder="Ada"
                    register={register}
                    error={errors?.name}
                />
            
                <InputField
                    name="lastName"
                    label="Last Name"
                    placeholder="Lovelace"
                    register={register}
                    error={errors?.lastName}

                />
                <InputField
                    name="email"
                    label="Email"
                    placeholder="you@company.com"
                    type="email"
                    register={register}    
                    error={errors?.email}
                />
                <InputField 
                    name='phone'
                    label='Phone'
                    type='tel'
                    placeholder='+1 123 456 789'
                    register={register}
                    error={errors?.phone}
                />
                
            </div>
            <div className="profile-grid">
                {profileFields.map(field => 
                    field.name === "coverLetter" 
                        ? (
                            <div key={field.name} className='flex flex-col gap-1 mt-4'>
                                <label htmlFor={field.name} >Cover Letter</label>
                                <textarea 
                                    name={field.name} 
                                    id={field.name} 
                                    {...register('coverLetter')}
                                />
                            </div>
                        ):(
                            <InputField
                                key={field.name}
                                name={field.name}
                                label={field.label}
                                type={field.type}
                                register={register}
                            />
                        )
                )}                
            </div>
            <ApplyButton 
                type='submit'
                disabled={!isLoggedIn}
            > 
            { isSubmitting ? "Applying ..." : UI.APPLY_NOW}
            </ApplyButton>
        </form>
    </section>
  )
}

export default ApplicationForm