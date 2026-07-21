import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { useRouter } from '../../hooks/useRouter';
import { ROUTES, UI, API, ROLES } from '../../constants.js';
import InputField from '../../components/InputField.jsx';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userProfileSchema } from '../../schemas/userProfile.js';
import { seekerProfileSchema } from '../../schemas/seekerProfile.js';
import { recruiterProfileSchema } from '../../schemas/recruiterProfile.js';
import Seeker from './Seeker.jsx';
import Recruiter from './Recruiter.jsx';
import { useSession } from '../../lib/auth-client.js';

const UserProfile = () => {
    const { userID } = useParams()
    const [user, setUser] = useState({})
    const [seekerProfile, setSeekerProfile] = useState(null)
    const [recruiterProfile, setRecruiterProfile] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const { navigateTo } = useRouter();
    const session = useSession()
    if(!session) navigateTo(ROUTES.HOME)
    

    //Schema
    const combinedSchema = user ? userProfileSchema.merge(
        user?.role === ROLES.SEEKER ? seekerProfileSchema : recruiterProfileSchema
    ) : userProfileSchema;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(combinedSchema),
    });

    useEffect(() => {
        if (!userID) return;

        fetch(`${API.USERS}/${userID}`, { credentials: 'include' })
            .then(res => {
                if (!res.ok) throw new Error(`User not found: ${res.statusText}`);
                return res.json();
            })
            .then(async (userDataRes) => {
                const userData = userDataRes.data
                if (userDataRes.success === true) {
                    setUser(userData);
                }
                if (userData.role === ROLES.SEEKER) {
                    const res = await fetch(`${API.USERS}/seeker-profile/${userID}`, { credentials: 'include' });
                    if (res.ok) {
                        const json = await res.json();
                        setSeekerProfile(json.data);
                        reset({ ...userData, ...json.data });
                    } else {
                        reset(userData);
                    }
                } else if (userData.role === ROLES.RECRUITER) {
                    const res = await fetch(`${API.USERS}/recruiter-profile/${userID}`, { credentials: 'include' });
                    if (res.ok) {
                        const json = await res.json();
                        setRecruiterProfile(json.data);
                        reset({ ...userData, ...json.data });
                    } else {
                        reset(userData);
                    }
                } else {
                    reset(userData);
                }
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [userID, reset]);

    const onSubmit = async (data) => {
        try {
            const { name, lastName, bio, image, ...profileFields } = data;

            await fetch(`${API.USERS}/${userID}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ name, lastName, bio, image }),
            });

            if (user.role === ROLES.SEEKER) {
                await fetch(`${API.USERS}/me/seeker-profile`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(profileFields),
                });
            } else if (user.role === ROLES.RECRUITER) {
                await fetch(`${API.USERS}/me/recruiter-profile`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(profileFields),
                });
            }
        } catch (err) {
            console.error('Failed to save profile:', err);
        }
    };

    if (loading) {
        return (
            <div className="page-loading">
                <span>{UI.LOADING_PROFILE}</span>
            </div>
        )
    }

    if (error || !user) {
        return (
            <div className="page-header">
                <h1>Profile Not Found</h1>
                <p>The User Profile doesn't exist or has been removed.</p>
                <button className="auth-submit" onClick={() => navigateTo(ROUTES.HOME)}>{UI.GO_HOME}</button>
            </div>
        )
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <h2>Welcome {user.name}</h2>

                <h3>User Data</h3>
                <div>
                    <div>
                        <InputField label='Name' name='name' placeholder='John' defaultValue={user.name} register={register} error={errors?.name} />
                        <InputField label='Last Name' name='lastName' placeholder='Doe' defaultValue={user.lastName} register={register} error={errors?.lastName} />
                    </div>
                    <InputField label='Email' name='email' placeholder='user@johndoe.com' defaultValue={user.email} disabled />
                    <InputField label='Biography' name='bio' placeholder=" I'm a great engineer ... " register={register} error={errors?.bio} />
                </div>

                {user.role === ROLES.SEEKER && (
                    <Seeker profile={seekerProfile} register={register} errors={errors} />
                )}
                {user.role === ROLES.RECRUITER && (
                    <Recruiter profile={recruiterProfile} register={register} errors={errors} />
                )}

                <button type="submit" className="auth-submit">
                    {!isSubmitting ? UI.SAVE_CHANGES : 'Saving...'}
                </button>
            </form>
        </div>
    )
}

export default UserProfile
