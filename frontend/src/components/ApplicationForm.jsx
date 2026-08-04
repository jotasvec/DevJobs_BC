import React from 'react'
import InputField from './InputField'
import { API, profileFields, ROLES, UI } from '../constants'
import ApplyButton from './ApplyButton'
import { useAuth } from '../hooks/useAuth'
import useUserProfile from '../hooks/useUserProfile'
import { useCombinedSchema } from '../hooks/useCombinedSchema'
import { createApplication } from '../services/applications.services'
import Loading from "../components/Loading";

const ApplicationForm = ({ jobId, isLoggedIn, onSuccess }) => {
    const { user: userSession } = useAuth()
    const { user, profile, loading } = useUserProfile(userSession?.id)
    
    const { 
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
     } = useCombinedSchema(user, profile)

    const onSubmit = async (data) => {
        if (!data) return
        
        const body = {
            job_id: jobId,
            contact_email: data.email,
            contact_phone: data.phone,
            resume_url: data.resumeUrl,
            portfolio_url: data.portfolio,
            cover_letter: data.coverLetter
        }
        try {
            await createApplication(body)
            onSuccess()

        } catch (error) {
            console.error("Error submitting application:", error);
        }
               

    }

    
    
    if (loading) {
        //return  <div className="page-loading"><span>{UI.LOADING_PROFILE}</span></div>
        return <Loading isLoading={loading} />
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