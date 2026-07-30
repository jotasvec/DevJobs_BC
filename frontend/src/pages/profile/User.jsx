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


const SuccessIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
        <path d="M9 12l2 2l4 -4" />
    </svg>
)

const ErrorIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
        <path d="M12 8l0 4" />
        <path d="M12 16l.01 0" />
    </svg>
)

const UserIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
        <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
    </svg>
)

const EditIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
        <path d="M9 12l2 2l4 -4" />
    </svg>
)

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
                    {feedback.type === 'success' ? <SuccessIcon /> : <ErrorIcon />}
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
                                <EditIcon />
                            </button>
                        </div>
                        <div className="profile-avatar-info">
                            <h3>{user.name} {user.lastName}</h3>
                            <p>{user.email}</p>
                        </div>
                    </div>
                    <div className="profile-section-header">
                        <div className="profile-section-icon">
                            <UserIcon />
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
