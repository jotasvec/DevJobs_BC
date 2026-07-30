import React, { useEffect, useMemo } from 'react'
import { userProfileSchema } from '../schemas/userProfile'
import { seekerProfileSchema } from '../schemas/seekerProfile'
import { recruiterProfileSchema } from '../schemas/recruiterProfile'
import { ROLES } from '../constants'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

export const useCombinedSchema = (user, profile) => {
  
    const combinedSchema = useMemo(() => {
        if(!user) return userProfileSchema
        return userProfileSchema.merge(
        user?.role === ROLES.SEEKER 
            ? seekerProfileSchema 
            : recruiterProfileSchema
        )
    }, [user])  

    const form = useForm({
        resolver: useMemo(
            () => zodResolver(combinedSchema),
            [combinedSchema]
        ),
    });

    useEffect(() => {
        if(!user) return;
            form.reset({
            ...user,
            ...(profile || {} )
        }); 
    }, [user, profile, form])


  return form  // { register, handleSubmit, reset, formState: { errors, isSubmitting } }
}
