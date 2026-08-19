import React from 'react'
import InputField from './InputField'
import { useForm } from 'react-hook-form'
import ApplyButton from './ApplyButton'
import { UI } from '../constants'
import { createCompany } from '../services/company.services'


const CompanyForm = () => {

    const { 
        register, 
        handleSubmit, 
        formState: { errors, isSubmitting }
    } = useForm()
    

    const onSubmit = (data) => {
        console.log('data', data)
        createCompany(data)
    } 
  return (
    <div>
        <h2>Create new Company</h2>

        <form onSubmit={handleSubmit(onSubmit)} >
            <InputField  
                name='name'
                label='Company name'
                placeholder='Google / Micorsoft / ...'
                register={register}
                error={errors?.name}
            />
            <InputField  
                name='description'
                label='Description'
                placeholder='Description...'
                register={register}
                error={errors?.description}
            />
            <InputField  
                name='industry'
                label='Indsutry'
                placeholder='Technologies / Cars / Real State...'
                register={register}
                error={errors?.industry}
            />
            <InputField  
                name='location'
                label='Location'
                placeholder='Mountain View, CA, United States'
                register={register}
                error={errors?.location}
            />
            <InputField  
                name='website'
                label='Website'
                type='url'
                placeholder='https://www.devjobs.com'
                register={register}
                error={errors?.website}
            />

            <ApplyButton 
                type='submit'
            >
                { isSubmitting ? "Submitting..." : UI.CONFIRM}
            </ApplyButton>

        </form>
    </div>
    
  )
}

export default CompanyForm