import React, { useState, useEffect, useRef, useCallback } from 'react'
import { API, ROLES } from '../constants'
import { getRecruiterProfile, getSeekerProfile, getUser } from '../services/users.services'


const useUserProfile = (userId) => {
    const [user, setUser] = useState({})
    const [profile, setProfile] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const lastFetchedId = useRef(null)

    const fetchProfile = useCallback(async (id) => {
        if (!id) return
        setLoading(true)
        setError(null)

        try {
            const userRes = await getUser(id)
            if(!userRes.success) throw new Error("Error fetching user Data");
            const userData = userRes.data
            setUser(userData)
            
            //getProfiles, seeker or recruiter
            let profileData = null;

            switch (userData.role) {
                case ROLES.SEEKER: 
                    profileData = await getSeekerProfile(id);
                    break;
                case ROLES.RECRUITER:
                    profileData = await getRecruiterProfile(id);
                    break;
            }

            setProfile(profileData)
            lastFetchedId.current = id
            
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    },[])

    useEffect(() => {
        if (userId && userId !== lastFetchedId.current) {
            fetchProfile(userId)
        }
    
    }, [userId, fetchProfile])

    const refetch = useCallback(() => {
        lastFetchedId.current = null
        fetchProfile(userId)
    },[fetchProfile, userId])
    
  return {
    user,
    profile,
    error,
    loading,
    refetch

  }
}

export default useUserProfile