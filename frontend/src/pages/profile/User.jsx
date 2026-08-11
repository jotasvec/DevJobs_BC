import React, { useState } from 'react'
import { useParams } from 'react-router';
import { useRouter } from '../../hooks/useRouter';
import { ROUTES, UI, API, ROLES } from '../../constants.js';
import InputField from '../../components/InputField.jsx';
import TextareaField from '../../components/TextareaField.jsx';
import Recruiter from './Recruiter.jsx';
import Seeker from './Seeker.jsx';
import { useSession } from '../../lib/auth-client.js';
import useUserProfile from '../../hooks/useUserProfile.jsx';
import { updateRecruiterProfile, updateSeekerProfile, updateUser } from '../../services/users.services.js';
import { useCombinedSchema } from '../../hooks/useCombinedSchema.jsx';
import { CheckCircle2, AlertCircle, User, Pencil } from 'lucide-react';

const UserProfile = () => {
    const { userID } = useParams()
    const [feedback, setFeedback] = useState(null)
    
    const { navigateTo } = useRouter();
    const session = useSession()
    if (!session) navigateTo(ROUTES.HOME)

    const { user, profile, error, loading } = useUserProfile(userID)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useCombinedSchema(user, profile)

    

    const onSubmit = async (data) => {
        setFeedback(null);
        try {
            const { name, lastName, bio, image, phone, ...profileFields } = data;
            await updateUser(userID, {
                name, lastName, bio, image, phone
            })
           
            if (user.role === ROLES.SEEKER) {
                await updateSeekerProfile(profileFields)
            } else if(user.role === ROLES.RECRUITER) {
                await updateRecruiterProfile(profileFields)
            }

            setFeedback({ type: 'success', message: 'Profile saved successfully!' });
            setTimeout(() => setFeedback(null), 3000);
        } catch (err) {
            console.error('Failed to save profile:', err);
            setFeedback({ type: 'error', message: err.message || 'Failed to save profile. Please try again.' });
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
        <div className="profile-page">
            <div className="profile-header">
                <h1>Welcome, {user.name}</h1>
                <p>Manage your account settings and preferences</p>
            </div>

            {feedback && (
                <div className={`profile-feedback ${feedback.type}`}>
                    {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    {feedback.message}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="profile-section">
                    <div className="profile-avatar-section">
                        <div className="profile-avatar-wrapper">
                            <img
                                src={`https://unavatar.io/github/${user?.email?.split('@')[0] || 'user'}`}
                                alt={user.name}
                                className="profile-avatar"
                            />
                            <button type="button" className="profile-avatar-edit" title="Edit profile picture">
                                <Pencil size={14} />
                            </button>
                        </div>
                        <div className="profile-avatar-info">
                            <h3>{user.name} {user.lastName}</h3>
                            <p>{user.email}</p>
                        </div>
                    </div>
                    <div className="profile-section-header">
                        <div className="profile-section-icon">
                            <User size={16} />
                        </div>
                        <div>
                            <h2>Personal Information</h2>
                            <span>Your basic account details</span>
                        </div>
                    </div>
                    <div className="profile-grid">
                        <InputField label='Name' name='name' placeholder='John' register={register} error={errors?.name} />
                        <InputField label='Last Name' name='lastName' placeholder='Doe' register={register} error={errors?.lastName} />
                        <InputField label='Email' name='email' placeholder='user@johndoe.com' register={register} disabled />
                        <InputField label='Telephone' name='phone' type='tel' placeholder='+1 234 567 890' register={register} error={errors?.phone} />
                        <div className="full-width">
                            <TextareaField className="overflow-hidden h-auto" label='Biography' name='bio' placeholder="I'm a great engineer..." defaultValue={user.bio} register={register} error={errors?.bio} />
                        </div>
                    </div>
                </div>

                {user.role === ROLES.SEEKER && (
                    <Seeker profile={profile} register={register} errors={errors} />
                )}
                {user.role === ROLES.RECRUITER && (
                    <Recruiter profile={profile} register={register} errors={errors} />
                )}

                <div className="profile-actions">
                    <button type="submit" className="profile-save-btn" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : UI.SAVE_CHANGES}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default UserProfile
